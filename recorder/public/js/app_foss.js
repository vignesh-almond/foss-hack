//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
// var backButton = document.getElementById("backButton");
// var card_audio = document.getElementById('card_audio');
var cuecardtext = document.getElementById("card_text");
var loader_img = document.getElementById("loader");
var progressbar = document.getElementById("progressbar");

loader_img.style.display = "none";

// document.body.style.backgroundImage = "url('images/Kachin/Manau Logo - Copy.jpg')";

//Sample Array
var cuecardtext_array = ['Something1', 'Something2', 'Something3'];
var length_of_array = cuecardtext_array.length;
var current_index = 0


//Adding event listeners to the buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

function updateCard(){
    //Update the text for the next cue card
    if ( current_index < length_of_array -1){
        cuecardtext.innerHTML = cuecardtext_array[current_index];
        current_index = current_index + 1;
        console.log(current_index);
        // update the background image
        // document.body.style.backgroundImage = "url('images/img" + (current_index) + ".png')";
    } else {
        // all finished
        // document.body.style.backgroundImage = "url('images/img_final.png')";
        recordButton.disabled = true;
        stopButton.disabled = true;
        backButton.disabled = true;
        console.log("all done");
    }
}

function startRecording() {
	console.log("recordButton clicked");

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

    var constraints = { audio: true, video:false }

 	/*
    	Disable the record button until we get a success or fail from getUserMedia()
	*/

  	recordButton.disabled = true;
  	stopButton.disabled = false;
  	// pauseButton.disabled = false

  	/*
      	We're using the standard promise based getUserMedia()
      	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  	*/

  	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
  		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

  		/*
  			create an audio context after getUserMedia is called
  			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
  			the sampleRate defaults to the one set in your OS for your playback device
  		*/
  		audioContext = new AudioContext();

  		//update the format
  		document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

  		/*  assign to gumStream for later use  */
  		gumStream = stream;

  		/* use the stream */
  		input = audioContext.createMediaStreamSource(stream);

  		/*
  			Create the Recorder object and configure to record mono sound (1 channel)
  			Recording 2 channels  will double the file size
  		*/
  		rec = new Recorder(input,{numChannels:1})

  		//start the recording process
  		rec.record()

  		console.log("Recording started");

  	}).catch(function(err) {
  	  	//enable the record button if getUserMedia() fails
      	recordButton.disabled = false;
      	stopButton.disabled = true;
      	pauseButton.disabled = true
  	});
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	// pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	// pauseButton.innerHTML="Pause";

	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(uploadToserver);

  // uploadToserver();

  updateCard();

}

function createDownloadLink(blob) {

	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	link.href = url;
	link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
	link.innerHTML = "Save to disk";

	//add the new audio element to li
	li.appendChild(au);

	//add the filename to the li
	li.appendChild(document.createTextNode(filename+".wav "))

	//add the save to disk link to li
	li.appendChild(link);

	//upload link
	var upload = document.createElement('a');
	upload.href="#";
	upload.innerHTML = "Upload";
	upload.addEventListener("click", function(event){
		  var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };
		  var fd=new FormData();
		  fd.append("audio_data",blob, filename);
		  xhr.open("POST","upload.php",true);
		  xhr.send(fd);
	})
	li.appendChild(document.createTextNode (" "))//add a space in between
	li.appendChild(upload)//add the upload link to li

	//add the li element to the ol
	recordingsList.appendChild(li);
}

/*
 * Send the recorder audio file to server
 * arg: recorded audio blob
 */
  function uploadToserver(blob) {
  //name of .wav file to use during upload and download (without extension)
  // var filename = new Date().toISOString();

  // var blob = new Blob(["Hello"]);
  // console.log('blob:', blob);

  //POST to server
  var xhr=new XMLHttpRequest();
  // xhr.timeout = 20000 ; //Setting the timeout

  xhr.onload=function(e) {
      if(this.readyState === 4) {
        // getStoredDataFromServer();
        console.log("Server returned: ",e.target.responseText);
        // var data_from_server = JSON.parse(e.target.response);
        // var audio_playback_link = "../play/" + data_from_server["id"];
        // client.audio_uids[ui.ui_current_index] = audio_playback_link;
        // client.client_current_index = client.getIndex(ui.cuecardtext.innerHTML); //Move client index after sending audio successfully to server
        // console.log(client.audio_uids);
        // ui.backButton.disabled = false;
        // ui.toggleRecBusy(false);
        // ui.updateCard();
        // ui.updateProgressbar();
      }else{
        // ui.toggleRecBusy(true);
        console.log("Nothing returned");
      }
  };

  //Handling xhr error
  // xhr.onerror = function(e){
  //   alert("Server is busy try recording again");
  // }
  //
  // //Handling timeout
  // xhr.ontimeout=function(e){
  //   alert("Server is busy try recording again");
  // }

  var fd=new FormData();
  var filename = "audio_file";
  fd.append("audio_file", blob, filename+'.wav');
  console.log("fd:", fd);
  // var current_uid = client.getUID(ui.ui_current_index);
  // var post_url = "/save"+"?"+"uid="+current_uid+"&"+"datasetuid="+client.getQueryString() ;

  var post_url = "/save";
  xhr.open("POST",post_url,true);
  xhr.send(fd);

}
