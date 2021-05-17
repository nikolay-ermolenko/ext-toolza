Ext.define("TOOLZA.view.Main", {
  extend: "Ext.Container",

  requires: ["TOOLZA.view.ux.MainToolbar", "TOOLZA.view.MainController"],

  controller: "main",

  viewModel: {
    data: {
      targetComponent: null,
    },
  },

  layout: "fit",

  items: [
    {
      xtype: "toolbar_main",
      ui: "main",
      docked: "top",
    },
    {
      xtype: "grid",
      reference: "cmpGrid",
      hideHeaders: true,
      variableHeights: true,
      deferEmptyText: false,
      emptyText:
        "No Sencha component associated with the selected element. Please select a different element.",
      bind: {
        selection: "{targetComponent}",
      },
      selectable: {
        mode: "simple",
      },
      store: { data: [] },
      columns: [
        {
          flex: 1,
          tpl: [
            `
            <span class="cmp-id">{id:htmlEncode}</span>
            <span class="cmp-name">{className:htmlEncode}</span>
            <tpl if="hasVM">
              <span class="vm-badge">VM</span>
            </tpl>
            <tpl if="!isVisible && isHidden">
              <div data-expander="bindExpanded" class="x-icon-el x-font-iconf md-icon fi md-icon-visibility-off"></div>
            </tpl>`,
          ],
          cell: {
            encodeHtml: false,
          },
        },
      ],
    },
  ],
});
