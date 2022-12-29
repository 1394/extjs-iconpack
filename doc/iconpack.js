const searchInput = document.querySelector('input.search');
const iconContainer = document.querySelector('ul.icon-container');
const iconList = iconContainer.getElementsByTagName('li');

searchInput.addEventListener('input', (e) => {
    const filter = searchInput.value.toLowerCase();
    let hiddenItemsCount = 0;

    // hide list items
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

    // add empty message if nothing found
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

// focus input on special keys
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

// change input focus handling key message
searchInput.addEventListener('focus', () => {
    document.querySelector('.search-state').textContent = 'ESC';
});

searchInput.addEventListener('blur', () => {
    document.querySelector('.search-state').textContent = '/';
});

// === Modal ===

// set active icon in modal window
const setActiveIcon = (icons, nodeEl) => {
    icons.childNodes.forEach((node) => {
        node.classList.remove('active');
    });
    nodeEl.classList.add('active');
};

Array.from(iconContainer.children).forEach((element) => {
    element.addEventListener('click', (e) => {
        const modal = document.querySelector('div.icon-modal');

        // set icon class
        [...modal.querySelector('div.icons').children]
            .forEach((nodeEl) => {
                if (nodeEl.firstChild.classList.length === 3) {
                    nodeEl.firstChild.classList.remove([...nodeEl.firstChild.classList].pop());
                }
                nodeEl.firstChild.classList.add(`svg-icon-${element.querySelector('img').alt}`);
            });

        // set icon name
        modal.querySelector('.modal-content__icon-name').textContent = element.querySelector('img').alt;

        // change icon class
        const icons = modal.querySelector('.icons');
        icons.addEventListener('click', (e) => {
            if (e.target.closest('.icon')) {
                setActiveIcon(icons, e.target.closest('.icon'));
            }
        });

        // copy class in modal
        modal.querySelector('.copy-btn-wrapper button').addEventListener('click', (e) => {
            navigator.clipboard.writeText(icons.querySelector('.active div').className);
            const copyBtn = e.currentTarget;
            copyBtn.textContent = 'COPIED';
            setTimeout(() => {
                copyBtn.textContent = 'COPY';
            }, 1000);
        });

        // display modal
        modal.style.display = 'block';

        // close modal
        const closeBtn = modal.querySelector('span.close');
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            setActiveIcon(icons, icons.firstChild);
        };
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
                setActiveIcon(icons, icons.firstChild);
            }
        };
    });

    // copy class
    element.querySelector('div.copy-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const clsName = e.target.className;
        const iconAlt = e.target.closest('li').querySelector('img').alt;
        const iconCls = `svg-icon svg-icon-${iconAlt}`;
        navigator.clipboard.writeText(iconCls);

        e.target.className = 'svg-icon svg-icon-check';
        setTimeout(() => {
            e.target.className = clsName;
        }, 1000);
    });
});
