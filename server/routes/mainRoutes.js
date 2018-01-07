'use strict';

var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();
var exec = require('child_process').exec;
const moment = require('moment');
const queryString = require('query-string');


const hf_PDF = require('../../utils/create-pdf_helper_functions');

router.post('/json_mokka_create', (req, res) => {
    var jsonObject = req.body;
    var jsonString = JSON.stringify(jsonObject);
    fs.writeFileSync('mokka.json', jsonString, 'utf8', (err) => {
        if (err)
            throw err;
        }
    );
    console.log(`Wrote ${jsonString} to a file!`);

    res.redirect('/pdf_redirect');
});

router.post('/json_mokka', (req, res) => {
    var data = req.body;

    res.render('json_mokka', {
        title: "Mokka - PDF Creation",
        page: "pdf_creation",
        data
    });
});




router.post('/create-json', (req, res) => {
  var dataDetails = req.body.data;

  var abrechnungsBeginn = req.body.abrechnungsBeginn;
  var abrechnungsEnde = req.body.abrechnungsEnde;
  var billDate = moment(abrechnungsBeginn).format('YYYY-MM');

  // create json file for month with all artist data
  var jsonString = JSON.stringify(req.body);
  fs.writeFile(`abrechnung-${billDate}.json`, jsonString, 'utf8');
  const rootDir = path.join(__dirname, '../public', '..', '..');

  let allBills = Object.keys(dataDetails).length;
  let currentBill = 0;
  for (let x in dataDetails) {

  // electron is 'stupid' and cannot handle POST REQuests
  // so this way is necessary to have all data
  let artist = x;
    let initBillNumber = dataDetails[artist].artistDetails.init_bill_number;
    let registration = dataDetails[artist].artistDetails.registration;
    let billNumber = hf_PDF.calculateBillNumber(initBillNumber, registration, billDate);
    let artistID = dataDetails[artist].artistDetails.artistNummer;
    setTimeout(function() {
      var cmd = `/usr/local/bin/node ${rootDir}/server/nightmare-pdf-test.js '${artist}' '${billDate}' '${artistID}' '${billNumber}'`;
      // var cmd = `/usr/local/bin/node ${rootDir}/server/playground/test.js`;
      // console.log("artist:", artist);
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.log(`exec error: ${err}`);
          return;
        }
        currentBill += 1;
        if (currentBill === allBills) {
          hf_PDF.archivePDFS(billDate);
        }
        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
      });
     }, 3000);
  }
});

router.get('/pdf-create', (req,res) => {
  // console.log("in pdf-create",req.query);
  const {artist, date} = req.query;
  console.log(`artist: ${artist}, date: ${date}`);
  fs.readFile(`abrechnung-${date}.json`, (err, data) => {
      if (err) {
        throw err;
      }
      var parsedJSON = JSON.parse(data);
      var billNumberDate = parsedJSON.abrechnungsBeginn;
      var billingEnd = parsedJSON.abrechnungsEnde;
      parsedJSON = parsedJSON.data[artist];
      // console.log("new parsedJSON:", parsedJSON);
      var firstName = parsedJSON.artistDetails.vorname;
      var lastName = parsedJSON.artistDetails.nachname;
      var brutto = parsedJSON.artistDetails.brutto == '1' ? true : false;


      var from = moment(billNumberDate).format('DD.MM.YYYY');
      var to = moment(billingEnd).format('DD.MM.YYYY');
      var billNumberDateWithHiphens = moment(billNumberDate).format('YYYY-MM');
      var billNumberDateWithoutHiphens = moment(billNumberDate).format('YYYYMM');
      var initBillNumber = parsedJSON.artistDetails.init_bill_number;
      var registration = parsedJSON.artistDetails.registration;
      var billNumber = hf_PDF.calculateBillNumber(initBillNumber, registration, billNumberDate);
      if (billNumber < initBillNumber) {
        throw new Error('earlier than new Billing system');
      }
      res.render('pdf-create', {
        title: 'PDF Create',
        page: 'pdf-create',
        data: parsedJSON,
        billNumberDateWithoutHiphens: billNumberDateWithoutHiphens,
        billNumber: billNumber,
        brutto,
        from: from,
        to: to,
        firstName,
        lastName
        // data: data
      });
    });
});

router.get('/test', (req, res) => {

  hf_PDF.archivePDFS('2017-11');
});

module.exports = router;
