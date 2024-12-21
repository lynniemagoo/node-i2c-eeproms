'use strict'

import * as Util from 'node:util'
import { Buffer } from 'node:buffer'
import { type Memory_Organization, type EEPROM_Profile, Profiles } from './profiles'

import {
  /*type BytesWritten,*/
  type BytesRead,
  I2CBus,
  PromisifiedBus
} from 'i2c-bus'

export type EEPROMDataTypes = Buffer | Uint8Array | Uint8ClampedArray | string

export interface EEPROM {
  // Name of the chip
  readonly name: string
  // Detailed information about the chip
  readonly detail: string
  // Maximum number of devices supported on single bus
  readonly maxDevices: number
  // Array containing allowed I2C addresses
  readonly i2cAddressesAllowed: Array<number>
  // Storage size in bytes (8-bit words)
  readonly storageSizeInBytes: number
  // Number of memory pages on the chip
  readonly pageCount: number
  // Page size in bytes (8-bit words)
  readonly pageSizeInBytes: number

  readDataBlock(memoryAddress: number, byteCount: number) : Promise<Buffer>
  writeDataBlock(memoryAddress: number, data: EEPROMDataTypes, stringEncoding?: string) : Promise<number>
}

export type EEPROMConstructor = new (i2cBus: I2CBus | PromisifiedBus, i2cAddress: number) => EEPROM

export const createProfiledEEPROMClass = (profile: EEPROM_Profile) : EEPROMConstructor => {
  return class extends ProfiledEEPROM {
    constructor(i2cBus: I2CBus | PromisifiedBus, i2cAddress: number) {
      super(profile, i2cBus, i2cAddress)
    }
  }
}

type AddressingDataTuple = [ i2cAddress: number, normalizedMemoryAddress: number ]

const sleepMs = (ms: number) : Promise<void> => new Promise(r => setTimeout(r, ms));

export class ProfiledEEPROM implements EEPROM {
  protected readonly busPromisified: boolean
  protected readonly profile: EEPROM_Profile
  protected readonly i2cBus: PromisifiedBus
  protected readonly i2cAddress: number

  // Number of bits required to address a byte of memory on the chip
  protected readonly addressBitsRequired: number
  // Number of bits from memory address that must be OR'ed with the i2cAddress
  protected readonly addressOverflowBits: number

  protected readonly postWriteDelayMs: number
  // Used internally to ensure we don't try to access an address outside the chip's memory.
  protected readonly memoryAddressMask: number

  // Fields echoed via interface read directly from the profile.
  public readonly storageSizeInBytes: number
  public readonly pageCount: number
  public readonly pageSizeInBytes: number


  public constructor(profile: EEPROM_Profile, i2cBus: I2CBus | PromisifiedBus, i2cAddress: number) {
    const i2cAddressesAllowed: Array<number> = profile.i2cAddressesAllowed
    if (!i2cAddressesAllowed.includes(i2cAddress)) {
      const hexStringArray: Array<string> = i2cAddressesAllowed.map((x) => ('0x' + x.toString(16)))
      const message = `Invalid I2C address.  EEPROM:${profile.name} only supports the following I2C address(es): [${hexStringArray}].`
      throw new Error(message)
    }
    // As PromisifiedBus and I2CBus are both interfaces in typescript, there's no good way to tell which class they are except byte looking at the type of the conversion function.
    const busNotPromisified = (typeof((<I2CBus>i2cBus).promisifiedBus) === 'function')
    this.i2cBus = busNotPromisified ? (<I2CBus>i2cBus).promisifiedBus() : i2cBus as unknown as PromisifiedBus
    this.i2cAddress = i2cAddress
    this.profile = profile

    this.addressBitsRequired = profile.addressBitsRequired
    // If number of address bits > 8 then we have possibility of overflow bits that must be put into the I2C address.
    const addressOverflowBits: number = (this.addressBitsRequired <= 8 ? 0 : this.addressBitsRequired % 8)
    // If we have between 1 and 3 addressOverflowBits bits, we will OR the i2cAddress with the topmost overflow bits from a memory address.
    this.addressOverflowBits = ((addressOverflowBits >= 1) && (addressOverflowBits <= 3)) ? addressOverflowBits : 0


    this.postWriteDelayMs = profile.postWriteDelayMs | 0

    const memoryOrganization: Memory_Organization = profile.memoryOrganization
    this.storageSizeInBytes = memoryOrganization.storageSizeInBytes
    this.pageCount = memoryOrganization.pageCount
    this.pageSizeInBytes = memoryOrganization.pageSizeInBytes

    this.memoryAddressMask = this.storageSizeInBytes - 1
  }

  public get name() : string { return this.profile.name }
  public get detail() : string { return this.profile.detail }
  public get maxDevices(): number { return this.profile.i2cAddressesAllowed.length }
  public get i2cAddressesAllowed(): Array<number> { return this.profile.i2cAddressesAllowed.slice() }

