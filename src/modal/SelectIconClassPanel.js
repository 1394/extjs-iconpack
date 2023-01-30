/**
 * Панель выбора значка для кнопки. При выборе генерирует событие "select", в обработчик передаёт название стиля,
 * определяющего значок.
 */
Ext.define('Iconpack.modal.SelectIconClassPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'SelectIconClassPanel',
    cls: 'SelectIconClassPanel',
    title: 'Выберите подходящий значок',

    requires: ['Iconpack.modal.Icons'],

    width: 1080,
    height: 750,
    padding: 10,
    overflowY: true,

    // search field
    dockedItems: [{
        xtype: 'panel',
        dock: 'top',
        items: [
            {
                xtype: 'textfield',
                width: 300,
                name: 'icon',
                fieldLabel: 'Поиск иконки',
                reference: 'search-icon-field',
            }
        ],
    }],

    initComponent: function() {
        this.callParent(arguments);

        this.iconsStore = Ext.create('class.icons');

        // insert icons from store
        this.insertIcons(this.getIconsData());

        // update view on search
        const searchField = this.down('[reference=\'search-icon-field\']');
        searchField.on('change', (field) => {
            this.filterIcons(field.value);
        });
    },

    /**
     * insert icons into panel
     * @param {Object<{ value: String, description: String }>} icons
     */
    insertIcons(icons) {
        // generate icons table
        icons.forEach((icon) => {
            this.add({
                xtype: 'button',
                iconCls: icon.value,
                tooltip: icon.description,
                text: icon.description,
                cellCls: 'x-ccb-btn-select',
                handler: function(btn) {
                    this.fireEvent('select', this, btn.iconCls);
                }.bind(this),
            });
        });
    },

    /**
     * Filter icons in store
     * @param {String} searchValue
     */
    filterIcons(searchValue) {
        this.items.getRange().forEach((item) => {
            if (item.text.includes(searchValue)) {
                item.setStyle('display', '');
            } else {
                item.setStyle('display', 'none');
            }
        });
    },

    getIconsData() {
        return this.iconsStore.getIcons();
    },
});
