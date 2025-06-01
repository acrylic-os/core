
const calculatorButtons = [
    "(", ")", "&pi;", "e", "&phi;", "", "AC",
    "[", "]", "log", "", "", "", "&div;",
    "{", "}", "&Sqrt;", "7", "8", "9", "&times;",
    "sin", "", "^", "4", "5", "6", "-",
    "cos", "<sup>3</sup>", "<sup>2</sup>", "1", "2", "3", "+",
    "tan", "", "&frasl;", "0", ".", "="
];

function run(process) {
    
    let windowID = process.PID;

    // make window
    new acr.Window("Calculator", `
        <div class="app-calculator-grid app-calculator-grid-history-hidden" id="window-${windowID}-calculator-grid">
            <div class="app-calculator-bases">
                <div>
                    bin <span id="window-${windowID}-calculator-bases-bin"></span>
                </div>
                <div>
                    oct <span id="window-${windowID}-calculator-bases-oct"></span>
                </div>
                <div>
                    dec
                </div>
                <div>
                    hex <span id="window-${windowID}-calculator-bases-hex"></span>
                </div>
            </div>
            <div class="app-calculator-history" id="window-${windowID}-calculator-history">
                <h2>History</h2>
                Coming soon!
            </div>
            <div class="app-calculator-number">
                <span class="app-calculator-equation" id="window-${windowID}-calculator-equation"></span>
                <span class="app-calculator-result" id="window-${windowID}-calculator-result"></span>
            </div>
            <div class="app-calculator-options">
                <div class="app-calculator-options-types">
                    Coming soon!
                </div>
                <div class="app-calculator-options-history-toggle">
                    <button id="window-${windowID}-calculator-toggle" class="bflat">History</button>
                </div>
            </div>
            <div class="app-calculator-buttons" id="window-${windowID}-calculator-buttons"></div>
        </div>
    `, process);

    // toggle history button
    onclick(`window-${windowID}-calculator-toggle`, () => {
        process.action(windowID, "toggle_history");
    });

    // generate actual buttons
    for (const button of calculatorButtons) {

        const buttonID = button.charAt(0) === "&" && button.slice(-1) === ";" ? button.slice(1, -1) : button;
        // if it was a complete html entity then it'd get parsed

        append(`window-${windowID}-calculator-buttons`, `
            <a
                href="#"
                id="window-${windowID}-calculator-button-${buttonID}"
                class="app-calculator-button ${button === "=" ? "app-calculator-button-equals" : ""}"
            >
                ${button}
            </a>
        `);
        onclick(`window-${windowID}-calculator-button-${buttonID}`, () => {
            process.action("button_press", { "button": button, "buttonID": buttonID });
        });

    }

    // set storage
    process.storage = {
        "equation": "",
        "replace_equation_next": false,
        "history_shown": false
    };

}