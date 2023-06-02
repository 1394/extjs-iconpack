const fs = require('fs');
const pug = require('pug');

const {makeIconList, generateIcons, generateIconStore} = require('./icons');

// paths
const svgIconsFilename = './sass/src/all.scss';
const faFilename = './sass/font-awesome/all.scss';

const iconPath = 'resources/images/icon';
const faIconPath = 'resources/font-awesome';

const iconStoreFileName = 'src/modal/Icons.js';

const svgFaIcons = makeIconList(faIconPath, faFilename, 'svg');
const svgIcons = makeIconList(iconPath, svgIconsFilename, 'svg');

const projectIcons = generateIcons(svgIcons, iconPath, '//IconList.start', '//IconList.end');
const faIcons = generateIcons(svgFaIcons, faIconPath, '//IconList.start', '//IconList.end');

const iconTypes = {
    project: 'icon',
    fa: 'fa',
};
generateIconStore(iconStoreFileName, 'InsertIcons', 'svg-icon', projectIcons.icons, iconTypes.project);
generateIconStore(iconStoreFileName, 'InsertFaIcons', 'svg-fa', faIcons.icons, iconTypes.fa);

// generate html file
const compiledFunction = pug.compileFile('doc/pug/index.pug');
fs.writeFileSync('doc/index.html', compiledFunction({listItems: projectIcons.iconList, faListItems: faIcons.iconList}), 'utf-8', function(err) {
    if (err) {
        return console.log(err);
    };
});

console.log('generated');
