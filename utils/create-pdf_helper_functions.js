'use strict';

const fs = require('fs');

const archiver = require('archiver');
const moment = require('moment');


exports.calculateBillNumber = function(initBillNumber, registration, billingMonth) {
  var billMonthDate = moment(billingMonth).format('YYYY-MM');
  var registrationDate = moment(registration).format('YYYY-MM');
  var difference = moment(billMonthDate).diff(registration, 'months');
  var billNumber = parseInt(initBillNumber) + parseInt(difference);

  if (billNumber < initBillNumber) {
    console.log(billNumber);
    throw new Error('earlier than new Billing system');
  }

  return billNumber;
};

exports.archivePDFS = function(date) {
  var formattedDate = parseInt(moment(date).format('YYYYMM'));
  const dateWithHiphens = moment(date).format('YYYY-MM');
  var output = fs.createWriteStream(`./ABRECHNUNGEN_${dateWithHiphens}.zip`);
  var archive = archiver('zip', {
    gzip: true,
    zlib: { level: 9}
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  fs.readdir('.', function(err, items) {
    const billsToZip = items.filter(item => item.indexOf(formattedDate) > -1);
    billsToZip.forEach((bill) => {
      archive.file(bill, {name: bill});
    })
    archive.finalize();
});
}
