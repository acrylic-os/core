

// tool class

let currentTool;

class Tool{
    constructor(id, name, affectedByWidth, mousedown, mousemove, mouseup) {
        this.id = id;
        this.name = name;
        this.affectedByWidth = affectedByWidth;
        this.mousedown = mousedown;
        this.mousemove = mousemove;
        this.mouseup = mouseup;
    }
}


// run

function run(process) {

    let windowID = process.PID;

    // put window
    new acr.Window("Paint", `
        <section>
            <div class="button-group horizontal" id="window-${windowID}-paint-tools"></div>
        </section>
        <section>
            <canvas id="window-${windowID}-paint-canvas" class="app-paint-canvas"></canvas>
        </section>
        <section>
            Stroke width: <input type="range" min="0" max="25" step="1" value="3" id="window-${windowID}-paint-width">
        </section>
    `, process);

    // variables
    let canvas = id(`window-${windowID}-paint-canvas`);
    let context, positionX, positionY;

    // initialize
    function initialize(event=null) {

        // set context
        context = canvas.getContext("2d");

        // set position
        if(event) {
            const canvasRect = canvas.getBoundingClientRect();
            positionX = event.clientX - canvasRect.left;
            positionY = event.clientY - canvasRect.top;
        }

    }
    initialize();

    // tools
    let painting, strokeWidth;
    const tools = {

        // pencil
        "pencil": new Tool(
            "pencil", "Pencil", false,
            () => {
                painting = true;
                context.beginPath();
                context.moveTo(positionX, positionY);
            },
            () => {
                if(painting) {
                    context.lineTo(positionX, positionY);
                    context.stroke();
                }
            },
            () => {
                if(painting) {
                    painting = false;
                }
            }
        ),

        // eraser
        "eraser": new Tool(
            "eraser", "Eraser", false,
            () => {
                painting = true;
            },
            () => {
                if(painting) {
                    context.clearRect(
                        positionX - (strokeWidth / 2), positionY - (strokeWidth / 2),
                        strokeWidth, strokeWidth
                    );
                }
            },
            () => {
                if(painting) {
                    painting = false;
                }
            }
        )
        
    }

    // make tool buttons
    for(const [toolID, tool] of Object.entries(tools)) {
        append(`window-${windowID}-paint-tools`, `
            <button id="window-${windowID}-paint-tools-${toolID}">${tool.name}</button>
        `);
        onclick(`window-${windowID}-paint-tools-${toolID}`, () => {
            currentTool = tools[toolID];
        });
    }

    // mousedown, mousemove, moseup
    canvas.addEventListener("mousedown", (event) => {
        initialize(event);
        currentTool.mousedown();
    });
    canvas.addEventListener("mousemove", (event) => {
        initialize(event);
        currentTool.mousemove();
    });
    canvas.addEventListener("mouseup", (event) => {
        initialize(event);
        currentTool.mouseup();
    })

    // change stroke width
    function setStrokeWidth() {
        strokeWidth = id(`window-${windowID}-paint-width`).value;
        context.lineWidth = strokeWidth;
    }
    setStrokeWidth();
    id(`window-${windowID}-paint-width`).addEventListener("input", setStrokeWidth);

    // set to default tool
    currentTool = tools["pencil"];

}