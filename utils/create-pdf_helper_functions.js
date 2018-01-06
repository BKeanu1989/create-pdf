'use strict';

const moment = require('moment');

exports.calculateBillNumber = function(initBillNumber, registration, billingMonth) {
  var billMonthDate = moment(billingMonth).format('YYYY-MM');
  var registrationDate = moment(registration).format('YYYY-MM');
  var difference = moment(billMonthDate).diff(registration, 'months');
  var billNumber = parseInt(initBillNumber) + parseInt(difference);

  if (billNumber < initBillNumber) {
    throw new Error('earlier than new Billing system');
  }

  return billNumber;
};
