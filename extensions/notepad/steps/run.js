
function run(process) {

    let windowID = process.PID;

    // spawn window
    new acr.Window("Notepad", `
        <section>
            <button id="window-${windowID}-notepad-save" class="bflat">Save</button>
            <button id="window-${windowID}-notepad-open" class="bflat">Open</button>
        </section>
        <textarea class="apps-notepad-textarea" id="window-${windowID}-notepad-text"></textarea>
    `, process);

    // click buttons
    onclick(`window-${windowID}-notepad-save`, () => {
        process.action("save");
    });
    onclick(`window-${windowID}-notepad-open`, () => {
        process.action("open");
    });

    // immediately open a file if a path was given
    if("initial_open" in process.additionalData) {
        let openedText = process.additionalData.initial_open.read();
        id(`window-${windowID}-notepad-text`).value = openedText;
    }
    
}