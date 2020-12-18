const SPIDevice = require('spi-device');

const Config = {
  mode: 0,
  chipSelectHigh: false,
  lsbFirst: false,
  threeWire: false,
  loopback: false,
  noChipSelect: false,
  ready: false,
  bitsPerWord: 8,
  maxSpeedHz: 1000000
};

console.log('OPTIONS', Config);

let spiDevice = SPIDevice.open(0, 0, Config, error => {
  console.log('AFTER OPEN', spiDevice.getOptionsSync())
  spiDevice.setOptionsSync(Config)
  if (error) console.log(error);
  console.log('AFTER SET', spiDevice.getOptionsSync())
});
