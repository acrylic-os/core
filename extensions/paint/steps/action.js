
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {

        // make a new file
        case "new":
            id(`window-${windowID}-paint-canvas`).style.width = `${data.width}px`;
            id(`window-${windowID}-paint-canvas`).style.height = `${data.height}px`;
            id(`window-${windowID}-paint-canvas`).width = data.width;
            id(`window-${windowID}-paint-canvas`).height = data.height;
            const megapixels = (data.width * data.height) / 1000000;
            id(`window-${windowID}-paint-size`).innerText = `${data.width}x${data.height} (${megapixels}mp)`;

    }

}