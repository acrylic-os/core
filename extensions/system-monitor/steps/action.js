
function action(process, action, data) {

    switch (action) {
        case "kill_process":
            acr.processes[data["pid"]].kill();
            break;
    }

}