
function updateClock(process) {

    let windowID = process.PID;
    
    const now = new Date();
    let hour, minute, second;

    switch(process.storage["clock"]) {


        case "analog":

            // get numbers
            hour = ((now.getHours() * 60) + now.getMinutes()) / 60;
            minute = ((now.getMinutes() * 60) + now.getSeconds()) / 60;
            second = now.getSeconds();
            hour = (((hour / 12) % 12) * 360) - 90;
            minute = (minute / 60 * 360) - 90;
            second = (second / 60 * 360) - 90;

            // move hands
            id(`window-${windowID}-clock-analog-hand-1`).style.transform = `rotate(${hour}deg)`;
            id(`window-${windowID}-clock-analog-hand-2`).style.transform = `rotate(${minute}deg)`;
            id(`window-${windowID}-clock-analog-hand-3`).style.transform = `rotate(${second}deg)`;

            break;


        case "digital":

            // get numbers
            hour = now.getHours().toString().padStart(2, "0");
            minute = now.getMinutes().toString().padStart(2, "0");
            second = now.getSeconds().toString().padStart(2, "0");

            // set numbers
            id(`window-${windowID}-clock-digital-text-1`).innerText = hour;
            id(`window-${windowID}-clock-digital-text-2`).innerText = minute;
            id(`window-${windowID}-clock-digital-text-3`).innerText = second;

            break;


    }
}