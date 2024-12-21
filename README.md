# Node.js I2C access for various AT24CXXX EEPROMS

This module supports the following I2C EEPROMs:

| **EEPROM**    | **Vendor**      | **Size (bits)** | **Page Count** | **Page Size (bytes)** | **Total Size (bytes)** | **Write Delay(ms)** | Devices/Bus |
| ------------- | --------------- | :-------------: | :------------: | :-------------------: | :--------------------: | :-----------------: | :---------: |
| **AT24C01**   | Atmel/Microchip |       1Kb       |       16       |           8           |          128           |          5          |      8      |
| **AT24C02**   | Atmel/Microchip |       2Kb       |       32       |           8           |          256           |          5          |      8      |
| **AT24C04**   | Atmel/Microchip |       4Kb       |       32       |          16           |          512           |          5          |      4      |
| **AT24C08**   | Atmel/Microchip |       8Kb       |       64       |          16           |          1024          |          5          |      2      |
| **AT24C16**   | Atmel/Microchip |      16Kb       |      128       |          16           |          2048          |          5          |      1      |
| **AT24C32**   | Atmel/Microchip |      32Kb       |      128       |          32           |          4096          |         10          |      8      |
| **AT24C32C**  | Atmel/Microchip |      32Kb       |      128       |          32           |          4096          |        **5**        |      8      |
| **AT24C64**   | Atmel/Microchip |      64Kb       |      256       |          32           |          8192          |         10          |      8      |
| **AT24C64C**  | Atmel/Microchip |      64Kb       |      256       |          32           |          8192          |        **5**        |      8      |
| **AT24C128**  | Atmel/Microchip |      128Kb      |      256       |          64           |         16384          |         10          |      4      |
| **AT24C128C** | Atmel/Microchip |      128Kb      |      256       |          64           |         16384          |        **5**        |    **8**    |
| **AT24C256**  | Atmel/Microchip |      256Kb      |      512       |          64           |         32768          |         10          |      4      |
| **AT24C256C** | Atmel/Microchip |      256Kb      |      512       |          64           |         32768          |        **5**        |    **8**    |
| **K24C256C**  | K-Line          |      256Kb      |      512       |          64           |         32768          |          5          |    **8**    |
| **AT24C512**  | Atmel/Microchip |      512Kb      |      512       |          128          |         65536          |         10          |      4      |
| **AT24C512C** | Atmel/Microchip |      512Kb      |      512       |          128          |         65536          |        **5**        |    **8**    |
| **AT24CM01**  | Atmel/Microchip |       1Mb       |      512       |          256          |         131072         |          5          |      4      |
| **AT24CM02**  | Atmel/Microchip |       2Mb       |      1024      |          256          |         262144         |          5          |      2      |

- **Note that the'C' revision of chips have a lower post-write delay requirement and may support more concurrent devices per bus.  **
- **For example, the AT24C32C chip has a 5ms post-write delay compared to 10ms for the AT24C32.**
- **For example, the AT24C128/256/512C chip supports a maximum of 8 devices per bus compared to 4 for the AT24C128/256/512.**

- ***The K24C256C chip is a Chinese Brand delivered on a board purchased from Amazon US stating that it contained AT24C256.  It is functionally identical to the AT24C256C***.



## ***Web Sites and Data Sheets***

Various web sites were and data sheets were referenced during the development of this module.  Links are provided below for convenience.

