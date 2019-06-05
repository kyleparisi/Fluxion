const {app} = require('electron')

let devToolsOpen = false;
const template = function(win) {
  return [
    {
      label: "Application",
      submenu: [
        {
          label: "About Application",
          selector: "orderFrontStandardAboutPanel:"
        },
        {
          type: "separator"
        },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: "File",
      submenu: [
        {
          label: "New",
          click: function() {
            win.send("New");
          }
        },
        {
          label: "Open",
          click: function() {
            win.send("Open");
          },
          accelerator: "CmdOrCtrl+o",
        },
        {
          label: "Save",
          click: function() {
            win.send("Save");
          },
          accelerator: "CmdOrCtrl+S",
        },
        {
          label: "Save As",
          click: function() {
            win.send("Save As");
          }
        },
        {
          label: "Export",
          click: function() {
            win.send("Export");
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          selector: "undo:"
        },
        {
          label: "Redo",
          accelerator: "Shift+CmdOrCtrl+Z",
          selector: "redo:"
        },
        {
          type: "separator"
        },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          selector: "cut:"
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          selector: "copy:"
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          selector: "paste:"
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    },
    {
      label: "Insert",
      submenu: [
        {
          label: "New Node",
          accelerator: "Control+N",
          click: function() {
            win.send("New Node");
          }
        }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CommandOrControl+R",
          click: function() {
            win.reload();
          }
        },
        {
          label: "Console",
          accelerator: "Alt+CmdOrCtrl+I",
          click: function() {
            devToolsOpen ? win.closeDevTools(): win.openDevTools();
            devToolsOpen = !devToolsOpen;
          }
        }
      ]
    }
  ];
};

module.exports = template;
