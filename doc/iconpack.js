const searchInput = document.querySelector('input.search');
const iconContainer = document.querySelector('ul.icon-container');
const showElementsBtn = document.querySelector('.btn-show-icons');
const iconsCount = showElementsBtn.querySelector('.btn-show-icons--count');

let currentIconPack = 'project';

searchInput.addEventListener('input', (e) => {
    if (searchInput.value.length === 0) {
        // clear
        iconContainer.innerHTML = '';
        return;
    }

    setTimeout(() => {
        const searchValue = searchInput.value.toLowerCase();
        const searchItems = [...window.icons[currentIconPack]]
            .filter((item) => {
                return item.name.includes(searchValue);
            })
            .map((item) => {
                return generateIconNode(item);
            });

        iconContainer.replaceChildren(...searchItems);
    }, 300);
});

showElementsBtn.addEventListener('click', () => {
    generateIconList(window.icons[currentIconPack]);
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

const setItemsCount = () => {
    iconsCount.textContent = window.icons[currentIconPack].length;
};

setItemsCount();

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

    iconContainer.innerHTML = '';
    // reset search value
    searchInput.value = '';

    // change active icon list
    // clear container
    iconContainer.innerHTML = '';
    if (pack === 'project') {
        currentIconPack = 'project';
    } else {
        currentIconPack = 'fontAwesome';
    }
    setItemsCount();
});

const generateIconNode = (item) => {
    const template = document.querySelector('#icon-list-item');
    const clone = template.content.cloneNode(true);

    const img = clone.querySelector('img');
    img.src = item.source;
    img.alt = item.alt;

    const p = clone.querySelector('p');
    p.textContent = item.name;

    return clone;
};

const generateIconList = (items) => {
    items.forEach((item) => {
        const clone = generateIconNode(item);
        iconContainer.appendChild(clone);
    });
};

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

        console.log('log', icons.querySelector('.active div'), icons.querySelector('.active div').className)
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

// change pack
const iconContainerHandler = (e) => {
    const iconClsPrefix = currentIconPack === 'project' ? 'svg-icon' : 'svg-fa';

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
                nodeEl.firstChild.classList.replace(nodeEl.firstChild.classList[0], iconClsPrefix)
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
            const iconCls = `${iconClsPrefix} ${iconClsPrefix}-${iconAlt}`;
            navigator.clipboard.writeText(iconCls);

            e.target.className = 'svg-icon svg-icon-check';
            setTimeout(() => {
                e.target.className = clsName;
            }, 1000);
        });
    }
};

iconContainer.addEventListener('click', (e) => iconContainerHandler(e));
