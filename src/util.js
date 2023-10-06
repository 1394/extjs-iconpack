/**
 * @class Iconpack.util
 */
Ext.define('Iconpack.util', {
    singleton: true,
    _alignMap: {
        start: 'left',
        end: 'right'
    },

    getIconDiv(iconName, properties = {}) {
        const icon = this.searchIcon(iconName, properties);
        const align = this.getMappedAlignment(properties['align'] || 'center');
        const cellClass = properties['isGridCell'] ? 'svg-in-grid-cell ' : '';
        return  '<div class="' + cellClass + icon +
            ' svg-icon-align-' + align + '"></div>'
    },

    getMappedAlignment(align) {
        return this._alignMap[align] || align;
    },

    searchIcon(iconName, properties) {
        this.icons = Ext.create('class.icons');
        let set;
        switch (properties['set']) {
            case 'fa':
                set = this.icons.getFaIcons();
                break;
            case 'all':
                set = this.icons.getAllIcons(properties['priority']);
                break;
            case 'project':
            default:
                set = this.icons.getIcons();
        }
        const icon = this.searchIconInSet(set, [iconName, properties['defaultIcon'], this.icons.defaultIconName]);

        return icon && icon.value;
    },

    searchIconInSet(set, namesToSearch) {
        let icon;
        for(let i = 0; i < namesToSearch.length && !icon; i++) {
            let iconName = namesToSearch[i];
            if (!iconName) {
                continue;
            }
            if (iconName.indexOf(" ") !== -1) {
                icon = set.find(((item) => item.value === iconName));
            } else {
                icon = set.find(((item) => item.description === iconName));
            }
        }

        return icon;
    }
});
