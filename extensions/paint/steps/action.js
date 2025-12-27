
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {

        // make a new file
        case "new":
            id(`window-${windowID}-paint-canvas`).style.width = acr.msg("paint/px", [data.width]);
            id(`window-${windowID}-paint-canvas`).style.height = acr.msg("paint/px", [data.height]);
            id(`window-${windowID}-paint-canvas`).width = data.width;
            id(`window-${windowID}-paint-canvas`).height = data.height;
            const megapixels = (data.width * data.height) / 1000000;
            id(`window-${windowID}-paint-size`).innerText = `${acr.msg("paint/dimensions", [data.width, data.height])} (${acr.msg("paint/mp", [megapixels])})`;

    }

}