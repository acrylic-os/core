
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {

        // navigate to a path
        case "navigate":
            
            // get files data
            const fileData = acr.getInode(data.path);

            // put rows
            id(`window-${windowID}-files-table`).innerHTML = "";
            for(const [name, inode] of Object.entries(fileData.contents)) {
                append(`window-${windowID}-files-table`, `
                    <tr class="app-files-filerow" id="window-${windowID}-files-table-${name}">
                        <td>${name}</td>
                        <td>${inode.owner}</td>
                    </tr>
                `);
                onclick(`window-${windowID}-files-table-${name}`, () => {
                    switch(inode.constructor.name) {
                    
                        case "File":
                            // no way to open files yet
                            acr.debugPopup(`Open file "${inode.path}"`);
                            break;

                        case "Folder":
                            // navigate into that folder
                            process.action("navigate", {"path": "/"})
                            break;

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
                    process.action("navigate", {"path": cutPath})
                }.bind(null, combinedPath));
                ++i;
            }

            break;

    }

}