  protected _createAddressArray(normalizedMemoryAddress: number) : Array<number> {
    const addressBitsRequired: number = this.addressBitsRequired
    // Create Uint8Array based on number of bytes required for addressing.
    const memoryAddressArray: Array<number> = []
    if (addressBitsRequired >= 16) {
      // MSB goes to location 0 - Here we bitwise AND with 0xFF to clear any bits above 16 that we might have.
      memoryAddressArray[0] = (normalizedMemoryAddress >>> 8) & 0xFF
      // LSB goes to location 1.
      memoryAddressArray[1] = normalizedMemoryAddress & 0xFF
    } else if (addressBitsRequired > 11) {
      // More than 11 address bits requires 2 bytes as we only have 3 possible bits in the I2C address we can use.
      // MSB goes to location 0 - Here we clear the topmost bits.  ie. If we have 11 bits, we will >>> 8 and then bitwise AND with ((1 << 3) - 1)
      memoryAddressArray[0] = (normalizedMemoryAddress >>> 8) & ((1 << (addressBitsRequired - 8)) - 1)
      // LSB goes to location 1.
      memoryAddressArray[1] = normalizedMemoryAddress & 0xFF
    } else {
      // LSB goes to location 0.
      memoryAddressArray[0] = normalizedMemoryAddress & ((1 << addressBitsRequired) - 1)
    }
    return memoryAddressArray
  }

  protected _createAddressingData(memoryAddress: number) : AddressingDataTuple {
    // Mask/limit according to max number of bytes in device
    const normalizedMemoryAddress: number = memoryAddress & this.memoryAddressMask
    const addressOverflowBits: number = this.addressOverflowBits

    let i2cAddress: number = this.i2cAddress
    // If the i2c address requires bits from the memory address, OR them in.
    if (addressOverflowBits) {
      // Here we OR the i2cAddress with the value in the topmost overflow bits of the address.
      i2cAddress |= ((normalizedMemoryAddress >>> (this.addressBitsRequired - addressOverflowBits)) & ((1 << addressOverflowBits) - 1))
    }

    return [ i2cAddress, normalizedMemoryAddress ]
  }

  protected async _readDataBlockChunked(memoryAddress: number, byteCount: number) : Promise<Buffer> {
    const { i2cBus, storageSizeInBytes , pageSizeInBytes, postWriteDelayMs } = this
    const endAddress: number = memoryAddress + byteCount

    // Will this write cause a chip memory wrap?
    if (endAddress > storageSizeInBytes) {
      throw new Error('Memory Wrap Overflow')
    }

    let bytesRemaining: number = byteCount,
      addr: number = memoryAddress

    const arrRxBuffers: Array<Buffer> = []

    // We have more than one I2C request that will be required.
    while (bytesRemaining > 0) {

      const [ i2cAddress, normalizedMemoryAddress ] = this._createAddressingData(addr)
      // Ensure that if memoryAddress is larger than storage size, that we bound it to storage size for the page calculation by using normalizedMemoryAddress.
      //const page: number = Math.trunc(normalizedMemoryAddress / pageSizeInBytes)
      const pageAddr: number = normalizedMemoryAddress % pageSizeInBytes
      const bytesThisPage: number = Math.min(bytesRemaining, pageSizeInBytes - pageAddr)
      const addressData: Buffer = Buffer.from(this._createAddressArray(normalizedMemoryAddress))

      /*const writeResult: BytesWritten = */await i2cBus.i2cWrite(i2cAddress, addressData.byteLength, addressData)
      if (postWriteDelayMs > 0) {
        await sleepMs(postWriteDelayMs);
      }

      const i2cBuffer: Buffer = Buffer.alloc(bytesThisPage)
      const readResult: BytesRead = await i2cBus.i2cRead(i2cAddress, i2cBuffer.byteLength, i2cBuffer)

      if (readResult.bytesRead === bytesThisPage) {
        arrRxBuffers.push(readResult.buffer)
      } else {
        console.error('Read mismatch');
      }

      addr += bytesThisPage
      bytesRemaining -= bytesThisPage
    }

    const buffFinal:Buffer = (arrRxBuffers.length > 0) ? Buffer.concat(arrRxBuffers) : null
    return buffFinal

  }

  protected async _readDataBlockComplete(memoryAddress: number, byteCount: number) : Promise<Buffer> {
    const { i2cBus, storageSizeInBytes, postWriteDelayMs } = this
    const endAddress: number = memoryAddress + byteCount

    // Will this write cause a chip memory wrap?
    if (endAddress > storageSizeInBytes) {
      throw new Error('Memory Wrap Overflow.')
    }

    // Write the address
    const [ i2cAddress, normalizedMemoryAddress ] = this._createAddressingData(memoryAddress)
    const addressData: Buffer = Buffer.from(this._createAddressArray(normalizedMemoryAddress))
    /*const writeResult: BytesWritten = */await i2cBus.i2cWrite(i2cAddress, addressData.byteLength, addressData)
    if (postWriteDelayMs > 0) {
      await sleepMs(postWriteDelayMs)
    }

    const i2cBuffer: Buffer = Buffer.alloc(byteCount)
    const readResult: BytesRead = await i2cBus.i2cRead(i2cAddress, i2cBuffer.byteLength, i2cBuffer)

    let buffFinal: Buffer
    if (readResult.bytesRead === byteCount) {
      buffFinal = readResult.buffer
    } else {
      buffFinal = null
      console.error('Read mismatch');
    }

    return buffFinal
  }

