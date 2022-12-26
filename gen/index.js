const fs = require('fs')

// path to styles file
const filename = './sass/src/all.scss';
const iconPath = './resources/images/icon'

// read file and split by line
// TODO: make one replace method instead
const styles = fs.readFileSync(filename, { encoding: 'utf8' })
	.replace(/\t/g, "")
	.replace(/\r/g, "")
	.split('\n')

// get all icons to icons array
let iconListStartIdx = styles.findIndex((line) => line === '$icon-list: (')
let tempIdxToReadStyles = iconListStartIdx + 1

const icons = []
let iconsIdx = 0

while (styles[tempIdxToReadStyles] !== ');') {
	const iconName = styles[tempIdxToReadStyles].split(':')[0]
	icons[iconsIdx] = iconName
	
	iconsIdx += 1
	tempIdxToReadStyles += 1
}

// generate index.html file with icons
const iconsImages = icons
	.map((icon) => `\t\t\t<img src="../resources/images/icon/${icon}.svg" alt="${icon}">\r`)
	.join('')

fs.readFile('gen/index.html', 'utf8', function(err, data) {
  if (err) {
    return console.log(err)
  }

  const lines = data.split('\n')

  // imageIdx
  const iconContainerIdx = lines.findIndex((line) => line.includes('icon-container'))
  let imageIdx = iconContainerIdx + 1

  // delete prev images container
  while (!lines[imageIdx + 1].includes('</div>')) {
    lines.splice(imageIdx, 1)
  }
  lines[imageIdx] = ''

  // set icon images
  lines[iconContainerIdx + 1] = iconsImages
  const result = lines
	.map((line) => {
		if (line !== '') {
			return `${line}\n` 
		} 
	})
	.join('')

  fs.writeFile('gen/index.html', result, 'utf8', function (err) {
     if (err) return console.log(err)
  })
})

console.log('generate')
