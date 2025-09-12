
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {

        case "update":

            const stuckToBottom =
                id(`window-${windowID}-logs-content`).scrollTop === (id(`window-${windowID}-logs-content`).scrollHeight - id(`window-${windowID}-logs-content`).offsetHeight);

            // format logs
            let logs = "";
            for(const log of acr.logs) {
                logs += `<span style="color: ${log[1]}">${log[0].replace("%c", "")}</span><br>`;
            }

            // put logs
            id(`window-${windowID}-logs-content`).innerHTML = logs;

            // stick to the bottom
            if(stuckToBottom) {
                id(`window-${windowID}-logs-content`).scrollTop = id(`window-${windowID}-logs-content`).scrollHeight;
            }

            break;

    }

}