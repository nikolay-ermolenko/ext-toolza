// chrome.devtools.panels.create("Ext Toolza", "", "app.html", function () {});
chrome.devtools.panels.elements.createSidebarPane(
  "ExToolza",
  function (sidebar) {
    sidebar.setPage("app.html");
    sidebar.setHeight("300px");
  }
);
