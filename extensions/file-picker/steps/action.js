
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
            id(`window-${windowID}-file-picker-table`).innerHTML = "";
            for(const [name, inode] of Object.entries(fileData.contents)) {

                // add row
                append(`window-${windowID}-file-picker-table`, `
                    <tr class="app-file-picker-filerow" id="window-${windowID}-file-picker-table-${name}">
                        <td>${name}</td>
                        <td>${inode.owner}</td>
                    </tr>
                `);

                // onclick
                onclick(`window-${windowID}-file-picker-table-${name}`, () => {
                    switch(inode.constructor.name) {
                    
                        case "File":
                            // since this is the file picker, run the completion function
                            const pickedPath = `${process.storage["path"]}/${name}`;
                            process.storage["completion"](pickedPath);
                            process.kill();
                            break;

                        case "Folder":
                            // navigate into that folder
                            process.action("navigate-path", {"path": "/"})
                            break;

                    }
                });

                // context menu
                acr.contextMenu(`window-${windowID}-file-picker-table-${name}`, {
                    "Rename": () => {

                        let dialogProcess = new acr.Process("Rename file", "files", windowID);

                        // put dialog
                        new acr.Window("Rename file", `
                            <div class="centered">
                                <section>
                                    Rename <b>${name}</b> to:
                                </section>
                                <section>
                                    <input type="text" id="window-${windowID}-file-picker-renamebox"></input>
                                </section>
                                <section>
                                    <button id="window-${windowID}-file-picker-rename">Rename</button>
                                    <button id="window-${windowID}-file-picker-cancel">Cancel</button>
                                </section>
                            </div>
                        `, dialogProcess);

                        // buttons
                        onclick(`window-${windowID}-file-picker-rename`, () => {

                            // get new path/name
                            let splitted = inode.path.split("/");
                            splitted.pop();
                            splitted = splitted.join("/");
                            const newName = id(`window-${windowID}-file-picker-renamebox`).value;

                            // move and reload
                            inode.move(`${splitted}/${newName}`);
                            process.action("reload");

                        });
                        onclick(`window-${windowID}-file-picker-cancel`, () => {
                            dialogProcess.kill();
                        });

                    },
                    "Delete": () => {

                        // TBA

                    }
                });

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
            id(`window-${windowID}-file-picker-path`).innerHTML = "";
            let combinedPath = "";
            let i = 0;
            for(const part of splitted) {
                combinedPath += `/${part}`;
                append(`window-${windowID}-file-picker-path`, `
                    <button id="window-${windowID}-file-picker-path-part-${i}">${part}</button>
                `);
                onclick(`window-${windowID}-file-picker-path-part-${i}`, function(path) {
                    let cutPath = path.substring(2);    // remove slash
                    process.action("navigate-path", {"path": cutPath})
                }.bind(null, combinedPath));
                ++i;
            }

            break;

    }

}