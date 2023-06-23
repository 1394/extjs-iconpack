const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

const ICON_TYPES = require('./constants');

const aliases = {
    [ICON_TYPES.project]: {
        // 'cancel': ['close'],
        'excel': ['exel'],
        'arrow-down': ['expand-bottom'],
        'star-16': ['star_16px'],
    },
    [ICON_TYPES.fa]: {
    },
};

const addAlias = (files, iconName, iconType) => {
    //  comprationObj -> {iconName: ['aliasName']}
    // aliases {comprationObj[]}
    const rootIconName = aliases[iconType]?.[iconName];

    if (rootIconName) {
        console.log(rootIconName)
        const iconNames = aliases[iconType][iconName];

        for (const iName of iconNames) {
            files.push({key: iName, value: iconName});
        }
    }
};

const makeIconList = (iconPath, styleFilename, ext, iconType) => {
    const files = [];

    // read all icon files to get names
    fs.readdirSync(path.join(cwd, iconPath))
        .forEach((filename) => {
            const filepath = path.resolve(iconPath, filename);
            const stat = fs.statSync(filepath);

            if (!stat.isFile()) {
                return;
            }

            const {name} = path.parse(filename);
            if (filename.endsWith(ext)) {
                files.push({key: name, value: name});
                addAlias(files, name, iconType);
            };
        });

    const styles = fs.readFileSync(styleFilename, {encoding: 'utf8'})
        .replace(/[\t\r]+/g, '')
        .split('\n');

    const startIdx = styles.findIndex((line) => line.includes('IconList.start'));
    const endIdx = styles.findIndex((line) => line.includes('IconList.end'));

    const result = {
        start: [],
        end: [],
    };

    result.end = styles.splice(endIdx, styles.length);
    result.start = styles.splice(0, startIdx + 1);
    // result.content = files.map((file) => `    "${file}",`);
    result.content = files.map((file) => `    "${file.key}": "${file.value}",`);

    const icons = result.start.concat(result.content, result.end).join('\n');

    fs.writeFileSync(
        styleFilename,
        icons,
        'utf-8',
        function(err) {
            if (err) {
                return console.log(err);
            }
        });
    return files;
};

const generateIcons = (icons, iconPath) => {
    // // read file and split by line
    // const styles = fs.readFileSync(filename, {encoding: 'utf8'})
    //     .replace(/[\t\r]+/g, '')
    //     .split('\n');

    // // get all icons to icons array
    // const iconListStartIdx = styles.findIndex((line) => line.trim() === markerStart);
    // let tempIdxToReadStyles = iconListStartIdx + 1;

    // const icons = [];
    // let iconsIdx = 0;

    // while (styles[tempIdxToReadStyles].trim() !== markerEnd) {
    //     icons[iconsIdx] = styles[tempIdxToReadStyles];

    //     iconsIdx += 1;
    //     tempIdxToReadStyles += 1;
    // }

    // generate iconList to render pug layout
    const iconList = icons.map((icon) => {
        // const name = icon.split(':')[0].trim();
        const name = icon.value;
        const svgFilename = name;// icon.split(':')[1].replace(/['", ]+/g, '');
        return {
            source: `${iconPath}/${svgFilename}.svg`,
            name,
            alt: name,
        };
    });

    return {
        icons,
        iconList,
    };
};

const generateIconStore = (iconStoreFileName, marker, prefix, icons, iconType) => {
    const file = fs.readFileSync(iconStoreFileName, {encoding: 'utf8'})
        .replace(/[\t\r]+/g, '')
        .split('\n');

    const startIdx = file.findIndex((line) => line.includes(`${marker}.start`));
    const endIdx = file.findIndex((line) => line.includes(`${marker}.end`));

    // array of stringify objects
    const storeElements = icons.map((icon) => {
        // const description = icon.split(':')[0].trim();
        const description = icon.key;
        const value = `svg-${iconType ||'icon'} ${prefix}-${description}`;
        return `        {value: \'${value}\', description: \'${description}\'},`;
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

module.exports = {
    makeIconList,
    generateIcons,
    generateIconStore,
};
