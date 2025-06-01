
function kill(process) {
    
    let windowID = process.PID;

    clearInterval(acr.processes[windowID].storage["interval"]);

}