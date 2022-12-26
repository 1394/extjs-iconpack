const searchInput = document.querySelector('input.search'),
      iconContainer = document.querySelector('ul.icon-container'),
      iconList = iconContainer.getElementsByTagName('li')

searchInput.addEventListener('input', (e) => {
  const filter = searchInput.value.toLowerCase()
	let hiddenItemsCount = 0

  for (let i = 0; i < iconList.length; ++i) {
    item = iconList[i].querySelector('img')
    searchValue = item.alt

    if (searchValue.toLowerCase().indexOf(filter) > -1) {
      iconList[i].style.display = ''
		} else {
			iconList[i].style.display = 'none'
			hiddenItemsCount += 1
		}
  }

	if (hiddenItemsCount === iconContainer.children.length) {
		const message = document.createElement('div')
		message.textContent = 'Nothing found!'
		message.id = 'message-empty'
		iconContainer.appendChild(message)
	} else {
		iconContainer.removeChild(document.querySelector('#message-empty'))
	}
})

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case '/': {
      e.preventDefault()
      searchInput.focus()
      break;
    }

    case 'Escape': {
      e.preventDefault()
      searchInput.blur()
      break;
    }
  
    default:
      break;
  }
});

searchInput.addEventListener('focus', () => {
	document.querySelector('.search-state').textContent = 'ESC'
})

searchInput.addEventListener('blur', () => {
	document.querySelector('.search-state').textContent = '/'
})
