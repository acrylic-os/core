

function action(process, action, data) {

    let windowID = process.PID;

    switch (action) {

        // the user switched the tab
        case "switch_tab":

            // render tab
            let optionsDisplay = "";
            let attr_id, attr_action, selected;
            let eventListenersToPut = {};
            const tab = data["tab"];
            for (const [optionID, optionData] of Object.entries(settingsData[tab]["options"])) {

                optionsDisplay += "<fieldset>";

                // id and on(something) attributes
                attr_id = `window-${windowID}-settings-option-${optionID}`;
                attr_action = function (tab2, optionID2) {
                    process.action("option", {'tab': tab2, 'option': optionID2})
                }.bind(null, tab, optionID);

                // set selected value
                if ("selected" in optionData) {
                    switch (optionData["selected"][0]) {
                        case "global":
                            selected = acr.getGlobalConfig(optionData["selected"][1]);
                            break;
                        case "user":
                            selected = acr.getUserConfig(optionData["selected"][1]);
                            break;
                    }
                }

                // switch type
                switch (optionData["type"]) {

                    case "html":
                        optionsDisplay += optionData["html"];
                        break;

                    case "button":
                        optionsDisplay += `
                            <legend>${optionData["name"]}</legend>
                            <button class="bflat" id="${attr_id}">
                                ${optionData["name"]}
                            </button>
                            <span class="subtitle">${optionData["subtitle"]}</span>
                        `;
                        eventListenersToPut[optionID] = {
                            "type": "click",
                            "listener": attr_action
                        };
                        break;

                    case "select":
                        let selectOptions = "";
                        for (const [selectID, selectName] of Object.entries(optionData["options"])) {
                            selectOptions += `
                                <option value="${selectID}" ${selectID === selected ? "selected" : ""}>
                                    ${selectName}
                                </option>
                            `;
                        }
                        optionsDisplay += `
                            <legend>${optionData["name"]}</legend>
                            <select id="${attr_id}">
                                ${selectOptions}
                            </select>
                            <span class="subtitle">${optionData["subtitle"]}</span>
                        `;
                        eventListenersToPut[optionID] = {
                            "type": "change",
                            "listener": attr_action
                        };
                        break;

                    case "checkbox":
                        optionsDisplay += `
                            <legend>${optionData["name"]}</legend>
                            <input type="checkbox" id="${attr_id}" ${selected ? "checked" : ""}>
                            <span>${optionData["name"]}</span>
                            <span class="subtitle">${optionData["subtitle"]}</span>
                        `;
                        eventListenersToPut[optionID] = {
                            "type": "click",
                            "listener": attr_action
                        };
                        break;
                    
                    case "textbox":
                        optionsDisplay += `
                            <legend>${optionData["name"]}</legend>
                            <input type="text" id="${attr_id}" value="${selected}" placeholder="${optionData["placeholder"]? "":optionData["placeholder"]}">
                            <span class="subtitle">${optionData["subtitle"]}</span>
                        `;
                        eventListenersToPut[optionID] = {
                            "type": "input",
                            "listener": attr_action
                        };
                        break;

                    case "extension-load":
                        optionsDisplay += `
                            <legend>Add a new extension</legend>
                            <input id="window-${windowID}-settings-extension-path" type="text" placeholder="ID (core) or link (external)">
                            <button id="window-${windowID}-settings-extension-load">Load</button>
                        `;
                        break;

                    case "extension-list":
                        optionsDisplay += `
                            <legend>Loaded extensions</legend>
                            <table class="apps-settings-extension-table">
                                <thead>
                                    <tr class="apps-settings-extension-table-header">
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="window-${windowID}-settings-extension-table-body">
                            </table>
                        `;
                        break;
                    
                    // extension-load and extension-list can't just be a html in the settingsData cuz they need the windowID

                }

                optionsDisplay += "</fieldset>";

            }

            // set content
            id(`window-${windowID}-settings-content`).innerHTML = optionsDisplay;

            // put event listeners
            for (const [option, listenerData] of Object.entries(eventListenersToPut)) {
                id(`window-${windowID}-settings-option-${option}`).addEventListener(listenerData.type, listenerData.listener);
            }

            // put extension load and table rows
            if(tab == "extensions") {

                // load button
                onclick(`window-${windowID}-settings-extension-load`, () => {
                    const path = id(`window-${windowID}-settings-extension-path`).value;
                    let extensions = acr.getUserConfig("extensions");
                    extensions.push(path);
                    acr.setUserConfig("extensions", extensions);
                    process.action("reload-popup");
                });

                // table rows
                for(const [path, info] of Object.entries(acr.extensionInfos)) {
                    append(`window-${windowID}-settings-extension-table-body`, `
                        <tr>
                            <td><code>${info.id}</code></td>
                            <td>${"appInfo" in info? info.appInfo.display:""}</td>
                            <td>${info.type}</td>
                            <td>
                                <button id="window-${windowID}-settings-extension-${info.id}-uninstall">Uninstall</button>
                            </td>
                        </tr>
                    `);
                    onclick(`window-${windowID}-settings-extension-${info.id}-uninstall`, () => {
                        let extensions = acr.getUserConfig("extensions");
                        extensions.splice(extensions.indexOf(path), 1);
                        acr.setUserConfig("extensions", extensions);
                        process.action("reload-popup");
                    });
                }

            }

            break;


        // an option was activated
        case "option":
            const option = settingsData[data["tab"]]["options"][data["option"]];
            switch (option["type"]) {
                case "button":
                    option["click"](null);
                    break;
                case "select":
                case "textbox":
                    option["set"](id(`window-${windowID}-settings-option-${data["option"]}`).value);
                    break;
                case "checkbox":
                    option["set"](id(`window-${windowID}-settings-option-${data["option"]}`).checked);
                    break;
            }
            break;
    

        // "reload to see changes" popup
        case "reload-popup":
            acr.spawnPopup(
                "info",
                "The setting you changed needs a reload to have changes.",
                {
                    "Close": (process) => {
                        process.kill();
                    },
                    "Reload": () => {
                        window.location.reload();
                    }
                }
            );
            break;


    }

}