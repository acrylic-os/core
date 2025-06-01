
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {

        case "button_press": {

            if (process.storage["replace_equation_next"]) {
                if (data["buttonID"] === "=") {
                    return;
                } else {
                    id(`window-${windowID}-calculator-equation`).innerText = "";
                    process.storage["replace_equation_next"] = false;
                }
            }

            switch (data["buttonID"]) {

                case "AC":
                    process.storage["equation"] = "";
                    id(`window-${windowID}-calculator-equation`).innerText = "";
                    id(`window-${windowID}-calculator-result`).innerText = "";
                    id(`window-${windowID}-calculator-bases-bin`).innerText = "";
                    id(`window-${windowID}-calculator-bases-oct`).innerText = "";
                    id(`window-${windowID}-calculator-bases-hex`).innerText = "";
                    break;

                case "=":

                    const replacements = {
                        "times": "*", "div": "/", "frasl": "/",
                        "^": "**", "<sup>2</sup>": "** 2", "<sup>3</sup>": "** 3",
                        "Sqrt": "Math.sqrt", "log": "Math.log",
                        "[": "(", "]": ")", "{": "(", "}": ")",
                        "pi": "Math.PI", "e": "Math.E", "phi": "((1 + Math.sqrt(5)) / 2)",
                        "sin": "Math.sin", "cos": "Math.cos", "tan": "Math.tan"
                    };

                    let equation = process.storage["equation"];
                    for (const [from, to] of Object.entries(replacements)) {
                        equation = equation.replaceAll(from, to);
                    }
                    let result;
                    try {
                        result = parseFloat(eval(equation));
                    } catch (error) {
                        result = "Syntax error";
                    }

                    id(`window-${windowID}-calculator-result`).innerText = result.toString(10);
                    if (result === "Syntax error") {
                        id(`window-${windowID}-calculator-bases-bin`).innerText = "";
                        id(`window-${windowID}-calculator-bases-oct`).innerText = "";
                        id(`window-${windowID}-calculator-bases-hex`).innerText = "";
                    } else {
                        id(`window-${windowID}-calculator-bases-bin`).innerText = result.toString(2);
                        id(`window-${windowID}-calculator-bases-oct`).innerText = result.toString(8);
                        id(`window-${windowID}-calculator-bases-hex`).innerText = result.toString(16);
                    }

                    process.storage["equation"] = "";
                    process.storage["replace_equation_next"] = true;

                    break;

                case "Sqrt":
                case "log":
                case "sin":
                case "cos":
                case "tan":
                    process.storage["equation"] += `${data["buttonID"]}(`;
                    id(`window-${windowID}-calculator-equation`).innerHTML += `${data["button"]}(`;
                    break;

                default:
                    process.storage["equation"] += data["buttonID"];
                    id(`window-${windowID}-calculator-equation`).innerHTML += data["button"];

            }
        
            break;

        }

        case "toggle_history": {

            if (process.storage["history_shown"]) {
                // hide history
                id(`window-${windowID}-calculator-history`).style.display = "none";
                id(`window-${windowID}-calculator-grid`).classList.remove("app-calculator-grid-history-shown");
                id(`window-${windowID}-calculator-grid`).classList.add("app-calculator-grid-history-hidden");
                process.storage["history_shown"] = false;
            } else {
                // show history
                id(`window-${windowID}-calculator-history`).style.display = "block";
                id(`window-${windowID}-calculator-grid`).classList.remove("app-calculator-grid-history-hidden");
                id(`window-${windowID}-calculator-grid`).classList.add("app-calculator-grid-history-shown");
                process.storage["history_shown"] = true;
            }

            break;

        }

    }
}