const SerialPort = require('serialport').SerialPort;

function listSerialPorts() {
  SerialPort.list().then(ports => {
    console.log('Available serial ports:');
    ports.forEach(port => {
      console.log('   Port:', port.path);
      console.log('   Manufacturer:', port.manufacturer);
      console.log('   Serial Number:', port.serialNumber);
      console.log('   Vendor ID:', port.vendorId);
      console.log('   Product ID:', port.productId);
      console.log('   ----------------------------------');
    });
  }).catch(error => {
    console.error('Error listing serial ports:', error);
  });
}

listSerialPorts();