  protected async setMemoryAddress(memoryAddress: number) : Promise<number> {
    const { i2cBus, postWriteDelayMs } = this
    const [ i2cAddress, normalizedMemoryAddress ] = this._createAddressingData(memoryAddress)

    const addressData: Buffer = Buffer.from(this._createAddressArray(normalizedMemoryAddress))
    /*const writeResult: BytesWritten = */await i2cBus.i2cWrite(i2cAddress, addressData.byteLength, addressData)

    if (postWriteDelayMs > 0) {
      await sleepMs(postWriteDelayMs)
    }

    return normalizedMemoryAddress
  }

  public async writeDataBlock(memoryAddress: number, data: EEPROMDataTypes, stringEncoding: string = 'utf-8') : Promise<number> {
    const { i2cBus, storageSizeInBytes , pageSizeInBytes, postWriteDelayMs } = this
    let dataBuffer: Buffer = null
    if (typeof(data) === 'string') {
      dataBuffer = Buffer.from(data, <BufferEncoding>stringEncoding)
    } else if (Buffer.isBuffer(data)) {
      dataBuffer = <Buffer>data
    } else if (Util.types.isUint8Array(data)) {
      dataBuffer = Buffer.from(<Uint8Array>data)
    } else if (Util.types.isUint8ClampedArray(data)) {
      dataBuffer = Buffer.from(<Uint8ClampedArray>data)
    } else {
      throw new Error('Parameter \'data\' must be a Buffer, Uint8Array, Uint8ClampedArray, or a string.')
    }

    const byteCount: number = dataBuffer.byteLength,
      endAddress: number = memoryAddress + byteCount
      // Will this write cause a chip memory wrap?

    if (endAddress > storageSizeInBytes) {
      throw new Error('Memory Wrap Overflow.')
    }

    let bytesRemaining: number = byteCount,
      addr: number = memoryAddress,
      bytesProcessed: number = 0

    // We can have more than one I2C request that will be required.
    while (bytesRemaining > 0) {

      const [ i2cAddress, normalizedMemoryAddress ] = this._createAddressingData(addr)

      // Ensure that if memoryAddress is larger than storage size, that we bound it to storage size for the page calculation by using normalizedMemoryAddress.
      //const page: number = Math.trunc(normalizedMemoryAddress / pageSizeInBytes)
      const pageAddr: number = normalizedMemoryAddress % pageSizeInBytes
      const bytesThisPage: number = Math.min(bytesRemaining, pageSizeInBytes - pageAddr)
      const addressArray: Array<number> = this._createAddressArray(normalizedMemoryAddress)
      const pageData: Buffer = dataBuffer ? dataBuffer.subarray(bytesProcessed, bytesProcessed + bytesThisPage) : null

      let i2cBuffer: Buffer
      if (pageData && pageData.byteLength) {
        i2cBuffer = Buffer.allocUnsafe(addressArray.length + pageData.byteLength)
        i2cBuffer.set(addressArray)
        i2cBuffer.set(pageData, addressArray.length)
      } else {
        i2cBuffer = Buffer.from(addressArray)
      }

      /*const writeResult: BytesWritten = */await i2cBus.i2cWrite(i2cAddress, i2cBuffer.byteLength, i2cBuffer)
      if (postWriteDelayMs > 0) {
        await sleepMs(postWriteDelayMs)
      }

      addr += bytesThisPage
      bytesProcessed += bytesThisPage
      bytesRemaining -= bytesThisPage

    }

    return bytesProcessed
  }

  public async readDataBlock(memoryAddress: number, byteCount: number) : Promise<Buffer> {
    // If the I2C address requires any address overflow bits, we must read one page at a time as I2C address can change across pages.
    return (this.addressOverflowBits) ?
      this._readDataBlockChunked(memoryAddress, byteCount) :
      this._readDataBlockComplete(memoryAddress, byteCount)
  }
}

export const AT24C01 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C01)
export const AT24C02 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C02)
export const AT24C04 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C04)
export const AT24C08 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C08)
export const AT24C16 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C16)

export const AT24C32 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C32)
export const AT24C64 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C64)
export const AT24C128 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C128)
export const AT24C256 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C256)
export const AT24C512 : EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C512)

export const AT24C32C :   EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C32C)
export const AT24C64C :   EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C64C)
export const AT24C128C :  EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C128C)
export const AT24C256C :  EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C256C)
export const AT24C512C :  EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24C512C)

export const K24C256C: EEPROMConstructor = createProfiledEEPROMClass(Profiles.K24C256C);

export const AT24CM01 :  EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24CM01)
export const AT24CM02 :  EEPROMConstructor = createProfiledEEPROMClass(Profiles.AT24CM02)
