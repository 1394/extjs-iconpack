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

    // search field, buttons to change icons layout
    dockedItems: [
        {
            xtype: 'panel',
            dock: 'top',
            margin: '0 0 15 0',
            cls: 'icon-pack-search',
            items: [
                {
                    xtype: 'textfield',
                    width: 300,
                    name: 'icon',
                    fieldLabel: 'Поиск иконки',
                    reference: 'search-icon-field',
                },
                {
                    xtype: 'button',
                    text: 'Project',
                    iconsTypeProp: 'project',
                    reference: 'btn-project',
                    scale: 'medium',
                    handler() {
                        this.up('SelectIconClassPanel').setIconsType(this);
                    },
                },
                {
                    xtype: 'button',
                    text: 'Font Awesome',
                    iconsTypeProp: 'fontAwesome',
                    reference: 'btn-font_awesome',
                    scale: 'medium',
                    handler() {
                        this.up('SelectIconClassPanel').setIconsType(this);
                    },
                }
            ],
        }
    ],

    initComponent: function() {
        this.callParent(arguments);

        this.iconsStore = Ext.create('class.icons');

        this.down('[reference=\'btn-project\']').setDisabled(true);
        // insert icons from store
        this.insertIcons(this.getIconsData());

        // update view on search
        this.searchField = this.down('[reference=\'search-icon-field\']');
        this.searchField.on('change', (field) => {
            this.filterIcons(field.value);
        });
    },

    // TODO: refactor to controller
    setIconsType(button) {
        this.searchField.setValue('');
        button.setDisabled(true);
        if (button.iconsTypeProp === 'fontAwesome') {
            this.down('[reference=\'btn-project\']').setDisabled(false);
        } else {
            this.down('[reference=\'btn-font_awesome\']').setDisabled(false);
        }
        this.removeAll();
        this.insertIcons(this.getIconsData(button.iconsTypeProp));
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
                cls: 'icon-pack-grid-btn',
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

    getIconsData(type) {
        if (type === 'fontAwesome') {
            return this.iconsStore.getFaIcons();
        }
        return this.iconsStore.getIcons();
    },
});
