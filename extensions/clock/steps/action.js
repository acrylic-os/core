
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {

        case "analog":
            process.storage["clock"] = "analog";
            updateClock(process);
            id(`window-${windowID}-clock-analog`).style.display = "block";
            id(`window-${windowID}-clock-digital`).style.display = "none";
            break;
        
        case "digital":
            process.storage["clock"] = "digital";
            updateClock(process);
            id(`window-${windowID}-clock-digital`).style.display = "block";
            id(`window-${windowID}-clock-analog`).style.display = "none";
            break;

    }

}