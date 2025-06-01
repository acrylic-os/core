
function action(process, action, data) {

    switch (action) {

        case "reset":
            id(`window-${process.PID}-terminal-result`).innerHTML = process.storage.initialTerminalText;
            break;

        case "select":
            id(`window-${process.PID}-terminal-input`).focus();
            break;

        case "run_command":

            // functions
            const terminalRC = `
                function clear() {
                    acr.processes[${process.PID}].action("reset");
                }
                function exit() {
                    acr.processes[${process.PID}].kill();
                }
                function help() {
                    return "<b>Help</b><br>This is a JS console, so you can simply run JS commands.<br>Functions include clear(), exit(), help(), and print().";
                }
                function print(text) {
                    return text;
                }
            `;

            // get command and clear input box
            const command = id(`window-${process.PID}-terminal-input`).value;
            id(`window-${process.PID}-terminal-input`).value = "";

            // run command
            let result, prefix;
            try{
                result = eval(`${terminalRC}${command}`);
                prefix = "<";
            } catch(error) {
                result = error;
                prefix = "!";
            }

            // print result
            id(`window-${process.PID}-terminal-result`).innerHTML += `<br>&gt; ${command}<br>${prefix} ${result}<br>`;

            break;

    }

}