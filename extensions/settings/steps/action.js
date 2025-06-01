
function action(process, action, data) {

    let windowID = process.PID;

    switch (action) {

        // the user switched the tab
        case "switch_tab":

            // render tab
            let optionsDisplay = "";
            let attr_id, attr_action, selected, eventListenersToPut;
            const tab = data["tab"];
            for (const [optionID, optionData] of Object.entries(settingsData[tab]["options"])) {

                optionsDisplay += "<fieldset>";

                // id and on(something) attributes
                attr_id = `window-${windowID}-settings-option-${optionID}`;
                attr_action = function (tab, optionID) {
                    process.action("option", {'tab': tab, 'option': optionID})
                }.bind(null, tab, optionID);
                eventListenersToPut = {}

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
                        eventListenersToPut[optionID] = attr_action;
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
                                <select id="${attr_id}" onchange="${attr_action}">
                                    ${selectOptions}
                                </select>
                            `;
                        break;
                    case "checkbox":
                        optionsDisplay += `
                        <legend>${optionData["name"]}</legend>
                        <input type="checkbox" id="${attr_id}" ${selected ? "checked" : ""}>
                        <span>${optionData["name"]}</span>
                        <span class="subtitle">${optionData["subtitle"]}</span>
                    `;
                        eventListenersToPut[optionID] = attr_action;
                        break;
                }

                optionsDisplay += "</fieldset>";

            }

            // set content
            id(`window-${windowID}-settings-content`).innerHTML = optionsDisplay;

            // put event listeners
            for (const [option, listener] of Object.entries(eventListenersToPut)) {
                id(`window-${windowID}-settings-option-${option}`).addEventListener("click", listener);
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
                    option["set"](id(`window-${windowID}-settings-option-${data["option"]}`).value);
                    break;
                case "checkbox":
                    option["set"](id(`window-${windowID}-settings-option-${data["option"]}`).checked);
                    break;
            }
            break;
    
    }

}