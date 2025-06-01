
const typeDisplayNames = {
    "none": "Hidden",
    "gui": "Graphical",
    "term": "Terminal"
};

function run(process) {

    let windowID = process.PID;

    new acr.Window("System Monitor", `
        <span id="window-${windowID}-live" class="apps-system-monitor-live">Live</span>
        <h2>Processes</h2>
        <table id="window-${windowID}-process-table"></table>
    `, process);

    updateTable(process);
    acr.processes[windowID].storage["interval"] = setInterval(() => {
        updateTable(process);
    }, 500);

}

function updateTable(process) {

    let windowID = process.PID;

    // make initial table
    id(`window-${windowID}-process-table`).innerHTML = `
        <thead>
            <tr>
                <th>PID</th>
                <th>Process</th>
                <th>Name</th>
                <th>Type</th>
                <th>Options</th>
            </tr>
        </thead>
        <tbody id="window-${windowID}-process-table-body"></tbody>
    `;

    // make entries
    for (const [PID, processInfo] of Object.entries(acr.processes)) {
        append(`window-${windowID}-process-table-body`, `
            <tr>
                <td>${PID}</td>
                <td>${processInfo["app"]}</td>
                <td>${processInfo["name"]}</td>
                <td>${typeDisplayNames[processInfo["type"]]}</td>
                <td class="apps-system-monitor-kill-td">
                    <button class="bflat" id="window-${process.PID}-kill-${PID}">
                        Kill
                    </button>
                </td>
            </tr>
        `);
        onclick(`window-${process.PID}-kill-${PID}`, () => {
            process.action("kill_process", {"pid": PID});
        });
    }

    // update "Live" indicator
    id(`window-${windowID}-live`).style.display =
        (id(`window-${windowID}-live`).style.display === "none") ? "block" : "none";

}