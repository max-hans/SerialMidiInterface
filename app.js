var easymidi = require('easymidi');
var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')

var port = new SerialPort('COM3', {
  baudRate: 9600
});




const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data',function(data){
    sendNote(parseInt(data.split(',')[0]),parseInt(data.split(','[1])));
})




var counter = 50;

var output = new easymidi.Output('BALLERN 1')

offAll();

var intervalLength = 50;

function offAll(){
    for(var i = 0; i < 127; i++){
        sendNote(i, false);
    }
}


/*
var playInterval = setInterval(function(){
    sendNote(counter,parseInt(Math.random()*57+70), true);

    setTimeout(function(){
        var noteVal = counter;
        sendNote(noteVal);
        counter++;
        if(counter > 100){
            counter = 50;
        }
    },intervalLength-10);

},intervalLength);

*/

function sendNote(noteVal, noteVel, debug){
    var sendObj =
        {
        note: noteVal,
        velocity: (noteVel)?(noteVel):(0),
        channel: 3
        };
    if(debug){
        log(sendObj);
    }
    output.send((noteVel)?('noteon'):('noteoff'),sendObj);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    rl.on("SIGINT", function () {
      process.emit("SIGINT");
    });
  }
  
  process.on("SIGINT", function () {
    console.log("tschau");
    //clearInterval(playInterval);
    offAll();
    output.close();
    process.exit();
  });


  function log(params){
      console.log(params);
  }