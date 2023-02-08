/**
 * Панель выбора значка для кнопки. При выборе генерирует событие "select", в обработчик передаёт название стиля,
 * определяющего значок.
 */
Ext.define('Iconpack.modal.SelectIconClassPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'SelectIconClassPanel',
    cls: 'SelectIconClassPanel',
    title: 'Выберите подходящий значок',

    requires: ['Iconpack.modal.Icons'],

    width: 1080,
    height: 750,

    // search field, buttons to change icons layout
    dockedItems: [
        {
            xtype: 'panel',
            dock: 'top',
            margin: 10,
            cls: 'icon-pack-search',
            items: [
                {
                    xtype: 'textfield',
                    width: 300,
                    name: 'icon',
                    fieldLabel: 'Поиск иконки',
                    itemId: 'search-icon-field',
                }
            ],
        }
    ],

    items: [
        {
            xtype: 'panel',
            title: 'Project',
            overflowY: true,
            padding: 10,
            itemId: 'project-tab-panel',
        },
        {
            xtype: 'panel',
            title: 'Font awesome',
            overflowY: true,
            padding: 10,
            itemId: 'font_awesome-tab-panel',
        }
    ],

    initComponent: function() {
        this.callParent(arguments);

        this.iconsStore = Ext.create('class.icons');

        // insert icons into tabs
        const projectTab = this.down('#project-tab-panel');
        const fontAwesome = this.down('#font_awesome-tab-panel');

        this.insertIcons(this.getIconsData('project'), projectTab);
        this.insertIcons(this.getIconsData('fontAwesome'), fontAwesome);

        // update view on search
        this.searchField = this.down('#search-icon-field');
        // clear search value and tab filtration
        this.on('tabchange', () => {
            this.searchField.setValue('');
            this.filterIcons(this.searchField.getValue());
        });
        this.searchField.on('change', (field) => {
            this.filterIcons(field.value);
        });
    },

    /**
     * insert icons into panel
     * @param {Object<{ value: String, description: String }>} icons
     */
    insertIcons(icons, tab) {
        // generate icons table
        icons.forEach((icon) => {
            tab.add({
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
        this.getActiveTab().items.getRange().forEach((item) => {
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
