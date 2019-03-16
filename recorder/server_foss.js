/**
 * NPM Module dependencies.
 */

var express = require('express');
const trackRoute = express.Router();
var app = express();
var path = require('path');

var port    =   process.env.PORT || 8687;

//js file paths
app.use(express.static(__dirname + '/public'));

const admin = require('firebase-admin');
const serviceAccount = require('./account_key.json');

//Firebase stuff
// admin.initializeApp(functions.config().firebase);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

var db = admin.firestore();

// viewed at http://localhost:8687/record
app.get('/record', function(req, res) {
  console.log(__dirname);
    res.sendFile(path.join(__dirname, 'public','/index_foss.html'));
    console.log(req.query.datasetuid);
});

app.listen(port, () => {
  console.log("Express App listening on port" + " "+ port + "!");
});
