'use strict'
export interface Memory_Organization {
  // Number of bytes (8-bit words) that the chip supports.
  readonly storageSizeInBytes: number
  // Number of memory pages within the chip.
  readonly pageCount: number
  // Number of bytes within each page.
  readonly pageSizeInBytes: number
}


export interface EEPROM_Profile {
  // Name for the Chip
  readonly name: string
  // Descriptive name for the profile Name[maxDevices>](<storageSizeInBytes>)
  readonly detail: string
  // Allowed I2C Addresses
  readonly i2cAddressesAllowed: Array<number>
  // Number of bits required to create a memory address in the chip.
  readonly addressBitsRequired: number
  // Delay in Milliseconds that a chip requires post-write to stabilize memory.
  readonly postWriteDelayMs: number
  // Memory Organization
  readonly memoryOrganization: Memory_Organization
}

const createMemoryOrganization = (pageCount: number, pageSizeInBytes: number) : Memory_Organization => {
  return { storageSizeInBytes: pageCount * pageSizeInBytes, pageCount, pageSizeInBytes }
}

const Memory_1kb_16_8: Memory_Organization =    createMemoryOrganization(16, 8)
const Memory_2kb_32_8: Memory_Organization =    createMemoryOrganization(32, 8)

const Memory_4kb_32_16: Memory_Organization =     createMemoryOrganization(32, 16)
const Memory_8kb_64_16: Memory_Organization =     createMemoryOrganization(64, 16)
const Memory_16kb_128_16: Memory_Organization =   createMemoryOrganization(128, 16)

const Memory_32kb_128_32: Memory_Organization =   createMemoryOrganization(128, 32)
const Memory_64kb_256_32: Memory_Organization =   createMemoryOrganization(256, 32)

const Memory_128kb_256_64: Memory_Organization =  createMemoryOrganization(256, 64)
const Memory_256kb_512_64: Memory_Organization =  createMemoryOrganization(512, 64)

const Memory_512kb_512_128: Memory_Organization =   createMemoryOrganization(512, 128)

const Memory_1mb_512_256: Memory_Organization =   createMemoryOrganization(512, 256)
const Memory_2mb_1024_256: Memory_Organization =  createMemoryOrganization(1024, 256)

const I2C_Addresses_Allowed_8_Devices =     [0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57]
const I2C_Addresses_Allowed_4_Devices =     [0x50, 0x52, 0x54, 0x56]
const I2C_Addresses_Allowed_4_Devices_A2_0 =  [0x50, 0x51, 0x52, 0x53]
const I2C_Addresses_Allowed_2_Devices =     [0x50, 0x54]
const I2C_Addresses_Allowed_1_Devices =     [0x50]

// For the profiles below, assumption is you are running a chip at 2.7v or higher.
// As such, the postWriteDelay is configured based on that voltage from the
// corresponding datasheet.
const AT24C01: EEPROM_Profile = {
  name: 'AT24C01',
  detail: 'AT24C01[8](128)',
  // The 1Kb EEPROM allows up to 8 devices on the bus
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 7,
  // Delay is 5ms for 1.8 volt, 5ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_1kb_16_8
}

const AT24C02: EEPROM_Profile = {
  name: 'AT24C02',
  detail: 'AT24C02[8](256)',
  // The 2Kb EEPROM allows up to 8 devices on the bus
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 8,
  // Delay is 5ms for 1.8 volt, 5ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_2kb_32_8
}

const AT24C04: EEPROM_Profile = {
  name:'AT24C04',
  detail:'AT24C04[4](512)',
  // The 4Kb EEPROM allows up to 4 devices on the bus
  i2cAddressesAllowed: I2C_Addresses_Allowed_4_Devices,
  addressBitsRequired: 9,
  // Delay is 5ms for 1.8 volt, 5ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_4kb_32_16
}

const AT24C08: EEPROM_Profile = {
  name: 'AT24C08',
  detail: 'AT24C08[2](1024)',
  // The 8Kb EEPROM allows up to 2 devices on the bus
  // The original AT24C08 is detected on all addresses 0x50-0x53 or 0x54-0x57 but users should only use 0x50 or 0x54 as the lowest 2 bits are part of address.
  i2cAddressesAllowed: I2C_Addresses_Allowed_2_Devices,
  addressBitsRequired: 10,
  // Delay is 5ms for 1.8 volt, 5ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_8kb_64_16
}

const AT24C16: EEPROM_Profile = {
  name: 'AT24C16',
  detail: 'AT24C16[1](2048)',
  // The 16Kb EEPROM only allows 1 device.
  // The original AT24C16 is detected on all addresses 0x50-0x57 but users should only use 0x50.
  i2cAddressesAllowed: I2C_Addresses_Allowed_1_Devices,
  addressBitsRequired: 11,
  // Delay is 5ms for 1.8 volt, 5ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_16kb_128_16
}

const AT24C32: EEPROM_Profile = {
  name: 'AT24C32',
  detail: 'AT24C32[8](4096)',
  // The 32Kb EEPROM only allow 8 devices.
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 12,
  // Delay is 20ms for 1.8 volt, 10ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 10,
  memoryOrganization: Memory_32kb_128_32
}

const AT24C64: EEPROM_Profile = {
  name: 'AT24C64',
  detail: 'AT24C64[8](8192)',
  // The 64Kb EEPROM allows 8 devices.
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 13,
  // Delay is 20ms for 1.8 volt, 10ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 10,
  memoryOrganization: Memory_64kb_256_32
}

