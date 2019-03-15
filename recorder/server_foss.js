/**
 * NPM Module dependencies.
 */

var express = require('express');
const trackRoute = express.Router();
var app = express();
var path = require('path');

//var ip = "http://192.168.1.115:8687";

var port    =   process.env.PORT || 8687;
var domain = "https://www.trainyourdnn.com";
if (port == 443) {
  domain = "https://" + process.env.DOMAIN;
} else {
  domain = "http://" + process.env.DOMAIN + ":" + port;
}
console.log("Server listening at " + domain);

// TODO introduce config files

//mongodb://192.168.1.115:27017/trackDB
var db_name = process.env.MONGO_DBNAME || "trackDB";
var mongo_url = "mongodb://" + process.env.MONGO_HOST + ":27017/" + db_name;

//js file paths
app.use(express.static(__dirname + '/public'));

// viewed at http://localhost:8687/record
app.get('/record', function(req, res) {
  console.log(__dirname);
    res.sendFile(path.join(__dirname, 'public','/index.html'));
    console.log(req.query.datasetuid);
});

app.listen(port, () => {
  console.log("Express App listening on port" + " "+ port + "!");
});
