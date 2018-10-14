var easymidi = require('easymidi');
var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
const electron = require('electron');
//var app = require('app');
var port;

const { app, BrowserWindow } = require('electron')
let win
function createWindow () {
    win = new BrowserWindow({ width: 800, height: 600 })
    win.loadFile('index.html')
    win.webContents.openDevTools()
    win.on('closed', () => {
      win = null
    })
  }
  
app.on('ready', createWindow)



SerialPort.list(function (err, results) {
    if (err) {
        throw err;
    }

    results.forEach(element => {
        if ("vendorId" in element && element.vendorId != undefined && port == undefined) {
            port = new SerialPort(element.comName, {
                baudRate: 9600
            })
            run();
        }
    });
    if(port == undefined){
        log("no device found");
        process.exit();
    }
    else{
        log("voll fancy");
    }
});


function run() {
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
    parser.on('data', function (data) {
        sendNote(parseInt(data.split(',')[0]), parseInt(data.split(','[1])));
    })

    var output = new easymidi.Output('BALLERN 1')

    offAll();

    var intervalLength = 50;

    function offAll() {
        for (var i = 0; i < 127; i++) {
            sendNote(i, false);
        }
    }


    function sendNote(noteVal, noteVel, debug) {
        var sendObj =
        {
            note: noteVal,
            velocity: (noteVel) ? (noteVel) : (0),
            channel: 3
        };
        if (debug) {
            log(sendObj);
        }
        output.send((noteVel) ? ('noteon') : ('noteoff'), sendObj);
    }

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
        log("tschau");
        offAll();
        output.close();
        process.exit();
    });


    

}

function log(params) {
    console.log(params);
}