const AT24C128: EEPROM_Profile = {
  name: 'AT24C128',
  detail: 'AT24C128[4](16384)',
  // The 128Kb EEPROM only allows 4 devices (A2 is always 0, A1, A0).
  i2cAddressesAllowed: I2C_Addresses_Allowed_4_Devices_A2_0,
  addressBitsRequired: 14,
  // Delay is 20ms for 1.8 volt, 10ms for 2.7 or 5.0 volt where 5ms allowed for the Process Letter 'B' on the chips
  // See datasheet for tWR
  postWriteDelayMs: 10,
  memoryOrganization: Memory_128kb_256_64
}

const AT24C256: EEPROM_Profile = {
  name: 'AT24C256',
  detail: 'AT24C256[4](32768)',
  // The 256Kb EEPROM only allows 4 devices (A2 is always 0, A1, A0).
  i2cAddressesAllowed: I2C_Addresses_Allowed_4_Devices_A2_0,
  addressBitsRequired: 15,
  // Delay is 20ms for 1.8 volt, 10ms for 2.7 or 5.0 volt where 5ms allowed for the Process Letter 'B' on the chips
  // See datasheet for tWR
  postWriteDelayMs: 10,
  memoryOrganization: Memory_256kb_512_64
}

const AT24C512: EEPROM_Profile = {
  name: 'AT24C512',
  detail: 'AT24C512[4](65536)',
  // The 512Kb EEPROM only allows 4 devices (A2 is always 0, A1, A0).
  i2cAddressesAllowed: I2C_Addresses_Allowed_4_Devices_A2_0,
  addressBitsRequired: 16,
  // Delay is 20ms for 1.8 volt, 10ms for 2.7 or 5.0 volt where 5ms allowed for the Process Letter 'A' on the chips
  // See datasheet for tWR
  postWriteDelayMs: 10,
  memoryOrganization: Memory_512kb_512_128
}

const AT24C32C: EEPROM_Profile = {
  name: 'AT24C32C',
  detail: 'AT24C32C[8](4096)',
  // The 32Kb EEPROM only allow 8 devices.
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 12,
  // Delay is 5ms for 1.8 volt, 5ms for 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_32kb_128_32
}

const AT24C64C: EEPROM_Profile = {
  name: 'AT24C64C',
  detail: 'AT24C64C[8](8192)',
  // The 64Kb EEPROM allows 8 devices.
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 13,
  // Delay is 5ms for 1.8 volt, 5ms for 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_64kb_256_32
}

const AT24C128C: EEPROM_Profile = {
  name: 'AT24C128C',
  detail: 'AT24C128C[8](16384)',
  // The 128Kb EEPROM allows 8 devices (A2, A1, A0).
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 14,
  // Delay is 5ms for 1.8 volt, 5ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_128kb_256_64
}

const AT24C256C: EEPROM_Profile = {
  name: 'AT24C256C',
  detail: 'AT24C256C[8](32768)',
  // The 256Kb EEPROM allows 8 devices (A2, A1, A0).
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 15,
  // Delay is 5ms for 1.8 volt, 5ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_256kb_512_64
}

// The K24C256C V 1.8 from 2014
// http://www.szhaina.com/uploads/media/20220416/1650103936.pdf
// If set for Device 0 responses in i2cdetect with both 0x50 and Device 8 0x58
// It appears that this chip will respond to it's configured address and the configured address plus 0x08 for i2cdetect.
// The datasheet states that A2 is not connected however, if A2 is set high, the devices reported by i2cdetect are 0x54 and 0x5C
const K24C256C: EEPROM_Profile = {
  name: 'K24C256C',
  detail: 'KLine K24C256C(v1.8 2014) [8](32768)',
  // The 256Kb EEPROM only allows 8 devices (A2, A1, A0) but has a ghost address of 0x08 so 0x50 with 0x58 as a ghost.
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 15,
  // Delay is 3.3ms type, 5ms max for 1.8, 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_256kb_512_64
}


const AT24C512C: EEPROM_Profile = {
  name: 'AT24C512C',
  detail: 'AT24C512C[8](65536)',
  // The 512Kb EEPROM allows 8 devices (A2, A1, A0).
  i2cAddressesAllowed: I2C_Addresses_Allowed_8_Devices,
  addressBitsRequired: 16,
  // Delay is 5ms for 1.8 volt, 5ms for 2.7 or 5.0 volt
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_512kb_512_128
}

const AT24CM01: EEPROM_Profile = {
  name:'AT24CM01',
  detail:'AT24CM01[4](131072)',
  // The 1Mb EEPROM allows up to 4 devices on the bus
  i2cAddressesAllowed: I2C_Addresses_Allowed_4_Devices,
  // Number of bits required to create a memory address in the chip.
  addressBitsRequired: 17,
  // Delay is 5ms for 1.7 volt, 5ms for 2.5 volt (Fast Mode or Fast Mode Plus)
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_1mb_512_256
}

const AT24CM02: EEPROM_Profile = {
  name:'AT24CM02',
  detail:'AT24CM02[2](262144)',
  // The 2Mb EEPROM allows up to 4 devices on the bus
  i2cAddressesAllowed: I2C_Addresses_Allowed_2_Devices,
  // Number of bits required to create a memory address in the chip.
  addressBitsRequired: 18,
  // Delay is 5ms for 1.7 volt, 5ms for 2.5 volt (Fast Mode or Fast Mode Plus)
  // See datasheet for tWR
  postWriteDelayMs: 5,
  memoryOrganization: Memory_2mb_1024_256
}

export const Profiles : NodeJS.Dict<EEPROM_Profile> = {
  AT24C01,
  AT24C02,
  AT24C04,
  AT24C08,
  AT24C16,

  AT24C32,
  AT24C64,

  AT24C128,
  AT24C256,
  AT24C512,

  AT24C32C,
  AT24C64C,
  AT24C128C,
  AT24C256C,
  K24C256C,
  AT24C512C,

  AT24CM01,
  AT24CM02
}