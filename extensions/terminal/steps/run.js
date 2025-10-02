
function run(process) {

    let windowID = process.PID;

    new acr.Window("Terminal", `
        <div class="apps-terminal-box">
            <div id="window-${windowID}-terminal-result" class="apps-terminal-result"></div>
            <div class="apps-terminal-input-outer">
                <label for="window-${windowID}-terminal-input">Input command</label>
                &gt; <input class="apps-terminal-input" id="window-${windowID}-terminal-input"></input> 
            </div>
        </div>
    `, process);
    onclick(`window-${windowID}-terminal-result`, () => {
        process.action("select");
    });

    process.storage.initialTerminalText = `
        <br>
        &nbsp;&nbsp;<b>Acrylic v${acr.version}</b>
        <br>
        &nbsp;&nbsp;Run "help()" for help
        <br>
    `;
    id(`window-${windowID}-terminal-result`).innerHTML = process.storage.initialTerminalText;

    process.action(windowID, "reset");
    process.action(windowID, "select");
    id(`window-${windowID}-terminal-input`).addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            process.action("run_command");
        }
    });

}