/**
 * @class Iconpack.Utilites
 */
Ext.define('Iconpack.Utilites', {
    singleton: true,
    _alignMap: {
        start: 'left',
        end: 'right'
    },
    set: 'project',

    getIconDiv(iconName, properties = {}) {
        const icon = this.searchIcon(iconName, properties);
        const align = this.getMappedAlignment(properties.align || 'center');
        return  '<div class="svg-in-grid-cell ' + icon +
        ' svg-icon-align-' + align + '"></div>'
    },

    getMappedAlignment: function(align) {
        return this._alignMap[align] || align;
    },

    searchIcon: function (iconName, properties) {
        this.icons = Ext.create('class.icons');
        let icon;
        let set;
        switch (properties.set) {
            case 'fa':
                set = this.icons.getFaIcons();
                break;
            case 'project':
            default:
                set = this.icons.getIcons();
        }
        if (iconName.indexOf(" ") !== -1) {
            icon = set.find(((item) => item.value === iconName))
        } else {
            icon = set.find(((item) => item.description === iconName));
        }

        if (!icon && properties.defaultIcon) {
            icon = set.find(((item) => item.description === properties.defaultIcon));
        }
        if (!icon) {
            icon = set.find(((item) => item.description === this.icons.defaultIconName));
        }

        return icon && icon.value;
    },
});
