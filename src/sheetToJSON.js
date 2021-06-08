var fs = require('fs');

const valuesFile = process.argv[2];
const keysFile = process.argv[3];
const version = process.argv[4] || 'VERSION';

var values;
var keys;
var results = {};

try { // read and decode values
	let valuesTXT = String(fs.readFileSync(valuesFile));
	values = valuesTXT.match(/("[^"]*")|(.+)/g) // decode the text into an array, taking into account quoted strings
} catch (err) { // print usage if any of that fails
	console.error('Could not read values file "' + valuesFile + '"');
	throw err
	printUsage();
	process.exit(1);
}

try { // read and decode keys
	const keysTXT = String(fs.readFileSync(keysFile));
	keys = keysTXT.match(/("[^"]*")|(.+)/g)
} catch (err) {
	console.error('Could not read keys file "' + keysFile + '"');
	throw err
	printUsage();
	process.exit(1);
}

keys.forEach((key, i) => results[key] = values[i].replace(/"/g, '').replace(/\n/g, '<br>')); // combine into an object, remove quotes, and add br tags

results['designsByTop'] = results['designsByTop'].replace('Mad pepper', ''); // Mad Pepper is already in the template inside a link tag
results['preview1'] = results['preview1'].replace(results['findOutMore'], ''); // remove 'find out more' from previews
results['preview2'] = results['preview2'].replace(results['findOutMore'], '');
results['preview3'] = results['preview3'].replace(results['findOutMore'], '');
results['lang'] = results['name'].substr(0,2);

const outputFile = './json/'+results['name']+'_'+version+'.json';

fs.writeFile(outputFile, JSON.stringify(results), function (err) { // write to the output
	if (err) {
		console.error('Error writing output file "' + outputFile + '"')
		throw err
		printUsage();
		throw err;
	}

	console.log('Wrote result to ' + outputFile);
});

function printUsage() {
	console.log('\nUsage:\nnode sheetToJSON.js VALUES KEYS VERSION');
}
