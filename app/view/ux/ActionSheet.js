Ext.define("TOOLZA.view.ux.ActionSheet", {
  extend: "Ext.ActionSheet",
  ui: "component-details",
  xtype: "main_actionsheet",
  reference: "componentDetails",
  closeAction: "hide",
  userSelectable: "text",
  scrollable: "vertical",
  // title: "",
  tpl: [
    `
      <tpl if="!isVisible && isHidden">
        <div data-expander="toggle" class="toggle-expander x-font-icon md-icon fi md-icon-visibility-off"></div>
      </tpl>
      <a href="{path}">{path:this.getPathName}</a>
      <pre>id: {id}</pre>
      <pre>className: {className}</pre>
      <pre>xtypes: [{xtypes}]</pre>
      <tpl if="bindExpanded">
        <div data-expander="bindExpanded" class="detail-expander x-font-icon md-icon fi md-icon-expand-less"></div>
        <pre>bind: {bind}</pre>
      <tpl else>
        <div data-expander="bindExpanded" class="detail-expander x-font-icon md-icon fi md-icon-expand-more"></div>
        <pre>bind: { ... }</pre>
      </tpl>
      <tpl if="initialConfigExpanded">
        <div data-expander="initialConfigExpanded" class="detail-expander x-font-icon md-icon fi md-icon-expand-less"></div>
        <pre>initialConfig: {initialConfig}</pre>
      <tpl else>
        <div data-expander="initialConfigExpanded" class="detail-expander x-font-icon md-icon fi md-icon-expand-more"></div>
        <pre>initialConfig: { ... }</pre>
      </tpl>
      <tpl if="defaultConfigExpanded">
        <div data-expander="defaultConfigExpanded" class="detail-expander  x-font-icon md-icon fi md-icon-expand-less"></div>
        <pre>defaultConfig: {defaultConfig}</pre>
      <tpl else>
        <div data-expander="defaultConfigExpanded" class="detail-expander x-font-icon md-icon fi md-icon-expand-more"></div>
        <pre>defaultConfig: { ... }</pre>
      </tpl>
      <tpl if="viewModelExpanded">
        <div data-expander="viewModelExpanded" class="detail-expander x-font-icon md-icon fi md-icon-expand-less"></div>
        <pre>viewModel: {viewModel}</pre>
      <tpl else>
        <div data-expander="viewModelExpanded" class="detail-expander x-font-icon md-icon fi md-icon-expand-more"></div>
        <pre>viewModel: { ... }</pre>
      </tpl>
      <tpl if="recordExpanded">
        <div data-expander="recordExpanded" class="detail-expander x-font-icon md-icon fi md-icon-expand-less"></div>
        <pre>record: {record}</pre>
      <tpl else>
        <div data-expander="recordExpanded" class="detail-expander x-font-icon md-icon fi md-icon-expand-more"></div>
        <pre>record: { ... }</pre>
      </tpl>
    `,
    {
      getPathName: (path) => (path || "").split("..")[1],
    },
  ],
  bind: {
    // title: "id: {record.id:htmlEncode}",
    data: "{data}",
  },
  listeners: {
    element: "element",
    tap: "toggleDetails",
  },
  // tools: [
  //   {
  //     xtype: "button",
  //     ui: "round",
  //     iconCls: "fi md-icon-chevron-right",
  //     weight: -1000,
  //     listeners: {
  //       tap: (btn) => btn.up("main_actionsheet").hide(),
  //     },
  //   },
  //   {
  //     xtype: "spacer",
  //     weight: -1000,
  //     width: 10,
  //   },
  // ],
  controller: {
    toggleDetails(event, el) {
      const vm = this.getViewModel();
      const dataExpander = el.getAttribute("data-expander");

      if (!dataExpander) return;

      if (dataExpander === "toggle") {
        const { id } = this.getView().getData() || {};

        chrome.devtools.inspectedWindow.eval(
          "Ext.getCmp('" +
            id +
            "').setHidden(Ext.getCmp('" +
            id +
            "').isVisible());console.log();"
        );
        return;
      }

      vm.set(dataExpander, !vm.get(dataExpander));
    },
  },
  viewModel: {
    data: {
      record: null,
      bindExpanded: true,
      initialConfigExpanded: true,
      defaultConfigExpanded: true,
      viewModelExpanded: true,
      recordExpanded: true,
    },
    formulas: {
      data: (get) =>
        Ext.apply(
          get("record")
            ? get("record").getData()
            : {
                isVisible: false,
                isHidden: true,
              },
          {
            bindExpanded: get("bindExpanded"),
            initialConfigExpanded: get("initialConfigExpanded"),
            defaultConfigExpanded: get("defaultConfigExpanded"),
            viewModelExpanded: get("viewModelExpanded"),
            recordExpanded: get("recordExpanded"),
          }
        ),
    },
  },
  modal: true,
  width: "30%",
  minWidth: 120,
  maxWidth: 600,
  side: "right",
  cls: "display-values",
});
