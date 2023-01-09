const fs = require('fs');
const pug = require('pug');

// path to styles file
const filename = './sass/src/all.scss';
const iconPath = '../resources/images/icon';

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

// generate html file
const compiledFunction = pug.compileFile('doc/pug/index.pug');
fs.writeFileSync('doc/index.html', compiledFunction({listItems: iconsList}), 'utf-8', function(err) {
    if (err) {
        return console.log(err);
    };
});

console.log('doc generated');
