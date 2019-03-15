//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

//Check for page reload
console.log(performance.navigation);

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var backButton = document.getElementById("backButton");
var card_audio = document.getElementById('card_audio');
var cuecardtext = document.getElementById("card_text");
var loader_img = document.getElementById("loader");

loader_img.style.display = "none";
var cuecardtext_array = ['Something1', 'Something2', 'Something3'];

var length_of_array = cuecardtext_array.length;

function updateCard(){
    current_index = 0
    //Update the text for the next cue card
    if ( current_index < length_of_array -1){
        cuecardtext.innerHTML = cuecardtext_array[current_index];
        current_index = current_index + 1;
        // update the background image
        // document.body.style.backgroundImage = "url('images/img" + (ui.ui_current_index+1) + ".png')";
    } else {
        // all finished
        // document.body.style.backgroundImage = "url('images/img_final.png')";
        recordButton.disabled = true;
        stopButton.disabled = true;
        backButton.disabled = true;
        console.log("all done");
    }
}

recordButton.addEventListener("click", updateCard);
