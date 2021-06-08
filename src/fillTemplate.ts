import * as fs from 'fs';

const templateFile = process.argv[2];
const replacementsFile = process.argv[3];
const version = process.argv[4] || 'VERSION';

let replacements: { [placeholderName: string]: string; };

try {
	const replacementsJSON = String(fs.readFileSync(replacementsFile));
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

	const newContent = content.replace(/~{(.+?)}/g, function (match, placeholderName) { // generate new content
		if (typeof replacements[placeholderName] === 'undefined') {
			console.log('No replacement for ' + match + ', skipping');
			return match;
		}

		return replacements[placeholderName];
	});

	const outputFile = './html/' + replacements.name + '_' + version + '.html';

	fs.writeFile(outputFile, newContent, function (err) { // write to the output
		if (err) {
			console.error('Error writing output file "' + outputFile + '"');
			printUsage();
			throw err;
		}

		console.log('Wrote result to ' + outputFile);
	});
});

function printUsage () {
	console.log('\nUsage:\nnode fillTemplate.js TEMPLATE REPLACEMENTS VERSION');
}
