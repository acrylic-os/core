
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {


        case "save":
            let text = id(`window-${windowID}-notepad-text`).value;
            acr.openFilePicker("Save").then((inode) => {
                let buttons = {};
                switch(inode.constructor.name) {

                    case "File":
                    case "Symlink":
                        buttons[acr.msg("notepad/save-anyway")] = (process) => {
                            inode.write(text);
                            process.kill();
                        };
                        buttons[acr.msg("notepad/cancel")] = (process) => {
                            process.kill();
                        };
                        acr.spawnPopup("warning", acr.msg("notepad/already-exists", [inode.path]), buttons);
                        break;
                    
                    case "Folder":
                        buttons[acr.msg("notepad/ok")] = (process) => {
                            process.kill();
                        };
                        acr.spawnPopup("error", acr.msg("notepad/folder", [inode.path]), buttons);
                        break;
                    
                    case "NonexistentInode":
                        inode.putFile("", acr.getUser(), text);
                        break;

                }
            });
            break;

        
        case "open":
            acr.openFilePicker("Open").then((inode) => {
                let buttons = {};
                switch(inode.constructor.name) {

                    case "File":
                    case "Symlink":
                        let openedText = inode.read();
                        id(`window-${windowID}-notepad-text`).value = openedText;
                        break;
                    
                    case "Folder":
                        buttons[acr.msg("notepad/ok")] = (process) => {
                            process.kill();
                        };
                        acr.spawnPopup("error", acr.msg("notepad/folder", [inode.path]), buttons);
                        break;
                    
                    case "NonexistentInode":
                        buttons[acr.msg("notepad/ok")] = (process) => {
                            process.kill();
                        };
                        acr.spawnPopup(
                            "error", acr.msg("notepad/doesnt-exist", [inode.path]), buttons
                        );
                        break;

                }
            });
            break;


    }
}