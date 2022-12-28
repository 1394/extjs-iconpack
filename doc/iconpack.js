const searchInput = document.querySelector('input.search');
const iconContainer = document.querySelector('ul.icon-container');
const iconList = iconContainer.getElementsByTagName('li');

searchInput.addEventListener('input', (e) => {
    const filter = searchInput.value.toLowerCase();
    let hiddenItemsCount = 0;

    for (let i = 0; i < iconList.length; ++i) {
        const item = iconList[i].querySelector('img');
        const searchValue = item.alt;

        if (iconList[i].tagName.toLowerCase() === 'li') {
            if (searchValue.toLowerCase().indexOf(filter) > -1) {
                iconList[i].style.display = '';
            } else {
                iconList[i].style.display = 'none';
                hiddenItemsCount += 1;
            }
        }
    }

    const isEmptyMessageExists = !!iconContainer.querySelector('#message-empty');
    const iconContainerLength = [...iconContainer.children].filter((icon) => icon.tagName === 'LI').length;

    if (hiddenItemsCount >= iconContainerLength) {
        if (!isEmptyMessageExists) {
            const message = document.createElement('div');
            message.textContent = 'Nothing found!';
            message.id = 'message-empty';
            iconContainer.appendChild(message);
        }
    } else {
        if (isEmptyMessageExists) {
            iconContainer.removeChild(iconContainer.querySelector('#message-empty'));
        }
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
    case '/': {
        e.preventDefault();
        searchInput.focus();
        break;
    }

    case 'Escape': {
        e.preventDefault();
        searchInput.blur();
        break;
    }

    default:
        break;
    }
});

searchInput.addEventListener('focus', () => {
    document.querySelector('.search-state').textContent = 'ESC';
});

searchInput.addEventListener('blur', () => {
    document.querySelector('.search-state').textContent = '/';
});

iconContainer.addEventListener('click', (e) => {
    if (e.target.className.includes('svg-icon')) {
        const clsName = e.target.className;
        const iconAlt = e.target.closest('li').querySelector('img').alt;
        const iconCls = `.svg-icon .svg-icon-${iconAlt}`;
        navigator.clipboard.writeText(iconCls);

        e.target.className = 'svg-icon svg-icon-check';
        setTimeout(() => {
            e.target.className = clsName;
        }, 1000);
    }
});
