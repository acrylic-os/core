
function run(process) {
    
    let windowID = process.PID;

    new acr.Window("About", `
        <div class="apps-about-grid">
            <div class="apps-about-grid-logo">
                <img src="assets/acrylic_logo.svg" class="apps-about-logo">
            </div>
            <div class="apps-about-grid-title">
                <h2>Acrylic (acrylicOS)</h2>
                <b>Version ${acr.version}</b>
                <a href="https://en.wiktionary.org/wiki/Reconstruction:Proto-Indo-European/${acr.codenamePage}" target="_blank" class="apps-about-codename">
                    "${acr.codename}"
                </a>
                <br>
                (${acr.versionDate})
            </div>
            <div class="apps-about-grid-useragent">
                <b>User agent:</b>
                <br>
                ${window.navigator.userAgent}
            </div>
            <div class="apps-about-grid-copyright">
                <section>
                    <button class="bflat" id="window-about-${windowID}-credits">Credits</button>
                    <button class="bflat" id="window-about-${windowID}-donut">Donut</button>
                </section>
                <section>
                    &copy; 2024 - 2025 Anpang54
                </section>
            </div>
        </div>
    `, process, ["500px", "400px"]);

    onclick(`window-about-${windowID}-credits`, () => {
        process.action("credits");
    });
    onclick(`window-about-${windowID}-donut`, () => {
        process.action("donut");
    });

}