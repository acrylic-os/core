
// run

function run(process) {

    let windowID = process.PID;

    // make window
    new acr.Window("Files", `
        <div class="app-files-grid">
            <div class="app-files-left" id="window-${windowID}-files-locations"></div>
            <div class="app-files-path button-group horizontal" id="window-${windowID}-files-path"></div>
            <div class="app-files-options">
                option
            </div>
            <div class="app-files-main">
                <table>
                    <thead>
                        <tr>
                            <th>Filename</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody id="window-${windowID}-files-table"></tbody>
                </table>
            </div>
        </div>
    `, process);

    // make location button info
    const home = `/users/${acr.getUser()}`;
    const locations = [
        {
            "Home": home,
            "Documents": `${home}/Documents`,
            "Downloads": `${home}/Downloads`,
            "Images": `${home}/Images`,
            "Sounds": `${home}/Sounds`,
            "Videos": `${home}/Videos`,
        },
        {
            "Root": "/",
            "Trash": `${home}/Trash`
        }
    ];

    // put location buttons
    let groupI = 0, buttonI = 0;
    for(const locationGroup of locations) {

        // append group
        append(`window-${windowID}-files-locations`, `
            <div class="app-files-locations-group button-group vertical" id="window-${windowID}-files-locations-group-${groupI}"></div>
        `);

        // append buttons
        for(const [display, path] of Object.entries(locationGroup)) {
            append(`window-${windowID}-files-locations-group-${groupI}`, `
                <button id="window-${windowID}-files-locations-button-${buttonI}">${display}</button>
            `);
            onclick(`window-${windowID}-files-locations-button-${buttonI}`, () => {
                process.action("navigate", {"path": path});
            });
            ++buttonI;
        }

        ++groupI;

    }

}