/*
A simple test runner. Just create files in this directory which start with "test_"
and have the following format:

	foo() {} // code to be parsed
	//---------------------------
	foo() {} // expected output

The runner will warn if the tranformed output is not as expected and show a diff.
Note that this is done as text so we can print a diff. If it fails, we can maybe
look at comparing ASTs instead and still print text diff.
*/

const babel = require('@babel/core');
const fs = require('fs');
const redRunnerBabelPlugin = require('../lib/index');
const EOL = require('os').EOL;
const printDiff = require('print-diff');

const c = console;
const ColourReset = "\x1b[0m";
const FgGreen = "\x1b[32m";
const FgRed = "\x1b[31m";

const transformOptions = {plugins: [
	["@babel/plugin-proposal-class-properties"],
	[redRunnerBabelPlugin]
]};


/* Prints in colour */
function print(colour, text) {
	c.log(colour, text)
	c.log(ColourReset)
}

/* Splits a file in two parts on the line starting with "//---"
 * Returns two strings.
 */
function splitFile(filePath) {
	let sourceLines = [], expectedOutputlines = [];
	let contents = fs.readFileSync(filePath, 'utf8');
	let addTo = sourceLines;
	contents.split(EOL).forEach(line => {
		if (line.startsWith('//---')) {
			addTo = expectedOutputlines;
		} else if (line.trim() !== '') {
			addTo.push(line)
		}
	});
	return [sourceLines.join(EOL), expectedOutputlines.join(EOL)]
}

/* Tests that the expected output matches.
 * Prints diff to terminal
 */
function testFile(filePath) {
	let [input, expectedOutput] = splitFile(filePath);
	let output = babel.transform(input, transformOptions).code;
	if (output === expectedOutput) {
		print(FgGreen, 'PASS: ' + filePath)
	} else {
		ExitCode = 1;
		print(FgRed, 'FAIL: ' + filePath)
		printDiff(output, expectedOutput)
	}
}

/* Main run test and notify of results */
function testAllFilesInDir() {
	fs.readdirSync(__dirname).forEach(file => {
		if (file.startsWith('test_')) {
			testFile(__dirname + '/' + file);
		}
	});
	
}

let ExitCode = 0;
testAllFilesInDir();
process.exit(ExitCode);