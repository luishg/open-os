// Function to be executed in the content script to open a side panel
function openSidePanel() {
  let panel = document.createElement('div');
  panel.id = 'my-side-panel';
  panel.style.width = '300px';
  panel.style.height = '100%';
  panel.style.position = 'fixed';
  panel.style.top = '0';
  panel.style.right = '0';
  panel.style.zIndex = '1000';
  panel.style.backgroundColor = 'white';
  panel.innerHTML = '<iframe src="panel.html" style="width:100%;height:100%;border:none;"></iframe>';
  document.body.appendChild(panel);
}

// Create a new context menu item to open in a side panel.
//chrome.contextMenus.create({
//  id: "openPanel",
//  title: "Open Panel",
//  contexts: ["all"]
//});

// Create another context menu item to open in a new tab.
chrome.contextMenus.create({
  id: "openTab",
  title: "Open Tab",
  contexts: ["all"]
});

// Add a click event listener.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openPanel") {
    // Open the side panel with your panel.html file.
    // Note: The sidePanel API is experimental and may not be available in all versions of Chrome.
    //chrome.sidePanel.setPanel({ panel: chrome.runtime.getURL("panel.html") }).catch((error) => console.error(error));
    openSidePanel();
  } else if (info.menuItemId === "openTab") {
    // Open a new tab with your panel.html file.
    chrome.tabs.create({ url: chrome.runtime.getURL("panel.html") });
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));