
function run(process) {

    let windowID = process.PID;

    // spawn window
    new acr.Window("Settings", `
        <section id="window-${windowID}-settings-tab-buttons" class="button-group horizontal"></section>
        <h2 id="window-${windowID}-settings-tab-title"></h2>
        <div id="window-${windowID}-settings-content"></div>
    `, process);

    // render tab selector
    for (const [tabID, tabData] of Object.entries(settingsData)) {
        append(`window-${windowID}-settings-tab-buttons`,
            `<button class="bflat" id="window-${windowID}-settings-tab-button-${tabID}">${tabData["name"]}</button>`
        );
        id(`window-${windowID}-settings-tab-button-${tabID}`).addEventListener("click",
            function (tab) {
                process.action("switch_tab", {"tab": tab})
            }.bind(null, tabID)
        );
    }

    // render the general tab
    process.action("switch_tab", {"tab": "general"});


}

