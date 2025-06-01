
function run(process) {

    // show initial window
    new acr.Window("Sandbox", `
        <h2>Sandbox</h2>
        <section>
            Welcome to the Acrylic Sandbox, a place where things can be tested.
            <br>
            There are a few tools here.
        </section>
        <section>
            <b>Dump variables</b>
            <div id="window-${process.PID}-dump-variables"></div>
        </section>
        <section>
            <b>Miscellaneous tools</b>
            <br>
            <button id="window-${process.PID}-button-test" class="bflat">
                Elements test
            </button>
        </section>
    `, process);
    
    // show dump buttons
    const dumpButtons = ["apps", "processes", "files", "config"];
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