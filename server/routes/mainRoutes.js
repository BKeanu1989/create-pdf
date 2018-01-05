'use strict';

var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();
var exec = require('child_process').exec;
const moment = require('moment');



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
  // var dataDetails = JSON.parse(req.body.data);
  var artistsData = req.body.data;

  var dataDetails = req.body.data;

  var abrechnungsBeginn = req.body.abrechnungsBeginn;
  var abrechnungsEnde = req.body.abrechnungsEnde;
  var billDate = moment(abrechnungsBeginn).format('YYYY-MM');
  var jsonString = JSON.stringify(req.body);
  fs.writeFile(`abrechnung-${billDate}.json`, jsonString, 'utf8');
  const rootDir = path.join(__dirname, '../public', '..', '..');
  for (let x in dataDetails) {
    let artist = x;
    if (artist === 'Sayonara') {

        // console.log(x);
          var cmd = `/usr/local/bin/node ${rootDir}/server/nightmare-pdf-test.js ${artist} ${billDate}`;
          // var cmd = `/usr/local/bin/node ${rootDir}/server/playground/test.js`;
          console.log("cmd:", cmd);
          exec(cmd, (err, stdout, stderr) => {
            if (err) {
              console.log(`exec error: ${err}`);
              return;
            }
            console.log('stdout: ', stdout);
            console.log('stderr: ', stderr);
            resolve('Success');

          });
        }
      };

    // let cmdCall = new Promise((resolve, reject) => {
    //   var cmd = `/usr/local/bin/node ${rootDir}/server/nightmare-pdf-test.js ${artist} ${billDate}`;
    //   // var cmd = `/usr/local/bin/node ${rootDir}/server/playground/test.js`;
    //   console.log("cmd:", cmd);
    //   exec(cmd, (err, stdout, stderr) => {
    //     if (err) {
    //       console.log(`exec error: ${err}`);
    //       return;
    //     }
    //     console.log('stdout: ', stdout);
    //     console.log('stderr: ', stderr);
    //     resolve('Success');
    //
    //   });
    // });
    // cmdCall.then((successMessage) => {
    //   console.log(successMessage);
    //   res.send('end of pdf_redirect');
    //
    // }).catch((err) => {
    //   console.log("err: ", err);
    // });


  // res.redirect('/pdf-create');
});

router.get('/pdf-create', (req,res) => {
  console.log("in pdf-create",req.query);
  // const {artist, date} = req.query;
  const artist = "Sayonara";
  const date = "2017-09";
  fs.readFile(`abrechnung-${date}.json`, (err, data) => {
      if (err) {
        throw err;
      }
      var parsedJSON = JSON.parse(data);
      var billNumberDate = parsedJSON.abrechnungsBeginn;
      var billingEnd = parsedJSON.abrechnungsEnde;
      parsedJSON = parsedJSON.data[artist];
      console.log("artist:", artist);
      console.log("new parsedJSON:", parsedJSON);
      var firstName = parsedJSON.artistDetails.vorname;
      var lastName = parsedJSON.artistDetails.nachname;
      var brutto = parsedJSON.artistDetails.brutto == '1' ? true : false;


      console.log("var brutto:", brutto);
      var from = moment(billNumberDate).format('DD.MM.YYYY');
      var to = moment(billingEnd).format('DD.MM.YYYY');
      var billNumberDateWithHiphens = moment(billNumberDate).format('YYYY-MM');
      var billNumberDateWithoutHiphens = moment(billNumberDate).format('YYYYMM');
      var initBillNumber = parsedJSON.initBillNumber;
      var registration = moment(parsedJSON.registration).format('YYYY-MM');
      var difference = moment(billNumberDateWithHiphens).diff(registration, 'months');
      console.log("billNumberDateWithHiphens:", billNumberDateWithHiphens);
      console.log("billNumberDateWithoutHiphens:", billNumberDateWithoutHiphens);
      console.log("registration: ", registration);
      console.log("difference:", difference);
      var billNumber = parseInt(initBillNumber) + parseInt(difference);
      if (billNumber < initBillNumber) {
        throw new Error('earlier than new Billing system');
      }
      console.log("billNumberDateWithoutHiphens:", billNumberDateWithoutHiphens);
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

router.get('/download', (req, res) => {
  var rootDir = path.join(__dirname, '../public', '..', '..');

  res.download(`${rootDir}/test.txt`);
});

module.exports = router;
