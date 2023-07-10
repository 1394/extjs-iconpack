const fs = require('fs');
const pug = require('pug');

const {makeIconList, generateIcons, generateIconStore} = require('./icons');
const ICON_TYPES = require('./constants');

// paths
const svgIconsFilename = './sass/src/all.scss';
const faFilename = './sass/font-awesome/all.scss';

const iconPath = 'resources/images/icon';
const faIconPath = 'resources/font-awesome';

const iconStoreFileName = 'src/modal/Icons.js';

const svgFaIcons = makeIconList(faIconPath, faFilename, 'svg', ICON_TYPES.fa);
const svgIcons = makeIconList(iconPath, svgIconsFilename, 'svg', ICON_TYPES.project);

const projectIcons = generateIcons(svgIcons, iconPath, '//IconList.start', '//IconList.end');
const faIcons = generateIcons(svgFaIcons, faIconPath, '//IconList.start', '//IconList.end');

generateIconStore(iconStoreFileName, 'InsertIcons', 'svg-icon', projectIcons.icons, ICON_TYPES.project);
generateIconStore(iconStoreFileName, 'InsertFaIcons', 'svg-fa', faIcons.icons, ICON_TYPES.fa);

// generate html file
// update icons source -> `../${source}`

const listItems = projectIcons.iconList.map((icon) => {
    return {
        ...icon,
        source: ('../').concat(icon.source)        
    }
})
const faListItems = faIcons.iconList.map((icon) => {
    return {
        ...icon,
        source: ('../').concat(icon.source)
    }
})

const compiledFunction = pug.compileFile('doc/pug/index.pug');
fs.writeFileSync('doc/index.html', compiledFunction({listItems, faListItems}), 'utf-8', function(err) {
    if (err) {
        return console.log(err);
    };
});

console.log('generated');
