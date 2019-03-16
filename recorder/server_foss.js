/**
 * NPM Module dependencies.
 */

var express = require('express');
const trackRoute = express.Router();
var app = express();
var path = require('path');
const fs = require('fs');
var multer = require('multer');
var PythonShell = require('python-shell');


var port    =   process.env.PORT || 8687;

// fs.mkdirSync('uploads', true);
var upload = multer({dest:'uploads/'});

//js file paths
app.use(express.static(__dirname + '/public'));

// const admin = require('firebase-admin');
// const serviceAccount = require('./account_key.json');

//Firebase stuff
// admin.initializeApp(functions.config().firebase);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// })
//
// var db = admin.firestore();

function getPyShell(){

  var options = {
  mode:'text',
  scriptPath:'/root/sharedfolder/foss-hack/recorder/public/python', //Change for differnt machines
  pythonPath:'/root/anaconda3/bin/python'
  }

  var pyshell = new PythonShell('say_hello.py', options);
  return pyshell

}

function sendMessage(message_to_python, return_message){
  shell = getPyShell();
  shell.send(message_to_python);

  shell.on('message', function (message) {
// received a message sent from the Python script (a simple "print" statement)
      return_message.push(message);
      console.log(return_message);
  });

  return shell
}

function executePython(){
  // var audio_message = `setAudio(s, "${req.query.datasetuid}","${req.query.uid}","${id}","${audio_storage_url}")`

  var return_message = [];
  var audio_message = `say_hello()`;

  console.log(audio_message);

  shell = sendMessage(audio_message, return_message);

  shell.end(function (err,code,signal) {
      if (err) throw err;
      console.log('The exit code was: ' + code);
      console.log('The exit signal was: ' + signal);
      console.log('finished');
      console.log('finished');
  });
}

// viewed at http://localhost:8687/record
app.get('/record', function(req, res) {
  console.log(__dirname);
    res.sendFile(path.join(__dirname, 'public','/index_foss.html'));
    console.log(req.query.datasetuid);
});

app.post('/save', upload.single('audio_file'), function(req,res,next){
  console.log(req.file);
  executePython();
  res.send("Got the file");
});

app.use(function(err,req,res,next){
  console.log('err.field', err.field);
  next(err);
})

app.listen(port, () => {
  console.log("Express App listening on port" + " "+ port + "!");
});

/**
 * POST /tracks
 */
 // app.post('/save', (req, res) => {
 //
 //  var return_message = [];
 //  const storage = multer.memoryStorage()
 //  const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
 //  upload.single('track')(req, res, (err) => {
 //    if (err) {
 //      return res.status(400).json({ message: "Upload Request Validation Failed" });
 //    } else if(!req.body.name) {
 //      return res.status(400).json({ message: "No track name in request body" });
 //    }
 //
 //    let trackName = req.body.name;
 //
 //    // Covert buffer to Readable Stream
 //    const readableTrackStream = new Readable();
 //    readableTrackStream.push(req.file.buffer);
 //    readableTrackStream.push(null);
 //
 //    let bucket = new mongodb.GridFSBucket(db, {
 //      bucketName: 'tracks'
 //    });
 //
 //    let uploadStream = bucket.openUploadStream(trackName);
 //    let id = uploadStream.id;
 //    readableTrackStream.pipe(uploadStream);
 //
 //    uploadStream.on('error', () => {
 //      return res.status(500).json({ message: "Error uploading file" });
 //    });
 //
 //    uploadStream.on('finish', () => {
 //      console.log(req.query.uid);
 //      console.log(req.query);
 //
 //      var card_uid_from_webpage = req.query.uid;
 //
 //      if ((card_uid_from_webpage == "none") || (card_uid_from_webpage == "")) {
 //        // not a actual card (ie sample), just return the track uid
 //        return res.status(201).json({ id })
 //      }
 //
 //      var audio_storage_url = domain+"/play"+"/"+id;
 //
 //      if((req.query.datasetuid !== '') && (req.query.uid !== '' ) && (req.query.datasetuid !== undefined) && (req.query.uid !== undefined)){
 //
 //        var audio_message = `setAudio(s, "${req.query.datasetuid}","${req.query.uid}","${id}","${audio_storage_url}")`
 //
 //        console.log(audio_message);
 //
 //        shell = sendMessage(audio_message, return_message);
 //
 //        shell.end(function (err,code,signal) {
 //          if (err) throw err;
 //          console.log('The exit code was: ' + code);
 //          console.log('The exit signal was: ' + signal);
 //          console.log('finished');
 //          console.log('finished');
 //      });
 //        return res.status(201).json({ id });
 //     }else{
 //        return res.status(201).json({ id });
 //    }});
 //  });
// });
