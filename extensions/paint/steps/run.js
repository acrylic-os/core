

// tool class

let currentTool;

class Tool{
    constructor(id, usesFill, usesBorder, mousedown, mousemove, mouseup) {
        this.id = id;
        this.name = acr.msg(`paint/tools/${id}`);
        this.usesFill = usesFill;
        this.usesBorder = usesBorder;
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
        <div class="app-paint-grid">
            <div>
                <div class="button-group horizontal" id="window-${windowID}-paint-tools"></div>
            </div>
            <div>
                <div class="button-group horizontal app-paint-undo-redo">
                    <button id="window-${windowID}-paint-undo">${acr.msg("paint/undo")}</button>
                    <button id="window-${windowID}-paint-redo">${acr.msg("paint/redo")}</button>
                </div>
            </div>
            <div class="app-paint-grid-2">
                <div class="app-paint-viewbox">
                    <canvas id="window-${windowID}-paint-canvas" class="app-paint-canvas"></canvas>
                </div>
            </div>
            <div class="app-paint-fill-border">
                <input type="checkbox" id="window-${windowID}-paint-fill-enabled" checked>
                <span class="app-paint-fill-border-label">${acr.msg("paint/fill")}</span>
                <span id="window-${windowID}-paint-fill-options">
                    <input type="color" id="window-${windowID}-paint-fill-color">
                </span>
            </div>
            <div class="app-paint-fill-border">
                <input type="checkbox" id="window-${windowID}-paint-border-enabled" checked>
                <span class="app-paint-fill-border-label">${acr.msg("paint/border")}</span>
                <span id="window-${windowID}-paint-border-options">
                    <input type="color" id="window-${windowID}-paint-border-color">
                    <input type="range" min="0" max="25" step="1" value="3" id="window-${windowID}-paint-width">
                </span>
            </div>
            <div class="app-paint-grid-2">
                Size: <span id="window-${windowID}-paint-size"></span>
            </div>
        </div>
    `, process);


    // variables

    let canvas = id(`window-${windowID}-paint-canvas`);
    let context, positionX, positionY;


    // initialize

    function initialize(event=null) {

        // set context
        context = canvas.getContext("2d", {"willReadFrequently": true});

        // set position
        if(event) {
            const canvasRect = canvas.getBoundingClientRect();
            positionX = event.clientX - canvasRect.left;
            positionY = event.clientY - canvasRect.top;
        }

    }
    initialize();


    // function to set canvas to image data

    function setCanvas(imageData, runWhenDone=() => {}) {
        createImageBitmap(imageData).then((imageBitmap) => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(imageBitmap, 0, 0);
            runWhenDone();
        });
    }


    // tools

    let painting, saved, oldX, oldY, strokeWidth, hasFill, hasBorder, fillColor, borderColor;

    const tools = {

        // pencil
        "pencil": new Tool(
            "pencil", false, true,
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
            "eraser", false, true,
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
        ),

        // rectangle
        "rectangle": new Tool(
            "rectangle", true, true,
            () => {
                painting = true;
                saved = context.getImageData(0, 0, canvas.width, canvas.height);
                oldX = positionX;
                oldY = positionY;
            },
            () => {
                if(painting) {
                    setCanvas(saved, () => {
                        if(hasFill) {
                            context.fillRect(oldX, oldY, positionX - oldX, positionY - oldY);
                        }
                        if(hasBorder) {
                            context.strokeRect(oldX, oldY, positionX - oldX, positionY - oldY);
                        }
                    });
                }
            },
            () => {
                setCanvas(saved, () => {
                    if(hasFill) {
                        context.fillRect(oldX, oldY, positionX - oldX, positionY - oldY);
                    }
                    if(hasBorder) {
                        context.strokeRect(oldX, oldY, positionX - oldX, positionY - oldY);
                    }
                    painting = false;
                });
            }
        )
        
    }


    // set tool and tool buttons

    function setTool(toolID) {

        // set current tool variable
        currentTool = tools[toolID];

        // manage tool options
        id(`window-${windowID}-paint-fill-enabled`).disabled = !currentTool.usesFill;
        if(!currentTool.usesFill) {
            id(`window-${windowID}-paint-fill-enabled`).checked = false;
        }
        id(`window-${windowID}-paint-fill-options`).style.display = currentTool.usesFill? "inline":"none";
        id(`window-${windowID}-paint-border-enabled`).disabled = !currentTool.usesBorder;
        if(!currentTool.usesBorder) {
            id(`window-${windowID}-paint-border-enabled`).checked = false;
        }
        id(`window-${windowID}-paint-border-options`).style.display = currentTool.usesBorder? "inline":"none";

        // update tool options
        setEnabled();
        setColors();
        setStrokeWidth();

    }

    for(const [toolID, tool] of Object.entries(tools)) {
        append(`window-${windowID}-paint-tools`, `
            <button id="window-${windowID}-paint-tools-${toolID}">${tool.name}</button>
        `);
        onclick(`window-${windowID}-paint-tools-${toolID}`, () => {
            setTool(toolID);
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
        process.storage.history.push(context.getImageData(0, 0, canvas.width, canvas.height));
        process.storage.historyPointer += 1;
    })


    // tool options

    function setEnabled() {
        hasFill = id(`window-${windowID}-paint-fill-enabled`).checked;
        hasBorder = id(`window-${windowID}-paint-border-enabled`).checked;
        id(`window-${windowID}-paint-fill-options`).style.display = hasFill? "inline":"none";
        id(`window-${windowID}-paint-border-options`).style.display = hasBorder? "inline":"none";
    };
    setEnabled();
    id(`window-${windowID}-paint-fill-enabled`).addEventListener("input", setEnabled);
    id(`window-${windowID}-paint-border-enabled`).addEventListener("input", setEnabled);
    
    function setColors() {
        fillColor = id(`window-${windowID}-paint-fill-color`).value;
        borderColor = id(`window-${windowID}-paint-border-color`).value;
        context.fillStyle = fillColor;
        context.strokeStyle = borderColor;
    }
    setColors();
    id(`window-${windowID}-paint-fill-color`).addEventListener("input", setColors);
    id(`window-${windowID}-paint-border-color`).addEventListener("input", setColors);

    function setStrokeWidth() {
        strokeWidth = id(`window-${windowID}-paint-width`).value;
        context.lineWidth = strokeWidth;
    }
    setStrokeWidth();
    id(`window-${windowID}-paint-width`).addEventListener("input", setStrokeWidth);


    // undo/redo

    const blankCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
    process.storage.history = [blankCanvas];
    process.storage.historyPointer = 0;

    onclick(`window-${windowID}-paint-undo`, () => {
        if(process.storage.historyPointer <= 0) {
            return;
        }
        process.storage.historyPointer -= 1;
        setCanvas(process.storage.history[process.storage.historyPointer]);
    });
    onclick(`window-${windowID}-paint-redo`, () => {
        if(process.storage.historyPointer >= process.storage.history.length - 1) {
            return;
        }
        process.storage.historyPointer += 1;
        setCanvas(process.storage.history[process.storage.historyPointer]);
    });


    // load new canvas and set to default tool

    process.action("new", {"width": 720, "height": 480});
    setTool("pencil");

}