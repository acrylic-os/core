
function action(process, action, data) {

    switch (action) {

        // show credits window
        case "credits":
            new acr.Window("Credits", `
                <h2>${acr.msg("about/main-dev")}</h2>
                <ul>
                    <li>
                        <b>Anpang54</b> (anpang.lol) - ${acr.msg("about/literally-everything")}
                    </li>
                </ul>
                <h2>${acr.msg("about/small-elements")}</h2>
                <ul>
                    <li>
                        <b>patrickoliveras</b> - <a href="https://github.com/patrickoliveras/js-text-donut">${acr.msg("about/spinning-donut")}</a>
                    </li>
                </ul>
                <h2>${acr.msg("about/wallpapers")}</h2>
                <ul>
                    <li>
                        <b>Anpang54</b> (anpang.lol) - <a href="https://wiki.anpang.lol/acr/Default_wallpaper">"Acrylic"</a>
                    </li>
                    <li>
                        <b>Chensiyuan</b> - <a href="https://commons.wikimedia.org/wiki/File:1_rocinha_night_2014_panorama.jpg">"Rocinha"</a> (CC BY-SA 3.0)
                    </li>
                    <li>
                        <b>IdaT</b> - <a href="https://pixabay.com/photos/baltic-sea-sunset-poland-colours-7434540/">"Baltic sea"</a> (Pixabay License)
                    </li>
                    <li>
                        <b>Pexels</b> - <a href="https://pixabay.com/photos/cosmos-milky-way-night-sky-stars-1853491/">"Cosmos"</a> (Pixabay License)
                    </li>
                </ul>
            `, new acr.Process("Credits", "about"));
            break;

        // show donut window
        case "donut":

            const exitTexts = acr.msg("about/exit-texts");
            const exitText = exitTexts[Math.floor(Math.random() * exitTexts.length)];

            let newProcess = new acr.Process("Donut", "about");
            new acr.Window("Donut", `
                <pre class="apps-about-donut" id="window-${newProcess.PID}-about-donut"></pre>
                <div class="apps-about-donut-exit-box">
                    <button id="window-${newProcess.PID}-about-donut-exit">${acr.msg("about/exit-text-format", [exitText])}</button>
                </div>
            `, newProcess);

            onclick(`window-${newProcess.PID}-about-donut-exit`, () => {
                acr.processes[newProcess.PID].kill();
            });
            showSpinningDonut(id(`window-${newProcess.PID}-about-donut`));

            break;

    }

}

function showSpinningDonut(element) {

    const canvas = element;

    const canvasWidth = 80;
    const canvasHeight = 24;
    const canvasArea = canvasHeight * canvasWidth;
    const yOffset = 12;
    const xOffset = 40;
    const innerRadius = 2;
    const r1Points = 90; // 90
    const r2Points = 314; // 314
    const fov = 5;

    const what = 30;

    let A = 0;
    let B = 0;

    let shades = '.,-~:;=!*#$@'.split('');

    // buffers
    let b, z;

    const tau = 2 * Math.PI;

    setInterval(() => {
        b = Array(canvasArea).fill(' '); //
        z = Array(7040).fill(0); // z-buffer set to z^-1

        for (let j = 0; j < tau; j += tau / r1Points) {
            for (let i = 0; i < tau; i += tau / r2Points) {
                let c = Math.sin(i);
                let d = Math.cos(j);
                let e = Math.sin(A);
                let f = Math.sin(j);
                let g = Math.cos(A);

                let h = d + innerRadius;

                let D = 1 / (c * h * e + f * g + fov);

                let l = Math.cos(i);
                let m = Math.cos(B);
                let n = Math.sin(B);
                let t = c * h * g - f * e;

                let x = (xOffset + what * D * (l * h * m - t * n)) << 0;
                let y = (yOffset + (what / 2) * D * (l * h * n + t * m)) << 0;
                let o = (x + canvasWidth * y) << 0;
                let shadeConstant = (((shades.length + 1) * 2) / 3) << 0;
                let N =
                    (shadeConstant *
                        ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n)) <<
                    0;

                if (canvasHeight > y && y > 0 && x > 0 && canvasWidth > x && D > z[o]) {
                    z[o] = D;
                    b[o] = shades[N > 0 ? N : 0];
                }
            }
        }

        canvas.innerHTML = '';
        let line = [];

        for (let k = 0; k < canvasArea + 1; k++) {
            if (k % canvasWidth) {
                line.push(b[k]);
            } else {
                canvas.innerHTML += line.join("") + "<br>";
                line = [];
            }

            A += 0.00004;
            B += 0.00002;
        }
    }, 30);
}