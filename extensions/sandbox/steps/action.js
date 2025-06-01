
function action(process, action, data) {

    let windowID = process.PID;

    switch (action) {

        case "dump": {
            const newProcess = new acr.Process("Variable dump", "sandbox", windowID);
            const dumpOutput = JSON.stringify(eval(`acr.${data["variable"]}`), null, 2);
            new acr.Window("Variable dump", `
                <b>Dump of ${data["variable"]}:</b>
                <pre class="apps-sandbox-dump-output">${dumpOutput}</pre>
            `, newProcess);
            break;
        }

        case "elements_test": {
            const newProcess = new acr.Process("Elements test", "sandbox", windowID);
            const newPID = newProcess.PID;
            new acr.Window("Elements test", `
                <div class="apps-sandbox-elements-box">
                    <div>
                        <h1>Heading 1</h1>
                        <h2>Heading 2</h2>
                        <h3>Heading 3</h3>
                        <h4>Heading 4</h4>
                        <h5>Heading 5</h5>
                        <h6>Heading 6</h6>
                    </div>
                    <div>
                        <section>
                            <span>Normal text</span>
                            <br>
                            <b>Bold</b>
                            <br>
                            <i>Italic</i>
                            <br>
                            <u>Underline</u>
                            <br>
                            <s>Strikethrough</s>
                        </section>
                        <section>
                            <code>Inline code</code>
                            <pre>Block of code</pre>
                        </section>
                        <section>
                            <a href="#">Link</a>
                        </section>
                        <section>
                            <button class="bflat">Flat button</button>
                            <br>
                            <button class="bfull">Full button</button>
                        </section>
                    </div>
                    <div>
                        <section>
                            <input type="text" class="textbox bflat" placeholder="Flat textbox"></input>
                            <br>
                            <input type="text" class="textbox bfull" placeholder="Full textbox"></input>
                        </section>
                        <section>
                            <input type="checkbox"> Checkbox
                            <br>
                            <input type="radio"> Radio
                        </section>
                        <section>
                            <input type="range">
                        </section>
                        <section>
                            <input type="color">
                        </section>
                        <section>
                            <input type="datetime-local">
                            <br>
                            <input type="date">
                            <br>
                            <input type="time">
                        </section>
                        <section>
                            <input type="file" class="textbox bflat">
                        </section>
                    </div>
                    <div>
                        <ul>
                            <li>List item 1</li>
                            <ul>
                                <li>List item 1.1</li>
                            </ul>
                            <li>List item 2</li>
                        </ul>
                        <ol>
                            <li>List item 1</li>
                            <ol>
                                <li>List item 1.1</li>
                            </ol>
                            <li>List item 2</li>
                        </ol>
                    </div>
                </div>
            `, newProcess, ["40em", "25em"]);

        }

    }

}