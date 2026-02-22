
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
            
            // remove double slashes
            data.path = acr.rds(data.path);

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
                            // since this is the file picker, pick the file
                            process.action("select", {"path": `${process.storage.path}/${name}`});
                            break;

                        case "Folder":
                            // navigate into that folder
                            process.action("navigate-path", {"path": `${process.storage.path}/${name}`})
                            break;

                    }
                });

                // context menu
                acr.contextMenu(`window-${windowID}-file-picker-table-${name}`, [
                    {
                        "type": "button",
                        "text": acr.msg("files/rename/button"),
                        "run": () => {

                            let dialogProcess = new acr.Process(acr.msg("files/rename/title"), "files", windowID);

                            // put dialog
                            new acr.Window("Rename file", `
                                <div class="centered">
                                    <section>
                                        ${acr.msg("files/rename/text", [`<b>${name}</b>`])}
                                    </section>
                                    <section>
                                        <input type="text" id="window-${windowID}-files-renamebox" value="${name}">
                                    </section>
                                    <section>
                                        <button id="window-${windowID}-files-rename">${acr.msg("files/rename/confirm")}</button>
                                        <button id="window-${windowID}-files-cancel">${acr.msg("files/rename/cancel")}</button>
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
                        "text": acr.msg("files/delete/button"),
                        "run": () => {

                            let dialogProcess = new acr.Process(acr.msg("files/delete/title"), "files", windowID);

                            // put dialog
                            new acr.Window(acr.msg("files/delete/title"), `
                                <div class="centered">
                                    <section>
                                        ${acr.msg("files/delete/text", [`<b>${name}</b>`])}
                                    </section>
                                    <section>
                                        <b>${acr.msg("files/delete/permanent")}</b>
                                    </section>
                                    <section>
                                        <button id="window-${windowID}-files-confirm">${acr.msg("files/delete/confirm")}</button>
                                        <button id="window-${windowID}-files-cancel">${acr.msg("files/delete/cancel")}</button>
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

        
        // select file
        case "select":

            // make final path
            let selectedPath = data["path"];
            if(id(`window-${windowID}-file-picker-filename`).value != "") {
                selectedPath += `/${id(`window-${windowID}-file-picker-filename`).value}`;
            }
            selectedPath = acr.rds(selectedPath);

            // done
            process.storage["completion"](selectedPath);
            process.kill();
                // this instance of the file picker has fully served its purpose and therefore will now self-destruct

            break;

    }

}