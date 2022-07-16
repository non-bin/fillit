import * as fs from 'fs';

const valuesFile = process.argv[2];
const keysFile = process.argv[3];
const version = process.argv[4] || 'VERSION';

let values: string[];
let keys: string[];
const results: { [key: string]: string } = {};

try { // read and decode values
	const valuesTXT = String(fs.readFileSync(valuesFile));
	values = valuesTXT.match(/("[^"]*")|(.+)/g); // decode the text into an array, taking into account quoted strings
} catch (err) { // print usage if any of that fails
	console.error('Could not read values file "' + valuesFile + '"');
	printUsage();
	process.exit(1);
}

try { // read and decode keys
	const keysTXT = String(fs.readFileSync(keysFile));
	keys = keysTXT.match(/("[^"]*")|(.+)/g);
} catch (err) {
	console.error('Could not read keys file "' + keysFile + '"');
	printUsage();
	process.exit(1);
}

keys.forEach(function (key, i) { // combine into an object, remove quotes, and add br tags
	results[key] = values[i].replace(/"/g, '').replace(/\n/g, '<br>');
});

const outputFile = './json/' + results.name + '_' + version + '.json';

fs.writeFile(outputFile, JSON.stringify(results), function (err) { // write to the output
	if (err) {
		console.error('Error writing output file "' + outputFile + '"');
		printUsage();
		throw err;
	}

	console.log('Wrote result to ' + outputFile);
});

function printUsage () {
	console.log('\nUsage:\nnode sheetToJSON.js VALUES KEYS VERSION');
}