**.NET nanoFramework API Reference Device Details [Internet](https://docs.nanoframework.net/devicesdetails/At24cxx/README.html)**

**AT24C01A/AT24C02/AT24C04/AT24C08A/AT24C16A [datasheet from Microchip](https://ww1.microchip.com/downloads/en/DeviceDoc/doc0180.pdf)**
**AT24C01 [datasheet from Mouser Electronics USA](https://www.mouser.com/datasheet/2/268/doc0134-1180693.pdf?srsltid=AfmBOorxQWY3d1e2KLwmsjBLCvDHDHJlGRfA5JSZg9Pru1yjxaifmNZV)**
**AT24C01D/AT24C02D (Low Voltage - max 3.6V) [datasheet from Microchip](https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-8871F-SEEPROM-AT24C01D-02D-Datasheet.pdf)**
**AT24C08D (Low Voltage - max 3.6V)  [datasheet from Microchip](https://ww1.microchip.com/downloads/en/DeviceDoc/AT24C08D-I2C-Compatible-2-Wire-Serial-EEPROM-20006022A.pdf)**

**AT24C32/AT24C64 [datasheet from Microchip](https://ww1.microchip.com/downloads/en/DeviceDoc/doc0336.pdf)**
**AT24C32C/AT24C64C [datasheet from Microchip](https://ww1.microchip.com/downloads/en/DeviceDoc/doc5298.pdf)**

**AT24C128/AT24C256 [datasheet from Microchip](https://ww1.microchip.com/downloads/en/DeviceDoc/doc0670.pdf)**
**AT24C128C/AT24C256C [datasheet from Microchip](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/AT24C128C-AT24C256C-Data-Sheet-DS20006270B.pdf)**
**AT24C128C [datasheet from Microchip](https://ww1.microchip.com/downloads/aemDocuments/documents/MPD/ProductDocuments/DataSheets/AT24C128C-128-Kbit-Serial-EEPROM-I2C-Compatible-DS20006110.pdf)**
**AT24C256C [datasheet from Microchip](https://ww1.microchip.com/downloads/aemDocuments/documents/MPD/ProductDocuments/DataSheets/AT24C256C-I%C2%B2C-Compatible-%28Two-Wire%29-Serial-EEPROM-256-Kbit-%2832%2C768x8%29-Data-Sheet-DS20006042.pdf)**

**AT24C512C [datasheet from Microchip](https://ww1.microchip.com/downloads/aemDocuments/documents/MPD/ProductDocuments/DataSheets/AT24C512C-I2C-Compatible-%28Two-Wire%29-Serial-EEPROM-512%E2%80%91Kbit-%2865536x8%29.pdf)**
**AT24CM01  [datasheet from Microchip](https://ww1.microchip.com/downloads/en/DeviceDoc/AT24CM01-I2C-Compatible-Two-Wire-Serial-EEPROM-Data-Sheet-20006170A.pdf)**
**AT24CM02  [datasheet from Microchip](https://ww1.microchip.com/downloads/en/DeviceDoc/AT24CM02-I2C-Compatible-Two-Wire-Serial-EEPROM-2-Mbit-262,144x8-20006197C.pdf)**

**K24C256C [datasheet from K-Line](http://www.szhaina.com/uploads/media/20220416/1650103936.pdf)**



## Supported Node.js versions

**Supported (tested) Node.js versions: 10, 12, 14, 16, 18, 20**



## **Installation**

```sh
npm install i2c-eeproms
```

**TypeScript typings are included in this package.**

**You should be able to use this module on any Linux based OS that support i2c-bus.**



## **Example**

**This module requires an IC2Bus or Promisified bus instance to operate.  Construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in the constructor along with the I2C address of the expander chip.**

**The AT24C256C example below can be found in the [examples directory](https://github.com/lynniemagoo/node-i2c-eeproms/tree/master/examples) of this package together with a TypeScript example.**

```js
// Import the EEPROM class
//const ChipConstructor = require('i2c-eeproms').AT24C256C;
const ChipConstructor = require('../').AT24C256C;

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
```



## **Usage**

**Users may construct instances of chips by supplying 2 parameters;0  An 'i2cBus' and an 'i2address'.  If the value specified for `i2cAddress` is not allowed based on the chip type, an error will be thrown.  The error message provides detailed information as to the allowed I2C addresses for the chip type selected.  **


**Note that all of the chips in this module support a common I2C address of 0x50.**



## **Constructors**

### **new AT24C01(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C01 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C02(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C02 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C04(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C04 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C08(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C08 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C16(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C16 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C32(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C32 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C64(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C64 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C128(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C128 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C256(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```



**Constructor for a new AT24C256 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C512(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C512 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C512(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24CM01 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24CM01(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24CM01 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24CM02(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24CM02 instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C32C(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C32C instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C64C(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C64C instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C128C(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C128C instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new AT24C256C(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new AT24C256C instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



### **new K24C256C(i2cBus, address)**

```ts
constructor (i2cBus: I2CBus | PromisifiedBus, address: number);
```

**Constructor for a new K24C256C instance.**

* **`i2cBus` - Instance of an opened i2c-bus.**
* **`address` - The address of the EEPROM IC.**

**Note that you need to construct the [i2c-bus](https://npmjs.org/package/i2c-bus) object and pass it in to the module.**



## **API**

**The API uses Promises for all asynchronous read/write actions.**



### **get name()**

```ts
get name(): string
```

**String representing the name of the chip.**



### **get detail()**

```ts
get detail(): string
```

**String representing the detail of the chip in the format:**

```js
'Name[maxDevices]<storageSizeInBytes>'
```
**Where maxDevices is the number of concurrent chips of this type that are supported on a single I2C Bus.**



### **get maxDevices()**

```ts
get maxDevices(): number
```

**Number representing the maximum number of concurrent chips of this type that are supported on a single I2C Bus.**



### **get i2cAddressesAllowed()**

```ts
get i2cAddressesAllowed(): Array<number>
```

**Array of numbers containing the valid I2C addresses that are allowed for this chip.**



### **get storageSizeInBytes()**

```ts
get storageSizeInBytes(): number
```

**Number of bytes this chip is capable of supporting.**



### **get pageSizeInBytes()**

```ts
get pageSizeInBytes(): number
```

**Number of bytes for each memory page on the chip.  (Determines the maximum number of bytes that may be written in a single I2C operation).**



### **get pageCount()**

```ts
get pageCount(): number
```

**Number of memory pages on the chip.**



### **readDataBlock(memoryAddress, byteCount)**

```ts
readDataBlock(memoryAddress: number, byteCount: number) : Promise<Buffer>;
```

* **`memoryAddress` - The address to begin reading from.**
* **`byteCount` - The number of bytes to read.**

**Returns a Promise which will be resolved with a Buffer containing the data read from the chip.  
If the sum of memoryAddress and byteCount is greater than the storageSizeInBytes of the chip, a rejected promise will be returned.**



### **writeDataBlock(memoryAddress, data, stringEncoding)**

```ts
writeDataBlock(memoryAddress: number, data: EEPROMDataTypes, stringEncoding?: string) : Promise<number>
```

* **`memoryAddress` - The address to begin reading from.**
* **`data` - The data to write.  Allowed types defined by EEPROMDataTypes are are string, Uint8Array, Uint8ClampedArray, and Buffer.**
* **`stringEncoding` - Optional encoding to be used if the type of data is 'string'.  Default value is 'utf-8' if not specified.**

**Returns a Promise which will be resolved with the number of bytes written to the chip.  
If the sum of memoryAddress and the actual length in bytes of the encoded data block is greater than the storageSizeInBytes of the chip, a rejected promise will be returned.**



## **License**

**Licensed under GPL Version 2**

**Copyright (c) 2024 Lyndel McGee <lynniemagoo@yahoo.com>**  
