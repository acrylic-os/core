
function run(process) {

    // show initial window
    new acr.Window(acr.msg("sandbox/name"), `
        <h2>${acr.msg("sandbox/name")}</h2>
        <section>
            ${acr.msg("sandbox/intro")}
        </section>
        <section>
            <b>${acr.msg("sandbox/dump")}</b>
            <div id="window-${process.PID}-dump-variables"></div>
        </section>
        <section>
            <b>${acr.msg("sandbox/miscellaneous")}</b>
            <br>
            <button id="window-${process.PID}-button-test" class="bflat">
                ${acr.msg("sandbox/elements-test")}
            </button>
        </section>
    `, process);
    
    // show dump buttons
    const dumpButtons = ["apps", "processes"];
    for(const variable of dumpButtons) {
        append(`window-${process.PID}-dump-variables`, `
            <button class="bflat" id="window-${process.PID}-dump-variables-${variable}">${variable}</button>
        `);
        onclick(`window-${process.PID}-dump-variables-${variable}`, () => {
            process.action("dump", {"variable": variable});
        });
    }

    // elements test click
    onclick(`window-${process.PID}-button-test`, () => {
        process.action("elements_test");
    });

}