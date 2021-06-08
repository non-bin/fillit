var fs = require('fs');

const templateFile = process.argv[2];
const replacementsFile = process.argv[3];
const version = process.argv[4] || 'VERSION';

var replacements;

try {
	const replacementsJSON = fs.readFileSync(replacementsFile)
	replacements = JSON.parse(replacementsJSON);
} catch (err) {
	console.error('Could not read replacements file "' + replacementsFile + '"');
	printUsage();
	process.exit(1);
}


fs.readFile(templateFile, 'utf-8', function (err, content) { // read from the template file
	if (err) {
		console.error('Could not read template file "' + templateFile + '"');
		printUsage();
		process.exit(1);
	}

	newContent = content.replace(/~{(.+?)}/g, function (match, p1) { // generate new content
		if (typeof replacements[p1] === 'undefined') {
			console.log('No replacement for ' + match + ', skipping');
			return match;
		}

		return replacements[p1];
	});

	const outputFile = './html/' + replacements['name'] + '_' + version + '.html';

	fs.writeFile(outputFile, newContent, function (err) { // write to the output
		if (err) {
			console.error('Error writing output file "' + outputFile + '"')
			printUsage();
			throw err;
		}

		console.log('Wrote result to ' + outputFile);
	});
});

function printUsage() {
	console.log('\nUsage:\nnode fillTemplate.js TEMPLATE REPLACEMENTS VERSION');
}
