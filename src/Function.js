/**
 * @class Iconpack.Function
 */
Ext.define('Iconpack.Function', {
    singleton: true,
    _alignMap: {
        start: 'left',
        end: 'right'
    },

    getIconDiv(iconName, properties = {}) {
        const icon = this.searchIcon(iconName, properties.defaultIcon);
        const align = this.getMappedAlignment(properties.align || 'center');
        return  '<div class="svg-in-grid-cell ' + icon +
        ' svg-icon-align-' + align + '"></div>'
    },

    getMappedAlignment: function(align) {
        return this._alignMap[align] || align;
    },

    searchIcon: function (iconName, defaultIcon) {
        this.icons = Ext.create('class.icons');
        let icon;
        if (iconName.startsWith("svg-icon ")) {
            icon = this.icons.getIcons().find(((item) => item.value === iconName))
        } else if (iconName.startsWith("svg-fa ")) {
            icon = this.icons.getFaIcons().find(((item) => item.value === iconName))
        } else {
            icon = this.icons.getIcons().find(((item) => item.description === iconName)) ||
                this.icons.getFaIcons().find(((item) => item.description === iconName));
        }

        if (!icon && defaultIcon) {
            icon = this.icons.getIcons().find(((item) => item.description === defaultIcon)) ||
                this.icons.getFaIcons().find(((item) => item.description === defaultIcon));
        }
        if (!icon) {
            icon = this.icons.getFaIcons().find(((item) => item.description === this.icons.defaultIconName));
        }

        return icon && icon.value;
    },
});
