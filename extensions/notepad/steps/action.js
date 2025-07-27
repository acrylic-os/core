
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {


        case "save":
            let text = id(`window-${windowID}-notepad-text`).value;
            acr.openFilePicker("Save").then((inode) => {
                switch(inode.constructor.name) {

                    case "File":
                    case "Symlink":
                        acr.spawnPopup(
                            "warning",
                            `
                                <code>${inode.path}</code> already exists. Are you sure you want to overwrite it?
                            `,
                            {
                                "Save anyway": (process) => {
                                    inode.write(text);
                                    process.kill();
                                },
                                "Cancel": (process) => {
                                    process.kill();
                                }
                            }
                        );
                        break;
                    
                    case "Folder":
                        acr.spawnPopup(
                            "error",
                            `
                                <code>${inode.path}</code> is a folder.
                            `,
                            {
                                "OK": (process) => {
                                    process.kill();
                                }
                            }
                        );
                        break;
                    
                    case "NonexistentInode":
                        inode.putFile("", acr.getUser(), text);
                        break;

                }
            });
            break;

        
        case "open":
            acr.openFilePicker("Open").then((inode) => {
                switch(inode.constructor.name) {

                    case "File":
                    case "Symlink":
                        let openedText = inode.read();
                        id(`window-${windowID}-notepad-text`).value = openedText;
                        break;
                    
                    case "Folder":
                        acr.spawnPopup(
                            "error",
                            `
                                <code>${inode.path}</code> is a folder.
                            `,
                            {
                                "OK": (process) => {
                                    process.kill();
                                }
                            }
                        );
                        break;
                    
                    case "NonexistentInode":
                        acr.spawnPopup(
                            "error",
                            `
                                <code>${inode.path}</code> doesn't exist.
                            `,
                            {
                                "OK": (process) => {
                                    process.kill();
                                }
                            }
                        );
                        break;

                }
            });
            break;


    }
}