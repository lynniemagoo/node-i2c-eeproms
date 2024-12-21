'use strict';
/*
 * EEPROM Example code
 *
 * Copyright (c) 2024 Lyndel McGee <lynniemagoo@yahoo.com>
 *
 * This example is showing you how to write to and read from the chip.
 *
 */

// Import the EEPROM class
//import { EEPROM, AT24C512 } from 'i2c-eeproms';
import { EEPROM, AT24C512 as ChipConstructor} from '../';

// Import the i2c-bus module
import { /*I2CBus, */PromisifiedBus, /*openSync as I2CBusOpenSync, */openPromisified as I2CBusOpenPromisified } from 'i2c-bus';

const example = async () : Promise<void> => {
  // Adjust for your Raspberry Pi or other device
  const busNumber: number = 1;
  // Adjust for your EEPROM's address - for address 0x50, specify 0x50, for address 0x57, specify 0x57.
  // Some chips don't support 8 distinct addresses on the bus and as such an error will be thrown during construction.
  const i2cAddress: number = 0x50;

  // This library can accept either an I2CBus or a PromisifiedBus as an input parameter
  const i2cBus: PromisifiedBus = await I2CBusOpenPromisified(busNumber);
  const chip: EEPROM = new ChipConstructor(i2cBus, i2cAddress);

  // Create text that is larger than 2 pages of an EEPROM
  const textIn: string = '00:0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{|}~' +
    '01!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '02!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '03!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '04!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '05!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '06!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '07!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~';

  console.log('Read/Write Test for chip:%s', chip.name);
  const maxAddress: number = chip.storageSizeInBytes;
  // Writes to the chip are not limited to the maximum page size the EEPROM supports.
  // Page writes are managed internally by the EEPROM implementation.
  const blockSize: number = chip.pageSizeInBytes * 2;

  const maxLoops: number = 2;
  let loopCount: number = 0;

  while1: while (loopCount++ < maxLoops) {
    for (let address: number = 0x00; address < maxAddress; address += blockSize) {
      console.log('loopCount:%o address:0x%s', loopCount, address.toString(16).padStart(4, '0'));
      const toWrite: string = textIn.substring(0, blockSize);
      const bytesWritten: number = await chip.writeDataBlock(address, toWrite);
      const readResult: Buffer = await chip.readDataBlock(address, bytesWritten);
      const textOut: string = readResult.toString('utf-8');
      if (textOut != toWrite) {
        console.log('Read/Write Text Mismatch!.  read:"%s"', textOut);
        break while1;
      }
    }
  }

  console.log('Clearing EEPROM with 0x00s');
  const bufferWithNulls = Buffer.alloc(blockSize);
  for (let address: number = 0x00; address < maxAddress; address += blockSize) {
    console.log('address:0x%s', address.toString(16).padStart(4, '0'));
    const bytesWritten: number = await chip.writeDataBlock(address, bufferWithNulls);
    const readResult: Buffer = await chip.readDataBlock(address, bytesWritten);
    for (let i: number = 0; i < readResult.byteLength; i++) {
      if (readResult[i] !== 0x00) {
        console.log('Failed to clear EEPROM Memory');
        break;
      }
    }
  }
  await i2cBus.close();
};

// Run the example
example().catch(console.error);

