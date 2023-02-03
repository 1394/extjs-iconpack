const fs = require('fs');
const path = require('path');
const pug = require('pug');

// paths
const filename = './sass/src/all.scss';
const iconPath = '../resources/images/icon';
const iconStoreFileName = 'src/modal/Icons.js';
const fontAwesomeDir = './resources/font-awesome/';
const faStylesFileName = './sass/font-awesome/all.scss';

// generate fa file with styles
const generateFontAwesomeIcons = () => {
    const files = [];

    // read all icon files to get names
    fs.readdirSync(fontAwesomeDir).forEach((filename) => {
        const name = path.parse(filename).name;
        const filepath = path.resolve(fontAwesomeDir, filename);
        const stat = fs.statSync(filepath);
        const isFile = stat.isFile();

        if (isFile) {
            files.push(name);
        }
    });

    const styles = fs.readFileSync(faStylesFileName, {encoding: 'utf8'})
        .replace(/[\t\r]+/g, '')
        .split('\n');

    const startIdx = styles.findIndex((line) => line.includes('IconList.start'));
    const endIdx = styles.findIndex((line) => line.includes('IconList.end'));

    const objFiles = [...files].map((file) => {
        return `    ${file}: "${file}",`;
    });

    const result = {
        start: [],
        end: [],
    };

    result.end = styles.splice(endIdx, styles.length);
    result.start = styles.splice(0, startIdx + 1);
    result.content = objFiles;

    fs.writeFileSync(faStylesFileName, result.start.concat(result.content, result.end).join('\n'), 'utf-8', function(err) {
        if (err) {
            return console.log(err);
        }
    });
};
generateFontAwesomeIcons();

// read file and split by line
const styles = fs.readFileSync(filename, {encoding: 'utf8'})
    .replace(/[\t\r]+/g, '')
    .split('\n');

// get all icons to icons array
const iconListStartIdx = styles.findIndex((line) => line === '$icon-list: (');
let tempIdxToReadStyles = iconListStartIdx + 1;

const icons = [];
let iconsIdx = 0;

while (styles[tempIdxToReadStyles] !== ');') {
    icons[iconsIdx] = styles[tempIdxToReadStyles];

    iconsIdx += 1;
    tempIdxToReadStyles += 1;
}

// generate iconList to render pug layout
const iconsList = icons.map((icon) => {
    const name = icon.split(':')[0].trim();
    const svgFilename = icon.split(':')[1].replace(/['", ]+/g, '');
    return {
        source: `${iconPath}/${svgFilename}.svg`,
        name,
        alt: name,
    };
});

// read file and split by line
const faStyles = fs.readFileSync(faStylesFileName, {encoding: 'utf8'})
    .replace(/[\t\r]+/g, '')
    .split('\n');

// get all icons to icons array
const faIconListStartIdx = faStyles.findIndex((line) => line.trim() === '//IconList.start');
let faTempIdxToReadStyles = faIconListStartIdx + 1;

const faIcons = [];
let faIconsIdx = 0;

while (faStyles[faTempIdxToReadStyles].trim() !== '//IconList.end') {
    faIcons[faIconsIdx] = faStyles[faTempIdxToReadStyles];

    faIconsIdx += 1;
    faTempIdxToReadStyles += 1;
}

// generate iconList to render pug layout
const faIconsList = faIcons.map((icon) => {
    const name = icon.split(':')[0].trim();
    const svgFilename = icon.split(':')[1].replace(/['", ]+/g, '');
    return {
        source: `../resources/font-awesome/${svgFilename}.svg`,
        name,
        alt: name,
    };
});

const generateIconStore = () => {
    const file = fs.readFileSync(iconStoreFileName, {encoding: 'utf8'})
        .replace(/[\t\r]+/g, '')
        .split('\n');

    const startIdx = file.findIndex((line) => line.includes('InsertIcons.start'));
    const endIdx = file.findIndex((line) => line.includes('InsertIcons.end'));

    // array of stringify objects
    const storeElements = icons.map((icon) => {
        const description = icon.split(':')[0].trim();
        const value = `svg-icon svg-icon-${description}`;
        return `{value: \'${value}\', description: \'${description}\'},`;
    });

    const result = {
        start: [],
        end: [],
    };

    result.end = file.splice(endIdx, file.length);
    result.start = file.splice(0, startIdx + 1);
    result.content = storeElements;

    fs.writeFileSync(iconStoreFileName, result.start.concat(result.content, result.end).join('\n'), 'utf-8', function(err) {
        if (err) {
            return console.log(err);
        }
    });
};
generateIconStore();

// generate html file
const compiledFunction = pug.compileFile('doc/pug/index.pug');
fs.writeFileSync('doc/index.html', compiledFunction({listItems: iconsList, faListItems: faIconsList}), 'utf-8', function(err) {
    if (err) {
        return console.log(err);
    };
});

console.log('generated');
