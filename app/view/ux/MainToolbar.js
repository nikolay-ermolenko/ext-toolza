Ext.define("TOOLZA.view.ux.MainToolbar", {
  extend: "Ext.Toolbar",
  xtype: "toolbar_main",
  items: [
    {
      text: "ExtJS Toolza",
      ui: "logo",
      iconCls: "ext ext-sencha",
      handler: () =>
        Ext.create("Ext.Dialog", {
          ui: "help",
          title: 'ExtJS Toolza',
          hideOnMaskTap: true,
          width: "70%",
          height: "60%",
          scrollable: "vertical",
          html: `
            <p>How to use.</p>
            <ul>
              <li>Inspect DOM element</li>
              <li>Find a component in components list</li>
              <li>List item contains xtype, className and VM badge if it has a viewModel</li>
              <li>Click on item to see more info in docked panel</li>
              <li>Double click on item to save component in global var <b>$9</b> and his viewModel on global var <b>$vm</b></li>
            </ul>
          `,
        }).show(),
    },
  ],
});
