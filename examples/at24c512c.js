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
//const ChipConstructor = require('i2c-eeproms').AT24C512C;
const ChipConstructor = require('../').AT24C512C;

// Import the i2c-bus module
const { openSync: I2CBusOpenSync, openPromisified: I2CBusOpenPromisified } = require('i2c-bus');

const example = async () => {
  // Adjust for your Raspberry Pi or other device
  const busNumber = 1;
  // Adjust for your EEPROM's address - for address 0x50, specify 0x50, for address 0x57, specify 0x57.
  // Some chips don't support 8 distinct addresses on the bus and as such an error will be thrown during construction.
  const i2cAddress = 0x50;

  // This library can accept either an I2CBus or a PromisifiedBus as an input parameter
  const i2cBus = await I2CBusOpenPromisified(busNumber);
  const chip = new ChipConstructor(i2cBus, i2cAddress);

  // Create text that is larger than 2 pages of an EEPROM
  const textIn = '00:0123456789@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{|}~' +
    '01!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '02!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '03!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '04!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '05!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '06!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~' +
    '07!#?$%&()*+,-./0123456789:;<->?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^abcdefghijklmnopqrstuvwxyz{|}~';

  console.log('Read/Write Test for chip:%s', chip.name);
  const maxAddress = chip.storageSizeInBytes;
  // Writes to the chip are not limited to the maximum page size the EEPROM supports.
  // Page writes are managed internally by the EEPROM implementation.
  const blockSize = chip.pageSizeInBytes * 2;

  const maxLoops = 2;
  let loopCount = 0;

  while1: while (loopCount++ < maxLoops) {
    for (let address = 0x00; address < maxAddress; address += blockSize) {
      console.log('loopCount:%o address:0x%s', loopCount, address.toString(16).padStart(4, '0'));
      const toWrite = textIn.substring(0, blockSize);
      const bytesWritten = await chip.writeDataBlock(address, toWrite);
      const readResult = await chip.readDataBlock(address, bytesWritten);
      const textOut = readResult.toString('utf-8');
      if (textOut != toWrite) {
        console.log('Read/Write Text Mismatch!.  read:"%s"', textOut);
        break while1;
      }
    }
  }

  console.log('Clearing EEPROM with 0x00s');
  const bufferWithNulls = Buffer.alloc(blockSize);
  for (let address = 0x00; address < maxAddress; address += blockSize) {
    console.log('address:0x%s', address.toString(16).padStart(4, '0'));
    const bytesWritten = await chip.writeDataBlock(address, bufferWithNulls);
    const readResult = await chip.readDataBlock(address, bytesWritten);
    for (let i = 0; i < readResult.byteLength; i++) {
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

