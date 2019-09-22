// const path = require('/path');
// const dateTime = require('date-time');
// const chokidar = require('chokidar');
// const fs = require('fs-extra')
// const cpFile = require('cp-file');
// const ensureDir = require('ensure-dir')
const exec = require('child_process')
const os = require('os')
const max = require('max-api');
// const open = require('open');
const png2base64 = require('imgconversion');

let {PythonShell} = require('python-shell')
// const WebSocket = require('ws');
const Jimp = require('jimp');
 
const ws = require('ws')
const WebSocket = require('reconnecting-websocket');

const wsOptions = {
	WebSocket: ws, // custom WebSocket constructor
	connectionTimeout: 1000
	
};

let client;

if (process.argv[2] === 'localhost'){
	client = new WebSocket('ws://localhost:8082', [], wsOptions);

} else if (!process.argv[2]) {
	max.post('error, no ws server address provided')
	process.exit();
} else {
	client = new WebSocket('ws://' + process.argv[2] + ':8082', [], wsOptions);
}
// //TODO make this user-specifiable


 
client.addEventListener('open', () => {
	max.post('ws connected to ' + process.argv[2] + ':8082')

  client.send(JSON.stringify({
		date: Date.now(),
		data: os.hostname(),
		cmd: 'regCreatorMachine'
	}));
});
 
client.addEventListener('message', event => {
  console.log(`Message from server: ${event.data}`);
});

let artistObject = {};
let object = {}
let artistNN;
let portrait64;
let untitledportrait = 0;
let fileID;
let target;
// var lp = require("node-lp");
// var options = {};
 
// printer = lp(options);


const speechRecognition = __dirname + '/speech.py'
const {c, cpp, node, python, java} = require('compile-run');


// participant counter (for uniqueness)
let counter = 1
// unique ID
let id;


// interviewee name
let subject;
//let subject;
max.addHandler('newSubject', (name) =>{ 
	//subject = name
	artistNN = name;
	counter++
	id = counter + '_' 
	// newPath = __dirname + '/interviews/' + id + name
	// // a dir for each participant
	// ensureDir(__dirname + '/interviews/' + id + name).then(() => {
	// })
	// max.post('creating portraits within directory ' + __dirname + '/interviews/' + id + name)
	//max.outlet('path', newPath);

	
	
})

// capture portrait and audio file
max.addHandler('capture', (name) =>{
	//id = counter + '_'
	timestamp = Date.now()
	max.outlet('timestamp', timestamp)
	max.outlet('capture', name + '_' + timestamp)
})

// TODO:
// copy the chosen .wave into the main folder. run speech.py on it.  
// run speech2text on 
max.addHandler('chosen', (filename)=>{
	// filename = filename.toString()
	// max.post('name', filename)
	// f = filename.lastIndexOf('/');
	//max.post(f)
	// t = filename.substring(f + 1);
	// Jimp.read('./56_1567998144540.png')
	// 			.then(image => {
	// 				// image.greyscale();
	// 				// image.write('bw.jpg'); // save in greyscale
	// 				// Do stuff with the image.
	// 			})
	// 			.catch(err => {
	// 				// Handle an exception.
	// 			});

var str = filename;
var n = str.lastIndexOf('/');
var result = str.substring(n + 1);

target = result.split(".png")[0]

portrait64 = png2base64.imgtobase64('./' + target + '.png');


// max.post(artistObject)
speech2text(target)

//max.post('target', target)



//	cmd = ('lpr ./' + filename + '.png').toString()
	// let srcLoc = __dirname + '/interviews/' + subject
	// exec('python speech.py ./' + targetID + '.wave', (stdout,stderr,err)=>{
	// 	max.post(stderr,err,stdout)
	// })

	// python.runFile(speechRecognition,{
	// 	executionPath: '/usr/bin/env/python3',
	// 	stdin: targetID
	// 	},(err,result)=>max.post(err ? err : result));

	// const print = spawn('lp', ['lp', '-o', 'landscape', '-o', 'fit-to-page', '-o' ,'media=A4', filename]);

	// print.stdout.on('data', (data) => {
	// 	max.post(`stdout: ${data}`);
	// });
	
	// print.stderr.on('data', (data) => {
	// 	max.post(`stderr: ${data}`);
	// });
	
	// print.on('close', (code) => {
	// 	max.post(`child process exited with code ${code}`);
	// });

	// exec('open -a "Preview" ' + filename, ()=>{})
	
	//print.on('error	')

	//printer.queue('\"' + filename + '\"');

	/* this isn't working :(
	exec('python speech.py ' + targetID, {cwd: srcLoc}, (stdout,stderr,err )=>{
		max.post(stdout,stderr,err)
	})



	*/
})


function speech2text(fileID){
// max.post('fileID', fileID)
fileID = fileID;
	let options = {
		mode: 'text',
		pythonPath: '/Users/mp/miniconda3/bin/python',
		pythonOptions: ['-u'], // get print results in real-time
		scriptPath: __dirname,
		args: [fileID]
	};
	 
	PythonShell.run('speech.py', options, function (err, results) {
		if (err) {
			
			max.post( err, '\nusing stupid default portrait title');
			untitledportrait++
			let quote = 'untitled portrait #' + untitledportrait + ' by the great artist ' + artistNN

			artistObject[artistNN] = { portrait: portrait64, quote: quote, ID: fileID }
			// max.post(artistObject)
			
			let msg = JSON.stringify({
				date: Date.now(),
				data: artistObject,
				cmd: 'newStar'
			})
			client.send(msg)
			// reset the artistObject	

			

			artistObject = {}
			exec('killall python')
		} else {
		// results is an array consisting of messages collected during execution
		// max.post(results[3]);

		let quote = results[3].replace('gnarly speech-to-text: ', '')
		if (quote === 'Sphinx could not understand audio'){
			untitledportrait++
			quote = 'untitled portrait #' + untitledportrait + ' by the up-and-coming artist ' + artistNN
		} else {
			// ignore
		}
		artistObject = { portrait: portrait64, quote: quote, fileID: fileID, artistNN: artistNN }
		// max.post(artistObject)

		let msg = JSON.stringify({
			date: Date.now(),
			data: artistObject,
			cmd: 'newStar'
		})
		client.send(msg)
		// reset the artistObject
		artistObject = {}
		}

	});


}


// make sure an interviews folder exists. eventually use this to create




