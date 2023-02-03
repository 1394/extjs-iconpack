const searchInput = document.querySelector('input.search');
const iconContainer = document.querySelector('ul.icon-container.project-icon-container');
const faIconContainer = document.querySelector('ul.icon-container.fa-icon-container');

searchInput.addEventListener('input', (e) => {
    const filter = searchInput.value.toLowerCase();
    let hiddenItemsCount = 0;
    const list = document
        .querySelector('ul.icon-container.active')
        .getElementsByTagName('li');

    // hide list items
    for (let i = 0; i < list.length; ++i) {
        const item = list[i].querySelector('img');
        const searchValue = item.alt;

        if (list[i].tagName.toLowerCase() === 'li') {
            if (searchValue.toLowerCase().indexOf(filter) > -1) {
                list[i].style.display = '';
            } else {
                list[i].style.display = 'none';
                hiddenItemsCount += 1;
            }
        }
    }

    // add empty message if nothing found
    const isEmptyMessageExists = !!list.querySelector('#message-empty');
    const iconContainerLength = [...list.children].filter((icon) => icon.tagName === 'LI').length;

    if (hiddenItemsCount >= iconContainerLength) {
        if (!isEmptyMessageExists) {
            const message = document.createElement('div');
            message.textContent = 'Nothing found!';
            message.id = 'message-empty';
            list.appendChild(message);
        }
    } else {
        if (isEmptyMessageExists) {
            list.removeChild(list.querySelector('#message-empty'));
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

const iconPack = document.querySelector('.icons-pack');
iconPack.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('active')) {
        return;
    }

    // set active class
    [...iconPack.children].forEach((item) => {
        item.classList.remove('active');
    });
    e.target.classList.add('active');

    const pack = target.textContent.toLowerCase().trim();

    // reset search value
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));

    // change active icon list
    if (pack === 'project') {
        faIconContainer.classList.remove('active');
        iconContainer.classList.add('active');
    } else {
        iconContainer.classList.remove('active');
        faIconContainer.classList.add('active');
    }
});

// === Modal ===

// set active icon in modal window
const setActiveIcon = (icons, nodeEl) => {
    icons.querySelectorAll('.icon').forEach((node) => {
        node.classList.remove('active');
    });
    nodeEl.classList.add('active');
};

const modal = document.querySelector('div.icon-modal');

// change icon class
const icons = modal.querySelector('.icons');
icons.addEventListener('click', (e) => {
    if (e.target.closest('.icon-wrapper')) {
        setActiveIcon(icons, e.target.closest('.icon-wrapper').querySelector('.icon'));
        const activeSvgClass = modal.querySelector('span.info-content__cls');
        activeSvgClass.textContent = icons.querySelector('.active div').className;
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

// close modal
const closeBtn = modal.querySelector('span.close');
closeBtn.onclick = function() {
    modal.style.display = 'none';
    setActiveIcon(icons, icons.querySelector('active.div'));
};
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        setActiveIcon(icons, icons.querySelector('active.div'));
    }
};

const iconContainerHandler = (e, iconClsPrefix) => {
    const target = e.target;
    const element = target.closest('li') || target.tagName == 'LI';

    if (element) {
        [...modal.querySelectorAll('.icon')]
            .forEach((nodeEl, idx) => {
                if (idx === 0) {
                    if (nodeEl.firstChild.classList.length == 2) {
                        nodeEl.firstChild.classList.remove([...nodeEl.firstChild.classList].pop());
                    }
                }
                if (nodeEl.firstChild.classList.length === 3) {
                    nodeEl.firstChild.classList.remove([...nodeEl.firstChild.classList].pop());
                }
                nodeEl.firstChild.classList.add(`${iconClsPrefix}-${element.querySelector('img').alt}`);
            });

        setActiveIcon(icons, icons.querySelector('.icon'));
        const activeSvgClass = modal.querySelector('span.info-content__cls');
        activeSvgClass.textContent = icons.querySelector('.active div').className;

        // display modal
        modal.style.display = 'block';

        // copy class
        element.querySelector('div.copy-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const clsName = e.target.className;
            const iconAlt = e.target.closest('li').querySelector('img').alt;
            const iconCls = `svg-icon ${iconClsPrefix}-${iconAlt}`;
            navigator.clipboard.writeText(iconCls);

            e.target.className = 'svg-icon svg-icon-check';
            setTimeout(() => {
                e.target.className = clsName;
            }, 1000);
        });
    }
};

iconContainer.addEventListener('click', (e) => iconContainerHandler(e, 'svg-icon'));
faIconContainer.addEventListener('click', (e) => iconContainerHandler(e, 'svg-icon-fa'));
