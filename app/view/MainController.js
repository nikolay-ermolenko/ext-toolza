Ext.define("TOOLZA.view.MainController", {
  extend: "Ext.app.ViewController",

  alias: "controller.main",

  control: {
    grid: {
      painted: "onGridPainted",
      childdoubletap: "onTreeItemDoubleTap",
      childtap: "onGridChildTap",
      childmouseenter: "onGridChildMouseEnter",
      childmouseleave: "onGridChildMouseLeave",
    },
  },

  bindings: {
    onSelectTargetComponent: "{targetComponent}",
  },

  init: function () {
    if (!chrome.devtools) return;

    this.dropHighlightElement();

    chrome.devtools.panels.elements.onSelectionChanged.addListener(
      this.getElementData.bind(this)
    );
  },

  createHighlightElement(id) {
    var script = `
    if(Ext.getCmp("${id}")) {
      $cr = Ext.getCmp("${id}").el.dom.getBoundingClientRect();
      $d=document.createElement('div');
      $d.setAttribute('id','toolzahighlighter');
      $d.style.setProperty('background','rgba(60,255,10,.3)');
      $d.style.setProperty('box-shadow','red 0px 0px 0px 1px inset');
      $d.style.setProperty('position','absolute');
      $d.style.setProperty('z-index',9999999);
      document.body.append($d);
      $d.style.setProperty("left",$cr.left+"px");
      $d.style.setProperty("top",$cr.top+"px");
      $d.style.setProperty("width",$cr.width+"px");
      $d.style.setProperty("height",$cr.height+"px");
    }`;
    chrome.devtools.inspectedWindow.eval(script);
  },

  dropHighlightElement() {
    chrome.devtools.inspectedWindow.eval(
      `
        $d=document.getElementById('toolzahighlighter');
        $d.parentElement.removeChild($d);
        $d = null;
        $cr = null;
      `
    );
  },

  getElementData() {
    chrome.devtools.inspectedWindow.eval(
      "new (" + ComponentLocator.toString() + ")($0)",
      this.processElementData.bind(this)
    );
  },

  processElementData: function (result) {
    var grid = this.lookup("cmpGrid");
    var store = grid.getStore();

    grid.getHeaderContainer().show();

    grid.refresh();
    grid.setStore({
      idProperty: "id",
      parentIdProperty: "parentId",
      data: result ? JSON.parse(result.componentStore) : [],
      root: {
        expanded: true,
      },
    });

    if (store) {
      store.destroy();
    }
  },

  onTreeItemDoubleTap(view, location) {
    var id = location.record.getId();
    chrome.devtools.inspectedWindow.eval(
      "$9=Ext.getCmp('" +
        id +
        "');$vm=Ext.getCmp('" +
        id +
        "').lookupViewModel();console.log($9);console.log($vm);"
    );

    Ext.toast({
      message: "Print $9 or $vm in console",
      timeout: 900,
      alignment: "tr-br",
    });
  },

  onSelectTargetComponent(record) {
    var sheet = Ext.getCmp("main_actionsheet");

    if (!sheet) return;

    if (!record) {
      sheet.hide();
      return;
    }
  },

  onGridChildTap(view, location) {
    var sheet = Ext.getCmp("main_actionsheet");

    if (!sheet) return;

    if (!sheet.isVisible()) {
      sheet.show();
    }

    sheet.getViewModel().set("record", location.record);
  },

  onGridChildMouseEnter(view, location) {
    var id = location.record.getId();

    this.createHighlightElement(id);
  },

  onGridChildMouseLeave() {
    this.dropHighlightElement();
  },

  onGridPainted(grid) {
    grid.getHeaderContainer().hide();
  },
});
