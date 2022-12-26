const searchInput = document.querySelector('input.search'),
      iconContainer = document.querySelector('ul.icon-container'),
      iconList = iconContainer.getElementsByTagName('li')

searchInput.addEventListener('input', (e) => {
  const filter = searchInput.value.toLowerCase()

  for (let i = 0; i < iconList.length; ++i) {
    item = iconList[i].querySelector('img');
    searchValue = item.alt;

    searchValue.toLowerCase().indexOf(filter) > -1 ?
      iconList[i].style.display = '' :
      iconList[i].style.display = 'none'
  }
})

window.addEventListener("keyup", (e) => {
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
