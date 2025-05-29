
function action(process, action, data) {

    switch (action) {

        // show credits window
        case "credits":
            new acr.Window("Credits", `
                <h2>Main development</h2>
                <ul>
                    <li>
                        <b>Anpang54</b> (anpang.fun) - Literally everything
                    </li>
                </ul>
                <h2>Small elements</h2>
                <ul>
                    <li>
                        <b>patrickoliveras</b> - <a href="https://github.com/patrickoliveras/js-text-donut">Spinning donut</a>
                    </li>
                </ul>
                <h2>Wallpapers</h2>
                <ul>
                    <li>
                        <b>Anpang54</b> (anpang.fun) - <a href="https://wiki.anpang.fun/acr/Default_wallpaper">"Acrylic"</a>
                    </li>
                    <li>
                        <b>IdaT</b> - <a href="https://pixabay.com/photos/baltic-sea-sunset-poland-colours-7434540/">"Baltic sea"</a>
                    </li>
                    <li>
                        <b>Pexels</b> - <a href="https://pixabay.com/photos/cosmos-milky-way-night-sky-stars-1853491/">"Cosmos"</a>
                    </li>
                </ul>
            `, new acr.Process("Credits", "about"));
            break;

        // show donut window
        case "donut":
            let newProcess = new acr.Process("Donut", "about");
            new acr.Window("Donut", `
                <pre class="apps-about-donut" id="window-${newProcess.PID}-about-donut"></pre>
            `, newProcess);
            showSpinningDonut(id(`window-${newProcess.PID}-about-donut`));
            ++activeDonuts;
            break;

    }

}