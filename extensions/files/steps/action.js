
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {


        // arrow navigation
        case "navigate-arrow":

            let path;

            switch(data.arrow) {

                case "up":
                    path = process.storage["path"].split("/");
                    path.pop();
                    path = path.join("/");
                    process.action("navigate-path", {"path": path});
                    break;

                case "back":
                    if(process.storage.historyCursor <= 1) {    // no history to navigate to
                        break;
                    }
                    path = process.storage["history"][process.storage["historyCursor"] - 2];
                    process.action("navigate-path", {"path": path, "fromBack": true});
                    break;

                case "forward":
                    if(process.storage.historyCursor >= process.storage["history"].length) {    // no history to navigate to
                        break;
                    }
                    path = process.storage["history"][process.storage["historyCursor"]];
                    process.action("navigate-path", {"path": path, "fromForward": true});
                    break;

            }

            break;


        // reload (shorthand)
        case "reload":
            process.action("navigate-path", {"path": process.storage["path"]});
            break;


        // navigate to a path
        case "navigate-path":
            
            // get files data
            const fileData = acr.getInode(data.path);

            // put updated path
            if(process.storage["path"] !== data.path) {
                if(data.fromBack) {
                    --process.storage["historyCursor"];
                } else if(data.fromForward) {
                    ++process.storage["historyCursor"];
                } else {
                    process.storage["history"].push(data.path);
                    ++process.storage["historyCursor"];
                }
            }
            process.storage["path"] = data.path;

            // put rows
            id(`window-${windowID}-files-table`).innerHTML = "";
            for(const [name, inode] of Object.entries(fileData.contents)) {

                // add row
                append(`window-${windowID}-files-table`, `
                    <tr class="app-files-filerow" id="window-${windowID}-files-table-${name}">
                        <td>${name}</td>
                        <td>${inode.owner}</td>
                    </tr>
                `);

                // onclick
                onclick(`window-${windowID}-files-table-${name}`, () => {
                    switch(inode.constructor.name) {
                    
                        case "File":
                            // no way to open files yet
                            acr.debugPopup(`Open file "${inode.path}"`);
                            break;

                        case "Folder":
                            // navigate into that folder
                            process.action("navigate-path", {"path": `${process.storage.path}/${name}`})
                            break;

                    }
                });

                // context menu
                acr.contextMenu(`window-${windowID}-files-table-${name}`, [
                    {
                        "type": "button",
                        "text": "Rename",
                        "run": () => {

                            let dialogProcess = new acr.Process("Rename file", "files", windowID);

                            // put dialog
                            new acr.Window("Rename file", `
                                <div class="centered">
                                    <section>
                                        Rename <b>${name}</b> to:
                                    </section>
                                    <section>
                                        <input type="text" id="window-${windowID}-files-renamebox" value="${name}">
                                    </section>
                                    <section>
                                        <button id="window-${windowID}-files-rename">Rename</button>
                                        <button id="window-${windowID}-files-cancel">Cancel</button>
                                    </section>
                                </div>
                            `, dialogProcess);

                            // buttons
                            onclick(`window-${windowID}-files-rename`, () => {

                                // get new path/name
                                let splitted = inode.path.split("/");
                                splitted.pop();
                                splitted = splitted.join("/");
                                const newName = id(`window-${windowID}-files-renamebox`).value;

                                // move
                                inode.move(`${splitted}/${newName}`);

                                // reload and remove popup
                                process.action("reload");
                                dialogProcess.kill();

                            });
                            onclick(`window-${windowID}-files-cancel`, () => {
                                dialogProcess.kill();
                            });

                        },
                    },
                    {
                        "type": "button",
                        "text": "Delete",
                        "run": () => {

                            let dialogProcess = new acr.Process("Delete file", "files", windowID);

                            // put dialog
                            new acr.Window("Delete file", `
                                <div class="centered">
                                    <section>
                                        Are you sure you want to delete <b>${name}</b>?
                                    </section>
                                    <section>
                                        <b>Note that the trash currently isn't implemented, so the file will be permanently deleted.</b>
                                    </section>
                                    <section>
                                        <button id="window-${windowID}-files-confirm">Confirm</button>
                                        <button id="window-${windowID}-files-cancel">Cancel</button>
                                    </section>
                                </div>
                            `, dialogProcess);

                            // buttons
                            onclick(`window-${windowID}-files-confirm`, () => {

                                // delete
                                inode.delete();

                                // reload and remove popup
                                process.action("reload");
                                dialogProcess.kill();

                            });
                            onclick(`window-${windowID}-files-cancel`, () => {
                                dialogProcess.kill();
                            });

                        },
                    }
                ]);

            }

            // make splitted path for path bar
            let splitted;
            if(data.path === "/") {
                splitted = ["/"];
            } else {
                splitted = data.path.split("/");
                splitted[0] = "/";
            }

            // update path bar
            id(`window-${windowID}-files-path`).innerHTML = "";
            let combinedPath = "";
            let i = 0;
            for(const part of splitted) {
                combinedPath += `/${part}`;
                append(`window-${windowID}-files-path`, `
                    <button id="window-${windowID}-files-path-part-${i}">${part}</button>
                `);
                onclick(`window-${windowID}-files-path-part-${i}`, function(path) {
                    let cutPath = path.substring(2);    // remove slash
                    process.action("navigate-path", {"path": cutPath})
                }.bind(null, combinedPath));
                ++i;
            }

            break;

    }

}