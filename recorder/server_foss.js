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

// viewed at http://localhost:8687/record
app.get('/record', function(req, res) {
  console.log(__dirname);
    res.sendFile(path.join(__dirname, 'public','/index_foss.html'));
    console.log(req.query.datasetuid);
});

app.listen(port, () => {
  console.log("Express App listening on port" + " "+ port + "!");
});
