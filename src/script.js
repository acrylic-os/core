"use strict";
/*
    Acrylic is (c) Anpang 2024 - 2025
    https://github.com/acrylic-os/core
*/

let acr = new function() {

    this.version = "0.2.0-b14";
    this.versionDate = "24 Apr 2025";

    //region ━━━━━━━━━━━━━━━    FUNCTIONS/CONSTANTS   ━━━━━━━━━━━━━━━

    //region ──────────      DOM shorthand functions       ──────────

        function id(name) {
            return document.getElementById(name);
        }
        function onclick(id, action) {
            document.getElementById(id).addEventListener("click", action);
        }
        function append(id, html) {
            document.getElementById(id).insertAdjacentHTML("beforeend", html);
        }

    //endregion

    //region ──────────          other functions           ──────────

        function pad(number, length) {
            return String(number).padStart(length, "0");
        }

        function randomFloat(min, max) {
            return Math.random() * (max - min) + min;
        }
        function randomInt(min, max) {
            return Math.floor(randomFloat(min, max));
        }

        function damerauLevenshtein(source, target, returnWhat) {

            if(!source) {
                return target ? target.length : 0;
            }
            else if (!target) {
                return source.length;
            }

            let m = source.length, n = target.length, INF = m+n;
            let score = new Array(m + 2)
            let sd = {};
            for(let i = 0; i < m + 2; ++i) {
                score[i] = new Array(n + 2);
            }
            score[0][0] = INF;
            for (let i = 0; i <= m; ++i) {
                score[i + 1][1] = i;
                score[i + 1][0] = INF;
                sd[source[i]] = 0;
            }
            for (let j = 0; j <= n; ++j) {
                score[1][j + 1] = j;
                score[0][j + 1] = INF;
                sd[target[j]] = 0;
            }

            for (let i = 1; i <= m; ++i) {
                let DB = 0;
                for (let j = 1; j <= n; ++j) {
                    let i1 = sd[target[j - 1]], j1 = DB;
                    if (source[i - 1] === target[j - 1]) {
                        score[i + 1][j + 1] = score[i][j];
                        DB = j;
                    } else {
                        score[i + 1][j + 1] = Math.min(score[i][j], score[i + 1][j], score[i][j + 1]) + 1;
                    }
                    score[i + 1][j + 1] = Math.min(score[i + 1][j + 1], score[i1] ? score[i1][j1] + (i - i1 -1) + 1 + (j - j1 - 1): Infinity);
                }
                sd[source[i - 1]] = i;
            }

            switch(returnWhat) {
                case "distance":
                    return score[m + 1][n + 1];
                case "ratio":
                    return (source.length + target.length - score[m - 1][n - 1]) / (source.length + target.length);
            }

        }
        // based on https://gist.github.com/IceCreamYou/8396172 and https://gist.github.com/croneter/19d9ffb8e41dd4584465128b49485dcf

    //endregion

    //region ──────────               other                ──────────

        const dayNames = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];
        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];

    //endregion

    //region ──────────           basic classes            ──────────

        class Vector2{
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
        }
        class Vector3{
            constructor(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
        }

    //endregion

    //region ──────────             mouse down             ──────────

        let mouseDown = false;

        document.body.addEventListener("mousedown", () => {
            mouseDown = true;
        });
        document.body.addEventListener("mouseup", () => {
            mouseDown = false;
        });

    //endregion

    //endregion

    //region ━━━━━━━━━━━━━━━           BOOT           ━━━━━━━━━━━━━━━

    //region ──────────              logging               ──────────

    this.logs = [];
    let startTime = window.performance.now();

    // print an initial piece of text into the JS console
    function initializeLogging() {
        const plainText = `Acrylic ${acr.version}`;
        let coloredText = "\n";
        let coloredStyles = [];
        for(let i = 0; i < plainText.length; ++i) {
            coloredText += `%c${plainText.charAt(i)}`;
            coloredStyles.push(`color: ${randomAcrylicColor()}; font-size: 1.5em; font-weight: bold`);
        }
        coloredText += "\n%cHi there! This is where Acrylic will log stuff. You can also run JS commands here.%c\n\n";
        coloredStyles.push("margin-top: 0.5em", "");
        console.log(coloredText, ...coloredStyles);
    }

    this.log = function(type, text, zeroTime = false) {
        let time;
        if(zeroTime) {    // first log, so use 0
            time = (0).toFixed(6);
        } else {    // not the first log, so use the actual time
            time = ((window.performance.now() / 1000) - (startTime / 1000)).toFixed(6);
        }
        const logContent = `[${time}] [${type}] ${text}`;
        acr.logs.push(logContent);
        console.log(logContent);
    }

    //endregion

    //region ──────────           boot function            ──────────

    let booting = true;

    this.boot = () => {

        // initialize logs
        initializeLogging();
        this.log("info", "Started booting", true);

        // show bootscreen
        showBootScreen();

    }

    // the actual things that need to be run on boot
    function runBoot() {

        acr.log("info", "Started runBoot()");

        // spawn acrylic core process
        new acr.Process("Acrylic core", "acrylic");

        // get data in localStorage
        if (!localStorage.hasOwnProperty("config")) {
            localStorage.setItem("config", JSON.stringify({
                "setup": false
            }));
        }
        config = JSON.parse(localStorage.getItem("config"));
        if (!localStorage.hasOwnProperty("files")) {
            localStorage.setItem("files", JSON.stringify({
                "acrylic": {},
                "apps": {},
                "users": {}
            }));
        }
        files = JSON.parse(localStorage.getItem("files"));

        // add error handler
        addJSErrorHandler();

        // bind quit buttons
        onclick("quit-areyousure-button", continueQuit);
        onclick("quit-areyousure-cancel", cancelQuit);

        // hide bootscreen
        hideBootScreen();

        acr.log("info", "Finished runBoot()");

    }

    //endregion

    //region ──────────          other functions           ──────────

        // save config and files to localStorage
        function saveData() {
            localStorage.setItem("config", JSON.stringify(config));
            localStorage.setItem("files", JSON.stringify(files));
        }

        // generate a random acrylic-themed color (used in the bootscreen and initial log message)
        function randomAcrylicColor() {
            return `hsl(${randomFloat(40, 280)}deg 100% ${randomFloat(60, 90)}%)`
        }

    //endregion

    //region ──────────             bootscreen             ──────────

        function showBootScreen() {

            id("bootscreen").style.filter = "opacity(0)";
            id("bootscreen").style.display = "block";

            // set version
            id("version-number").innerText = acr.version;
            id("version-date").innerText = acr.versionDate;
            document.title = `Acrylic v${acr.version}`;

            // show title and text
            let counter = 0;
            let interval = setInterval(() => {
                id("bootscreen").style.filter = `opacity(${counter / 100})`;
                ++counter;
                if (counter > 100) {
                    clearInterval(interval);
                    colorBootScreen();
                }
            }, 15);

        }

        function colorBootScreen() {
            let counter = 0;
            let interval = setInterval(() => {
                id("bootscreen-title").children[counter].style.color = randomAcrylicColor();
                ++counter;
                if (counter === 9) {
                    clearInterval(interval);
                    runBoot();
                }
            }, 30);
        }

        function hideBootScreen() {
            let counter = 100;
            let interval = setInterval(() => {
                id("bootscreen").style.filter = `opacity(${counter / 100})`;
                --counter;
                if (counter < 0) {
                    clearInterval(interval);
                    id("bootscreen").style.display = "none";

                    // no longer booting
                    booting = false;

                    // start setup if no data exists, login if data exists
                    if (config["setup"]) {
                        acr.log("info", "Finished boot, showing login screen");
                        showLoginScreen();
                    } else {
                        acr.log("info", "Finished boot, showing setup screen");
                        showSetup();
                    }

                }
            }, 10);

        }

    //endregion

    //endregion

    //region ━━━━━━━━━━━━━━━    FILESYSTEM/CONFIGS    ━━━━━━━━━━━━━━━

    //region ──────────               files                ──────────

    let files = {};

    //endregion

    //region ──────────              configs               ──────────

        let config = {};

        // wallpapers
        const defaultWallpapers = [
            "assets/wallpapers/acrylic.png",
            "assets/wallpapers/baltic_sea.jpg",
            "assets/wallpapers/cosmos.jpg"
        ];
        const noUserWallpaper = defaultWallpapers[0];
        // wallpaper used when there's no user (setup, login, etc.)

        const defaultUserConfigs = {

            // time
            "time_format": 0,

            // customization
            "wallpaper": noUserWallpaper,
            "click_confetti": false,
            "transparent_topbar": false

        };

        function getGlobalConfig(configName) {
            try {
                const configValue = config[configName];
                if (configValue === undefined) {
                    return defaultUserConfigs[configName];
                }
                return configValue;
            } catch (error) {
                return defaultUserConfigs[configName];
            }
        }

        function setGlobalConfig(configName, newValue) {
            config[configName] = newValue;
            saveData();
        }

        function getUserConfig(configName) {
            try {
                const configValue = config["users"][user][configName];
                if (configValue === undefined) {
                    return defaultUserConfigs[configName];
                }
                return configValue;
            } catch (error) {
                return defaultUserConfigs[configName];
            }
        }

        function setUserConfig(configName, newValue) {
            config["users"][user][configName] = newValue;
            saveData();
        }

    //endregion

    //endregion

    //region ━━━━━━━━━━━━━━━      PROCESSES/APPS      ━━━━━━━━━━━━━━━

    //region ──────────         process management         ──────────

        let currentPID = -1;
        this.processes = {};

        this.Process = class{

            // create a new process
            constructor(name, app, parent = null, type = null, additionalData = null) {

                // set values
                this.name = name;
                this.app = app;
                this.parent = parent;
                this.type = type? type: acr.apps[app]["type"];
                this.additionalData = additionalData ? additionalData : {};
                this.storage = {};

                // increment and set PID
                ++currentPID;
                this.PID = currentPID;

                // add to processes
                acr.processes[currentPID] = this;

            }

            // run an app action
            action(action, data) {
                acr.apps[this.app].action(this, action, data);
            }

            // kill the process
            kill() {

                // check if killing the core process
                if(this.PID === 0) {
                    quit("kill_core_process");
                    return;
                }

                // check if there's a kill hook
                if ("kill" in acr.apps[acr.processes[this.PID]["app"]]) {
                    acr.apps[acr.processes[this.PID]["app"]]["kill"](this.PID);
                }

                // delete any windows of the process
                if (this.PID in windows) {

                    delete windows[this.PID];

                    id(`window-${this.PID}`).classList.add("window-animation-close");
                    setTimeout(() => {
                        id(`window-${this.PID}`).remove();
                    }, 250);

                    if (selectedWindow === this.PID) {    // the window was the selected window
                        selectedWindow = undefined;
                    }
                    if (acr.processes[this.PID]["app"] === "about" && acr.processes[this.PID]["name"] === "Donut") {
                        --activeDonuts;
                    }

                }

                // self-destruct
                delete acr.processes[this.PID];

            }

        }

    //endregion

    //region ──────────           app management           ──────────

        this.apps = {};

        // this App class represents an app, not an instance of an app (that's just Process)
        this.App = class{

            // register a new app
            constructor(id, info, hooks) {

                // set values
                this.id = id;
                this.display = info.display;
                this.type = info.type;
                this.category = info.category;
                this.icon = "icon" in info? info.icon: "iconol/square_%3F.svg";
                this.run = "run" in hooks? hooks.run: function() {};
                this.action = "action" in hooks? hooks.action: function() {};
                this.kill = "kill" in hooks? hooks.kill: function() {};

            }

            // launch a new instance of the app
            launch(additionalData) {
                let process = new acr.Process(this.display, this.id, null, additionalData);
                this.run(process);
            }

        }


    //endregion

    //endregion

    //region ━━━━━━━━━━━━━━━       SETUP/LOGIN        ━━━━━━━━━━━━━━━

    //region ──────────             show setup             ──────────

        function showSetup() {

            id("setupscreen").style.backgroundImage = `url(${noUserWallpaper})`;
            id("setupscreen").style.filter = "opacity(0)";
            id("setupscreen").style.display = "block";

            let counter = 0;
            let interval = setInterval(() => {
                id("setupscreen").style.filter = `opacity(${counter / 100})`;
                ++counter;
                if (counter > 100) {
                    clearInterval(interval);
                }
            }, 10);

            showSetupStage(1);
        }

    //endregion

    //region ──────────            setup stages            ──────────

        let setupStage = 1;
        const setupStageNames = {
            1: "Introduction",
            2: "Create account",
            3: "Customization",
            4: "Options",
            5: "Setup complete"
        };

        function showSetupStage(stage) {

            // set number and name on top
            id("setup-stage-number").innerText = stage;
            id("setup-stage-name").innerText = setupStageNames[stage];

            // hide old stage content and show new stage
            id(`setup-${setupStage}`).style.display = "none";
            id(`setup-${stage}`).style.display = "block";
            setupStage = stage;

            // run something for each stage
            switch (stage) {

                case 1:
                    onclick("setup-1-continue", () => {
                        showSetupStage(2);
                    });
                    onclick("setup-1-import", () => {
                        bsod("Importing data not implemented");
                    });
                    break;

                case 2:
                    onclick("setup-2-create", () => {
                        let users = {};
                        users[id("setup-2-username").value] = {
                            "display_name": id("setup-2-username").value,
                            "password": id("setup-2-password").value
                        };
                        config["users"] = users;
                        showSetupStage(3);
                    });
                    onclick("setup-2-back", () => {
                        showSetupStage(1);
                    })
                    break;

                case 3:
                    onclick("setup-3-continue", () => {
                        showSetupStage(4);
                    });
                    onclick("setup-3-back", () => {
                        showSetupStage(2);
                    })
                    break;

                case 4:
                    onclick("setup-4-continue", () => {
                        showSetupStage(5);
                    });
                    onclick("setup-4-back", () => {
                        showSetupStage(3);
                    })
                    break;

                case 5:
                    config["setup"] = true;
                    onclick("setup-5-reload", () => {
                        saveData();
                        window.location.reload();
                    });
                    break;

            }
        }

    //endregion

    //region ──────────         show login screen          ──────────

        let user;
        let skippedLogin;

        function showLoginScreen() {

            // check if there's existing session login data
            if (sessionStorage.getItem("username") === null) {
                skippedLogin = false;
            } else {
                skippedLogin = true;
                user = sessionStorage.getItem("username");
                showDesktop();
                return;
            }

            // add eventlisteners
            onclick("loginbox-login", () => {
                login(id("loginbox-username").value, id("loginbox-password").value);
            });
            onclick("loginbox-create", () => {
                bsod("Account creation is currently not implemented yet.");
            });

            // show login screen
            id("loginscreen").style.backgroundImage = `url(${noUserWallpaper})`;
            id("loginscreen").style.filter = "opacity(0)";
            id("loginscreen").style.display = "block";
            let counter = 0;
            let interval = setInterval(() => {
                id("loginscreen").style.filter = `opacity(${counter / 100})`;
                ++counter;
                if (counter > 100) {
                    clearInterval(interval);
                }
            }, 10);

        }

    //endregion

    //region ──────────           login function           ──────────

        function login(username, password) {
            if (username in config["users"]) {
                if (config["users"][username].password === password) {
                    user = username;
                    sessionStorage.setItem("username", username);
                    sessionStorage.setItem("password", password);
                    showDesktop();
                } else {
                    bsod("Incorrect password.");
                }
            } else {
                bsod("User doesn't exist.");
            }
        }

    //endregion

    //endregion

    //region ━━━━━━━━━━━━━━━         DESKTOP          ━━━━━━━━━━━━━━━

    //region ──────────            show desktop            ──────────

        function setDesktopWallpaper() {
            id("desktop").style.backgroundImage = `url(${getUserConfig("wallpaper")})`;
        }

        function showDesktop() {

            // set wallpaper
            setDesktopWallpaper();

            // move version
            id("version").classList.remove("version-boot");
            id("version").classList.add("version-desktop");

            // put event listener on search bar
            id("searchbar").addEventListener("keyup", () => {
                if(id("searchbar").value.length >= 1) {
                    search(id("searchbar").value);
                }
            });

            // start updating and bind the time
            startUpdatingTime();
            onclick("timebar", changeTimeFormat);

            // show main screen
            id("loginscreen").style.display = "none";
            id("desktop").style.filter = "opacity(0)";
            id("desktop").style.display = "block";
            let counter = 0;
            let interval = setInterval(() => {
                id("desktop").style.filter = `opacity(${counter / 100})`;
                ++counter;
                if (counter > 100) {
                    clearInterval(interval);
                }
            }, 10);

            // bind start button
            onclick("start-button", toggleStart);

            // enable keyboard shortcuts
            enableDesktopShortcuts();

            // enable click confetti if the user has it enabled
            if (getUserConfig("click_confetti")) {
                enableClickConfetti();
            }

            // enable transparent topbar if the user has it enabled
            if(getUserConfig("transparent_topbar")) {
                id("topbar").classList.add("topbar-transparent");
            }

            // enable blue rectangle
            enableBlueRectangle();

        }

    //endregion

    //region ──────────             searchbar              ──────────

        const searchTypeNames = {
            "app": "App"
        };

        class searchMatch{
            constructor(type, ID, name, searchTerm) {
                this.type = type;
                this.ID = ID;
                this.name = name;
                this.score = damerauLevenshtein(searchTerm, name, "ratio");
            }
        }
        function search(searchTerm) {

            let searchMatches = [];

            // put app matches
            for(const [appID, appData] of Object.entries(acr.apps)) {
                searchMatches.push(new searchMatch("app", `app:${appID}`, appData.display, searchTerm));
            }

            // sort matches by score
            function compareScores(a, b) {
                if(a.score < b.score) {
                    return -1;
                } else if(a.score === b.score) {
                    return 0;
                } else if(a.score > b.score) {
                    return 1;
                }
            }
            searchMatches.sort(compareScores).reverse();

            // create entries
            id("searchmenu").innerHTML = "";
            for(const match of searchMatches) {
                append("searchmenu", `
                    <button class="searchentry" id="searchentry-${match.ID}">
                        <img src="${acr.apps[match.ID.substring(4)].icon}" alt="${match.name}" class="searchentry-icon" />
                        <span class="searchentry-name">${match.name}</span>
                        <span class="searchentry-type">${searchTypeNames[match.type]}</span>
                        <span class="searchentry-match">${Math.round(match.score * 100)}% match</span>
                        <span class="searchentry-offset"></span>
                    </button>
                `);
                id(`searchentry-${match.ID}`).addEventListener("click", () => {
                    alert(match.ID);
                });
            }

            // show menu
            id("searchmenu").style.display = "block";

        }

    //endregion

    //region ──────────                time                ──────────

        let timeUpdateInterval;

        function startUpdatingTime() {
            updateTime();
            if (getUserConfig("time_format") >= 2) {
                timeUpdateInterval = setInterval(updateTime, 16);
            } else {
                timeUpdateInterval = setInterval(updateTime, 500);
            }
        }

        function updateTime() {
            const now = new Date();
            let display;
            switch (getUserConfig("time_format")) {
                case 0:    // standard date+time
                    display = `${pad(now.getFullYear(), 2)}/${pad(now.getMonth() + 1, 2)}/${pad(now.getDate(), 2)} ${pad(now.getHours(), 2)}:${pad(now.getMinutes(), 2)}:${pad(now.getSeconds(), 2)}`;
                    break;
                case 1:    // only date
                    display = `${dayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
                    break;
                case 2:    // only time
                    const timezoneOffset = now.getTimezoneOffset() / 60;
                    const timezoneText = `UTC${timezoneOffset > 0 ? "-" : "+"}${Math.abs(timezoneOffset)}`;
                    display = `${pad(now.getHours(), 2)}:${pad(now.getMinutes(), 2)}:${pad(now.getSeconds(), 2)}.${pad(now.getMilliseconds(), 3)} [${timezoneText}]`;
                    break;
                case 3:    // unix timestamp
                    display = `Unix ${now.valueOf().toLocaleString("en-US").replaceAll(",", "&thinsp;")}`;
                    break;
            }
            id("timebar").innerHTML = display;
        }

        function changeTimeFormat() {
            setUserConfig("time_format", (getUserConfig("time_format") + 1) % 4);
            clearInterval(timeUpdateInterval);
            startUpdatingTime();
        }

    //endregion

    //region ──────────                dock                ──────────

        // lol

    //endregion

    //region ──────────             start menu             ──────────

    // toggle opening/closing

        let startOpened = false;
        const startCategories = {
            "favorites": "Favorites",
            "games": "Games",
            "graphics": "Graphics",
            "internet": "Internet",
            "media": "Media",
            "system": "System",
            "utilities": "Utilities"
        };

        function toggleStart() {

            if (startOpened) {

                // hide it
                id("startmenu").classList.add("startmenu-animation-close");
                setTimeout(() => {
                    id("startmenu").classList.remove("startmenu-animation-close");
                    id("startmenu").style.display = "none";
                    id("startmenu-categories").innerHTML = "";
                },250);

                startOpened = false;

            } else {

                // generate categories
                for (const [categoryID, categoryName] of Object.entries(startCategories)) {
                    append("startmenu-categories", `
                        <button class="startmenu-category bfull" id="startmenu-category-${categoryID}">
                           ${categoryName}
                        </button>
                    `);
                    id(`startmenu-category-${categoryID}`).addEventListener("click",
                        startSwitchCategory.bind(null, categoryID)
                    );
                    id(`startmenu-category-${categoryID}`).addEventListener("mouseover",
                        startSwitchCategory.bind(null, categoryID)
                    );
                }

                // show it
                const startButtonLeft = id("start-button").getBoundingClientRect().left;
                id("startmenu").style.left = `calc(${startButtonLeft}px - 2.5em)`;

                id("startmenu").style.display = "grid";
                id("startmenu").classList.add("startmenu-animation-open");
                setTimeout(() => {
                    id("startmenu").classList.remove("startmenu-animation-open");
                },250);
                startOpened = true;


            }

        }

    // switch category

        let startSelectedCategory = "favorites";
        let appTileID = 0;

        function startSwitchCategory(category) {

            id(`startmenu-category-${startSelectedCategory}`).classList.remove("startmenu-category-selected");
            id(`startmenu-category-${category}`).classList.add("startmenu-category-selected");
            startSelectedCategory = category;

            id("startmenu-apps").innerHTML = "";
            for (const [app, appData] of Object.entries(acr.apps)) {
                if ("category" in appData) {
                    if (appData["category"] === category) {
                        append("startmenu-apps", `
                            <a href="#" id="startmenu-app-tile-${appTileID}" class="startmenu-app-tile">
                                <img src="${appData["icon"]}" class="startmenu-app-tile-icon">
                                ${appData["display"]}
                            </a>
                        `);
                        onclick(`startmenu-app-tile-${appTileID}`, function(appToOpen) {
                            acr.apps[appToOpen].launch();
                            toggleStart();
                        }.bind(null, app));
                        ++appTileID;
                    }
                }
            }

        }

    //endregion

    //region ──────────     desktop keyboard shortcuts     ──────────

        function enableDesktopShortcuts() {
            window.addEventListener("keyup", (event) => {
                if (selectedWindow === undefined) {
                    switch (event.key) {
                        case "q":
                            quit("logout");
                            break;
                        case "w":
                            id("searchbar").focus()
                            break;
                        case "z":
                            toggleStart();
                            break;
                    }
                    event.preventDefault();
                }
            });
        }

    //endregion

    //region ──────────           click confetti           ──────────

        function spawnClickConfettiClick(event) {
            spawnClickConfetti(event, 12);
        }

        function spawnClickConfettiMove(event) {
            if (mouseDown) {
                spawnClickConfetti(event, 1);
            }
        }

        function enableClickConfetti() {
            document.body.addEventListener("click", spawnClickConfettiClick);
            document.body.addEventListener("mousemove", spawnClickConfettiMove);
        }

        function disableClickConfetti() {
            document.body.removeEventListener("click", spawnClickConfettiClick);
            document.body.removeEventListener("mousemove", spawnClickConfettiMove);
        }

        let confettiData = {};
        let confettiInterval;
        let currentConfettiID = 0;

        function spawnClickConfetti(event, minimumAmount) {

            // if there are no confetti, spawn processConfetti()
            if (Object.keys(confettiData).length === 0) {
                confettiInterval = setInterval(processConfetti, 16);
            }

            // spawn the confetti particles
            let thisData;
            for (let i = 0; i < randomInt(minimumAmount, minimumAmount * 2); ++i) {

                // have a chance to not spawn if there are already a lot of confetti particles
                if (Object.keys(confettiData).length > 50 && randomInt(1, 2) === 1) {
                    continue;
                }

                // generate data
                thisData = {
                    "left": event.clientX, "top": event.clientY, "rotate": randomFloat(0, 360),
                    "d_left": randomFloat(-3, 3), "d_top": randomFloat(-3, 3), "d_rotate": randomFloat(-2, 2),
                    "h": randomFloat(0, 360), "s": randomFloat(75, 100), "l": randomFloat(25, 75),
                    "decay": randomFloat(0.5, 0.75), "d_decay": randomFloat(0.005, 0.01),
                };
                if (randomInt(1, 5) <= 2) {    // circle confetti
                    const diameter = randomFloat(5, 10);
                    const d_diameter = randomFloat(-0.1, 0.1);
                    Object.assign(thisData, {
                        "width": diameter, "height": diameter, "radius": diameter,
                        "d_width": d_diameter, "d_height": d_diameter
                    });
                } else {    // rectangle confetti
                    Object.assign(thisData, {
                        "width": randomFloat(5, 15), "height": randomFloat(10, 30), "radius": randomFloat(2, 4),
                        "d_width": randomFloat(-0.1, 0.1), "d_height": randomFloat(-0.1, 0.1)
                    });
                }

                // put the confetti
                confettiData[currentConfettiID] = thisData;
                append("click-confetti", `
                    <div class="confetti" id="confetti-${currentConfettiID}" style="
                        left: ${thisData["left"]}px; top: ${thisData["top"]}px; transform: rotate(${thisData["rotate"]}deg);
                        background-color: hsl(${thisData["h"]}deg ${thisData["s"]}% ${thisData["l"]}%); filter: opacity(${thisData["decay"]});
                        width: ${thisData["width"]}px; height: ${thisData["height"]}px; border-radius: ${thisData["radius"]}px
                    "></div>
                `);

                ++currentConfettiID;
            }
        }

        function processConfetti() {

            // remove the interval if there are no confetti left
            if (Object.keys(confettiData).length === 0) {
                clearInterval(confettiInterval);
            }

            // for each confetti particle
            for (const [ID, data] of Object.entries(confettiData)) {

                // remove old confetti
                if (data["decay"] <= 0) {
                    delete confettiData[ID];
                    id(`confetti-${ID}`).remove();
                    return;
                }

                // change position, rotation, and size
                confettiData[ID]["left"] += data["d_left"];
                confettiData[ID]["top"] += data["d_top"];
                confettiData[ID]["rotate"] += data["d_rotate"];
                confettiData[ID]["width"] += data["d_width"];
                confettiData[ID]["height"] += data["d_height"];
                id(`confetti-${ID}`).style.left = `${confettiData[ID]["left"]}px`;
                id(`confetti-${ID}`).style.top = `${confettiData[ID]["top"]}px`;
                id(`confetti-${ID}`).style.transform = `rotate(${confettiData[ID]["rotate"]}deg)`;
                id(`confetti-${ID}`).style.width = `${confettiData[ID]["width"]}px`;
                id(`confetti-${ID}`).style.height = `${confettiData[ID]["height"]}px`;

                // decay
                confettiData[ID]["decay"] -= data["d_decay"];
                id(`confetti-${ID}`).style.filter = `opacity(${confettiData[ID]["decay"]})`;

            }

        }

    //endregion

    //region ──────────           blue rectangle           ──────────

        let blueRectangleOrigin;
        let blueRectangleOn = false;

        function enableBlueRectangle() {

            // start showing the blue rectangle
            id("desktop-click").addEventListener("mousemove", (event) => {
                if (mouseDown && !blueRectangleOn) {
                    blueRectangleOrigin = new Vector2(event.clientX, event.clientY);
                    id("bluerectangle").style.top = `${blueRectangleOrigin.y}px`;
                    id("bluerectangle").style.left = `${blueRectangleOrigin.x}px`;
                    id("bluerectangle").style.width = "0";
                    id("bluerectangle").style.height = "0";
                    id("bluerectangle").style.display = "block";
                    blueRectangleOn = true;
                }
            });

            // move the blue rectangle
            id("desktop").addEventListener("mousemove", (event) => {
                if (mouseDown && blueRectangleOn) {
                    id("bluerectangle").style.width = `${Math.abs(event.clientX - blueRectangleOrigin.x)}px`;
                    id("bluerectangle").style.height = `${Math.abs(event.clientY - blueRectangleOrigin.y)}px`;
                    if (event.clientY < blueRectangleOrigin.y) {
                        id("bluerectangle").style.top = `${event.clientY}px`;
                    }
                    if (event.clientX < blueRectangleOrigin.x) {
                        id("bluerectangle").style.left = `${event.clientX}px`;
                    }
                }
            });

            // hide the blue rectangle
            id("desktop").addEventListener("mouseup", () => {
                id("bluerectangle").style.display = "none";
                blueRectangleOn = false;
            });

        }

    //endregion

    //endregion

    //region ━━━━━━━━━━━━━━━        WINDOWING         ━━━━━━━━━━━━━━━

    //region ──────────         window management          ──────────

    let windows = {};
    let selectedWindow;
    let windowDragData = {};

    this.Window = class{

        constructor(titlebar, content, process, initialDimensions = null) {

            let windowID = process.PID;

            // set window data
            this.titlebar = titlebar;
            this.shown = true;
            this.maximized = false;
            this.leftStyle = "";
            this.topStyle = "";
            this.windowID = windowID;

            // summon window
            append("windows", `
                <div id="window-${windowID}" class="window selected" style="left: 100px; top: 100px">
                    <div id="window-${windowID}-titlebar" class="titlebar">
                        <img src="${acr.apps[process.app].icon}" class="titlebar-icon">
                        <span class="titlebar-text">${titlebar}</span>
                        <div class="titlebar-buttons">
                            <a href="#" class="titlebar-button-minimize" id="window-${windowID}-minimize"></a>
                            <a href="#" class="titlebar-button-toggle" id="window-${windowID}-toggle"></a>
                            <a href="#" class="titlebar-button-close" id="window-${windowID}-close"></a>
                        </div>
                    </div>
                    <div class="window-content">
                        ${content}
                    </div>
                </div>
           `);
            id(`window-${windowID}`).classList.add("window-animation-open");
            setTimeout(() => {
                id(`window-${windowID}`).classList.remove("window-animation-open");
            }, 250);

            // set initial dimensions
            if(initialDimensions) {
                id(`window-${windowID}`).style.width = initialDimensions[0];
                id(`window-${windowID}`).style.height = initialDimensions[1];
            }

            // make the buttons actually do stuff
            onclick(`window-${windowID}-minimize`, () => {
                this.shown = false;
                id(`window-${windowID}`).style.display = "none";
            });
            onclick(`window-${windowID}-toggle`, () => {
                if(this.maximized) {
                    this.unmaximize(windowID);
                } else {
                    this.maximize(windowID);
                }
            });
            onclick(`window-${windowID}-close`, () => {
                acr.processes[windowID].kill();
            });

            // make the window selectable and draggable
            id(`window-${windowID}-titlebar`).addEventListener("mousedown", (event) => {

                // select
                if (selectedWindow !== windowID) {    // if the selected window isn't this window
                    id(`window-${windowID}`).classList.add("selected");
                    if (typeof selectedWindow !== "undefined") {
                        id(`window-${selectedWindow}`).classList.remove("selected");
                    }
                    selectedWindow = windowID;
                }

                // make draggable
                let titlebarRect = id(`window-${windowID}-titlebar`).getBoundingClientRect();
                windowDragData = {
                    "id": windowID,
                    "xOffset": event.clientX - titlebarRect.left,
                    "yOffset": event.clientY - titlebarRect.top
                };
                document.body.addEventListener("mousemove", this.dragWindow);
                document.body.addEventListener("mouseup", () => {
                    document.body.removeEventListener("mousemove", this.dragWindow);
                });

            });

            // add to windows
            windows[windowID] = this;

        }

        maximize() {
            windows[this.windowID]["maximized"] = true;
            id(`window-${this.windowID}`).classList.add("maximized");
            windows[this.windowID]["leftStyle"] = id(`window-${this.windowID}`).style.left;
            windows[this.windowID]["topStyle"] = id(`window-${this.windowID}`).style.top;
            id(`window-${this.windowID}`).removeAttribute("style");
        }

        unmaximize() {
            windows[this.windowID]["maximized"] = false;
            id(`window-${this.windowID}`).classList.remove("maximized");
            id(`window-${this.windowID}`).classList.add("unmaximized");
            setTimeout(() => {
                id(`window-${this.windowID}`).classList.remove("unmaximized");
            }, 250);
            id(`window-${this.windowID}`).style.left = windows[this.windowID]["leftStyle"];
            id(`window-${this.windowID}`).style.top = windows[this.windowID]["topStyle"];
        }

        dragWindow(event) {
            if(windows[windowDragData["id"]]["maximized"]) {
                this.unmaximize(windowDragData["id"]);
            }
            id(`window-${windowDragData["id"]}`).style.left = `${event.clientX - windowDragData["xOffset"]}px`;
            id(`window-${windowDragData["id"]}`).style.top = `${event.clientY - windowDragData["yOffset"]}px`;
        }

    }

    //endregion

    //region ──────────            spawn popup             ──────────

        const popupTypes = {
            "error": {
                "name": "Error",
                "icon": "iconol/circle_no.png"
            },
            "unknown": {
                "name": "Unknown",
                "icon": "iconol/square_?.svg"
            }
        };

        function spawnPopup(type, content, buttons, parentProcess = 0) {
            // the parent process defaults to 0 (the acrylic core process)

            let buttonsDisplay = "";
            for (const [buttonText, buttonAction] of Object.entries(buttons)) {
                buttonsDisplay += `<button class="bflat" onclick="${buttonAction}">${buttonText}</button>`;
            }

            let popupProcessID = new Process("Popup", processes[parentProcess]["app"], parentProcess);
                new Window (popupTypes[type]["name"], `
                <div class="popup-grid">
                    <div class="popup-grid-icon">
                        <img src="${popupTypes[type]["icon"]}" class="popup-icon">
                    </div>
                    <div class="popup-grid-content">
                        <span class="popup-content">
                            ${content}
                        </span>
                    </div>
                    <div class="popup-grid-buttons">
                        ${buttonsDisplay}
                    </div>
                </div>
            `, popupProcessID, ["24em", "12em"]);

        }

    //endregion

    //endregion

    //region ━━━━━━━━━━━━━━━        CORE APPS         ━━━━━━━━━━━━━━━

    //region ──────────          donut utilities           ──────────

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

    let activeDonuts = 0;

    //endregion

    //region ──────────           settings data            ──────────

    const settingsData = {
        "general": {
            "name": "General",
            "options": {
                "welcome": {
                    "type": "html",
                    "html": "<b>Welcome to the settings app!</b>"
                },
                "general_coming_soon": {
                    "type": "html",
                    "html": "General settings currently aren't available."
                }
            }
        },
        "appearance": {
            "name": "Appearance",
            "options": {
                "wallpaper": {
                    "type": "select",
                    "name": "Wallpaper",
                    "subtitle": "Currently you can only select between 3 wallpapers.",
                    "options": {
                        "assets/wallpapers/acrylic.png": '"Acrylic"',
                        "assets/wallpapers/baltic_sea.jpg": '"Baltic sea"',
                        "assets/wallpapers/cosmos.jpg": '"Cosmos"'
                    },
                    "selected": ["user", "wallpaper"],
                    "set": function (newValue) {
                        setUserConfig("wallpaper", newValue);
                        setDesktopWallpaper();
                    }
                },
                "transparent_topbar": {
                    "type": "checkbox",
                    "name": "Transparent topbar",
                    "subtitle": "Make the topbar appear transparent.",
                    "selected": ["user", "click_confetti"],
                    "set": function (newValue) {
                        setUserConfig("transparent_topbar", newValue);
                        if (newValue) {
                            id("topbar").classList.add("topbar-transparent");
                        } else {
                            id("topbar").classList.remove("topbar-transparent");
                        }
                    }
                }
            }
        },
        "effects": {
            "name": "Effects",
            "options": {
                "click_confetti": {
                    "type": "checkbox",
                    "name": "Click confetti",
                    "subtitle": "When you click or drag, it'll spawn confetti. Note that this can be laggy.",
                    "selected": ["user", "click_confetti"],
                    "set": function (newValue) {
                        setUserConfig("click_confetti", newValue);
                        if (newValue) {
                            enableClickConfetti();
                        } else {
                            disableClickConfetti();
                        }
                    }
                }
            }
        },
        "system": {
            "name": "System",
            "options": {
                "reset": {
                    "type": "button",
                    "name": "Reset Acrylic",
                    "subtitle": "Resetting Acrylic means all Acrylic data will be deleted, including users, settings, and files.",
                    "click": () => {
                        quit("reset");
                    }
                }
            }
        }
    };

    //endregion

    //region ──────────               acrsh                ──────────

    this.Acrsh = class{

        // construct a new acrsh session
        constructor(PID) {
            this.PID = PID;
        }

        // a token
        static Token = class{
            constructor(type, value) {
                
            }
        }

        // tokenize the command
        tokenize() {
            let tokens = [];
            let thisToken = "";
            for(let i = 0; i < this.command.length; ++i) {
                switch(this.command.charAt(i)) {
                    case " ":
                        tokens.push(thisToken);
                        thisToken = "";
                        break;
                    default:
                        thisToken += this.command.charAt(i);
                }
            }
            tokens.push(thisToken);
            this.tokens = tokens;
        }

        // process the tokenized command
        process() {
            let prefix = "-";
            let result = "";
            for(const token of this.tokens) {
                result += `${token}-`;
            }
            this.prefix = "-";
            this.result = result;
        }

        // run (tokenize and process) a command
        run(command) {
            this.command = command;
            this.tokenize();
            this.process();
        }
        /*
                                try {
                            result = eval(`${terminalRC}\n${command}`);
                            if (result === undefined) {
                                result = "";
                                prefix = "- Completed";
                            } else {
                                result = JSON.stringify(result);
                                prefix = "&lt;"
                            }
                        } catch (error) {
                            result = error;
                            prefix = "!";
                        }

                const terminalRC = `
                    function help() {
                        return "Help menu currently not available.";
                    }
                    function echo(text) {
                        return text;
                    }
                    function clear() {
                        appAction(${windowID}, "reset");
                    }
                `;

         */
    }

    //endregion

    //region ──────────           core utilities           ──────────

    const coreUtilities = {

        // acrylic core process
        "acrylic": new this.App(
            "acrylic",
            {
                "display": "Acrylic core",
                "type": "none",
                "category": ""
            },
            {
                "run": () => {
                    bsod("There's obviously already an Acrylic core process. Why the hell would you want to spawn another one?");
                }
            }
        ),

        // file picker
        "file-picker": new this.App(
            "file-picker",
            {
                "display": "File picker",
                "type": "gui",
                "category": "none"
            },
            {
                "run": (windowID) => {
                    new acr.Window("File picker", `
                    Hello! I'm the file picker!
                `, windowID);
                }
            }
        )

    };

    //endregion

    //region ──────────          actual core apps          ──────────

    const coreApps = {

        // about
        "about": new this.App(
            "about",
            {
                "display": "About",
                "type": "gui",
                "category": "system"
            },
            {
                "run": (process) => {

                    let windowID = process.PID;

                    new this.Window("About", `
                        <div class="apps-about-grid">
                            <div class="apps-about-grid-logo">
                                <img src="assets/acrylic_logo.png" class="apps-about-logo">
                            </div>
                            <div class="apps-about-grid-title">
                                <h2>Acrylic (acrylicOS)</h2>
                                <b>Version ${acr.version}</b>
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
                },
                "action": (windowID, action) => {
                    switch (action) {

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

                        case "donut":
                            if(activeDonuts > 100) {
                                bsod("Too many donuts");
                            }
                            let newProcess = new acr.Process("Donut", "about");
                            new acr.Window("Donut", `
                                <pre class="apps-about-donut" id="window-${newProcess.PID}-about-donut"></pre>
                            `, newProcess);
                            showSpinningDonut(id(`window-${newProcess.PID}-about-donut`));
                            ++activeDonuts;
                            break;

                    }
                }
            }
        ),

        // calculator
        "calculator": new this.App(
            "calculator",
            {
                "display": "Calculator",
                "type": "gui",
                "category": "utilities",
                "icon": "iconol/calculator.svg"
            },
            {
                "run": (windowID) => {

                    const calculatorButtons = [
                        "(", ")", "&pi;", "e", "&phi;", "", "AC",
                        "[", "]", "log", "", "", "", "&div;",
                        "{", "}", "&Sqrt;", "7", "8", "9", "&times;",
                        "sin", "", "^", "4", "5", "6", "-",
                        "cos", "<sup>3</sup>", "<sup>2</sup>", "1", "2", "3", "+",
                        "tan", "", "&frasl;", "0", ".", "="
                    ];

                    function generateButtons() {
                        let generated = "";
                        for (const button of calculatorButtons) {

                            const buttonID = button.charAt(0) === "&" && button.slice(-1) === ";" ? button.slice(1, -1) : button;
                            // if it was a complete html entity then it'd get parsed

                            generated += `
                                <a href="#"
                                   class="app-calculator-button ${button === "=" ? "app-calculator-button-equals" : ""}"
                                   onclick="appAction(${windowID}, 'button_press', {'button': '${button}', 'buttonID': '${buttonID}'})"
                                >
                                    ${button}
                                </a>
                            `;
                        }
                        return generated;
                    }

                    new this.Window("Calculator", `
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
                                    <button onclick="appAction(${windowID}, 'toggle_history')" class="bflat">History</button>
                                </div>
                            </div>
                            <div class="app-calculator-buttons">
                                ${generateButtons()}
                            </div>
                        </div>
                    `, windowID);

                    windowID.storage = {
                        "equation": "",
                        "replace_equation_next": false,
                        "history_shown": false
                    };

                },
                "action": (windowID, action, data) => {
                    if (action === "button_press") {

                        if (processStorage[windowID]["replace_equation_next"]) {
                            if (data["buttonID"] === "=") {
                                return;
                            } else {
                                id(`window-${windowID}-calculator-equation`).innerText = "";
                                processStorage[windowID]["replace_equation_next"] = false;
                            }
                        }

                        switch (data["buttonID"]) {

                            case "AC":
                                processStorage[windowID]["equation"] = "";
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

                                let equation = processStorage[windowID]["equation"];
                                for (const [from, to] of replacements) {
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

                                processStorage[windowID]["equation"] = "";
                                processStorage[windowID]["replace_equation_next"] = true;

                                break;

                            case "Sqrt":
                            case "log":
                            case "sin":
                            case "cos":
                            case "tan":
                                processStorage[windowID]["equation"] += `${data["buttonID"]}(`;
                                id(`window-${windowID}-calculator-equation`).innerHTML += `${data["button"]}(`;
                                break;

                            default:
                                processStorage[windowID]["equation"] += data["buttonID"];
                                id(`window-${windowID}-calculator-equation`).innerHTML += data["button"];

                        }
                    } else if (action === "toggle_history") {

                        if (processStorage[windowID]["history_shown"]) {
                            // hide history
                            id(`window-${windowID}-calculator-history`).style.display = "none";
                            id(`window-${windowID}-calculator-grid`).classList.remove("app-calculator-grid-history-shown");
                            id(`window-${windowID}-calculator-grid`).classList.add("app-calculator-grid-history-hidden");
                            processStorage[windowID]["history_shown"] = false;
                        } else {
                            // show history
                            id(`window-${windowID}-calculator-history`).style.display = "block";
                            id(`window-${windowID}-calculator-grid`).classList.remove("app-calculator-grid-history-hidden");
                            id(`window-${windowID}-calculator-grid`).classList.add("app-calculator-grid-history-shown");
                            processStorage[windowID]["history_shown"] = true;
                        }

                    }
                }

            }
        ),

        // notepad
        "notepad": new this.App(
            "notepad",
            {
                "display": "Notepad",
                "type": "gui",
                "category": "utilities",
                "icon": "iconol/notepad.svg"
            },
            {
                "run": (windowID) => {
                    new this.Window("Notepad", `
                        <section>
                            <button onclick="appAction(${windowID}, 'save')" class="bflat">Save</button>
                            <button onclick="appAction(${windowID}, 'open')" class="bflat">Open</button>
                        </section>
                        <textarea class="apps-notepad-textarea"></textarea>
                    `, windowID);
                },
                "action": (windowID) => {
                    this.openApp("file-picker", {
                        "parent": windowID
                    });
                }
            }
        ),

        // sandbox
        "sandbox": new this.App(
            "sandbox",
            {
                "display": "Sandbox",
                "type": "gui",
                "category": "utilities",
                "icon": "iconol/sandbox.svg"
            },
            {
                "run": function (process) {

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
                            <button onclick="appAction(${process.PID}, 'change_build_number')" class="bflat">
                                Change build number
                            </button>
                            <button onclick="appAction(${process.PID}, 'elements_test')" class="bflat">
                                Elements test
                            </button>
                        </section>
                        <section>
                            <b>Commonly used apps</b>
                            <br>
                            <button onclick="openApp('about')" class="bflat">Open about</button>
                            <button onclick="openApp('terminal')" class="bflat">Open terminal</button>
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

                },
                "action": function (windowID, action, data) {
                    switch (action) {

                        case "dump": {
                            const newPID = new Process("Variable dump", "sandbox", windowID);
                            const dumpOutput = JSON.stringify(eval(data["variable"]), null, 2);
                            spawnWindow("Variable dump", `
                            <b>Dump of ${data["variable"]}:</b>
                            <pre class="apps-sandbox-dump-output">${dumpOutput}</pre>
                        `, newPID);
                            break;
                        }

                        case "change_build_number": {
                            const newPID = new Process("Change build number", "sandbox", windowID);
                            spawnWindow("Change build number", `
                            <section>
                                Current build number: ${version.split("-")[0]}-<b>${version.split("-")[1]}</b>
                            </section>
                            <section>
                                <input type="text" class="textbox" id="window-${newPID}-sandbox-change-build-number" placeholder="New build number">
                            </section>
                            <section>
                                <button onclick="appAction(${newPID}, 'change_build_number_done', { 'pid': ${newPID} })"
                                        class="bflat">Done</button>
                            </section>
                        `, newPID);
                            break;
                        }
                        case "change_build_number_done": {
                            const newPID = data["pid"];
                            const newBuildNumber = id(`window-${newPID}-sandbox-change-build-number`).value;
                            let version = `${version.split("-")[0]}-${newBuildNumber}*`;
                            killProcess(newPID);
                            break;
                        }

                        case "elements_test": {
                            const newPID = new Process("Elements test", "sandbox", windowID);
                            spawnWindow("Elements test", `
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
                        `, newPID, ["40em", "25em"]);
                        }

                    }
                }
            }
        ),

        // settings
        "settings": new this.App(
            "settings",
            {
                "display": "Settings",
                "type": "gui",
                "category": "system",
                "icon": "iconol/settings.svg"
            },
            {
                "run": (process) => {
                    let windowID = process.PID;

                    // spawn window
                    new acr.Window("Settings", `
                        <section id="window-${windowID}-settings-tab-buttons"></section>
                        <h2 id="window-${windowID}-settings-tab-title"></h2>
                        <div id="window-${windowID}-settings-content"></div>
                    `, process);

                    // render tab selector
                    for (const [tabID, tabData] of Object.entries(settingsData)) {
                        append(`window-${windowID}-settings-tab-buttons`,
                            `<button class="bflat" id="window-${windowID}-settings-tab-button-${tabID}">${tabData["name"]}</button>`
                        );
                        id(`window-${windowID}-settings-tab-button-${tabID}`).addEventListener("click",
                            function (tab) {
                                process.action("switch_tab", {"tab": tab})
                            }.bind(null, tabID)
                        );
                    }

                    // render the general tab
                    process.action("switch_tab", {"tab": "general"});

                },
                "action": (process, action, data) => {
                    let windowID = process.PID;

                    switch (action) {

                        // the user switched the tab
                        case "switch_tab":

                            // render tab
                            let optionsDisplay = "";
                            let attr_id, attr_action, selected, eventListenersToPut;
                            const tab = data["tab"];
                            for (const [optionID, optionData] of Object.entries(settingsData[tab]["options"])) {

                                optionsDisplay += "<fieldset>";

                                // id and on(something) attributes
                                attr_id = `window-${windowID}-settings-option-${optionID}`;
                                attr_action = function (tab, optionID) {
                                    process.action("option", {'tab': tab, 'option': optionID})
                                }.bind(null, tab, optionID);
                                eventListenersToPut = {}

                                // set selected value
                                if ("selected" in optionData) {
                                    switch (optionData["selected"][0]) {
                                        case "global":
                                            selected = getGlobalConfig(optionData["selected"][1]);
                                            break;
                                        case "user":
                                            selected = getUserConfig(optionData["selected"][1]);
                                            break;
                                    }
                                }

                                // switch type
                                switch (optionData["type"]) {
                                    case "html":
                                        optionsDisplay += optionData["html"];
                                        break;
                                    case "button":
                                        optionsDisplay += `
                                        <legend>${optionData["name"]}</legend>
                                        <button class="bflat" id="${attr_id}">
                                            ${optionData["name"]}
                                        </button>
                                        <span class="subtitle">${optionData["subtitle"]}</span>
                                    `;
                                        eventListenersToPut[optionID] = attr_action;
                                        break;
                                    case "select":
                                        let selectOptions = "";
                                        for (const [selectID, selectName] of Object.entries(optionData["options"])) {
                                            selectOptions += `
                                                    <option value="${selectID}" ${selectID === selected ? "selected" : ""}>
                                                        ${selectName}
                                                    </option>
                                                `;
                                        }
                                        optionsDisplay += `
                                                <legend>${optionData["name"]}</legend>
                                                <select id="${attr_id}" onchange="${attr_action}">
                                                    ${selectOptions}
                                                </select>
                                            `;
                                        break;
                                    case "checkbox":
                                        optionsDisplay += `
                                        <legend>${optionData["name"]}</legend>
                                        <input type="checkbox" id="${attr_id}" ${selected ? "checked" : ""}>
                                        <span>${optionData["name"]}</span>
                                        <span class="subtitle">${optionData["subtitle"]}</span>
                                    `;
                                        eventListenersToPut[optionID] = attr_action;
                                        break;
                                }

                                optionsDisplay += "</fieldset>";

                            }

                            // set content
                            id(`window-${windowID}-settings-content`).innerHTML = optionsDisplay;

                            // put event listeners
                            for (const [option, listener] of Object.entries(eventListenersToPut)) {
                                id(`window-${windowID}-settings-option-${option}`).addEventListener("click", listener);
                            }
                            break;

                        // an option was activated
                        case "option":
                            const option = settingsData[data["tab"]]["options"][data["option"]];
                            switch (option["type"]) {
                                case "button":
                                    option["click"](null);
                                    break;
                                case "select":
                                    option["set"](id(`window-${windowID}-settings-option-${data["option"]}`).value);
                                    break;
                                case "checkbox":
                                    option["set"](id(`window-${windowID}-settings-option-${data["option"]}`).checked);
                                    break;
                            }
                            break;

                    }
                }
            }
        ),

        // system monitor
        "system-monitor": new this.App(
            "system-monitor",
            {
                "display": "System Monitor",
                "type": "gui",
                "category": "system",
                "icon": "iconol/system_monitor.svg"
            },
            {
                "run": function (process) {
                    let windowID = process.PID;

                    const typeDisplayNames = {
                        "none": "Hidden",
                        "gui": "Graphical",
                        "term": "Terminal"
                    };

                    new acr.Window("System Monitor", `
                        <span id="window-${windowID}-live" class="apps-system-monitor-live">Live</span>
                        <h2>Processes</h2>
                        <table id="window-${windowID}-process-table"></table>
                    `, process);

                    function updateTable(process) {

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

                    updateTable(process);
                    acr.processes[windowID].storage["interval"] = setInterval(() => {
                        updateTable(process);
                    }, 500);

                },
                "action": function (windowID, action, data) {
                    switch (action) {
                        case "kill_process":
                            acr.processes[data["pid"]].kill();
                            break;
                    }
                },
                "kill": function(windowID) {
                    clearInterval(acr.processes[windowID].storage["interval"]);
                }
            }
        ),

        // terminal
        "terminal": new this.App(
            "terminal",
            {
                "display": "Terminal",
                "type": "gui",
                "category": "system",
                "icon": "iconol/display_black.svg"
            },
            {
                "run": (process) => {

                    let windowID = process.PID;

                    new acr.Window("Terminal", `
                        <div class="apps-terminal-box">
                            <div id="window-${windowID}-terminal-result" class="apps-terminal-result"
                                 onclick="appAction(${windowID}, 'select')"></div>
                            <div>
                                <label for="window-${windowID}-terminal-input">Input command</label>
                                &gt; <input class="apps-terminal-input" id="window-${windowID}-terminal-input"></input> 
                            </div>
                        </div>
                    `, process);

                    process.storage.acrsh = new acr.Acrsh(windowID);
                    process.storage.initialTerminalText = `
                        <br>
                        &nbsp;&nbsp;<b>Acrylic v${acr.version} - acrsh console</b>
                        <br>
                        &nbsp;&nbsp;Run "help()" for help
                        <br>
                    `;
                    id(`window-${windowID}-terminal-result`).innerHTML = process.storage.initialTerminalText;

                    process.action(windowID, "reset");
                    process.action(windowID, "select");
                    id(`window-${windowID}-terminal-input`).addEventListener("keyup", (event) => {
                        if (event.key === "Enter") {
                            process.action("run_command");
                        }
                    });

                },
                "action": (process, action) => {

                    switch (action) {

                        case "reset":
                            id(`window-${process.PID}-terminal-result`).innerHTML = process.storage.initialTerminalText;
                            break;

                        case "select":
                            id(`window-${process.PID}-terminal-input`).focus();
                            break;

                        case "run_command":

                            const command = id(`window-${process.PID}-terminal-input`).value;
                            id(`window-${process.PID}-terminal-input`).value = "";

                            process.storage.acrsh.run(command);
                            let result = process.storage.acrsh.result;
                            let prefix = process.storage.acrsh.prefix;
                            console.log(result);

                            id(`window-${process.PID}-terminal-result`).innerHTML += `<br>&gt; ${command}<br>${prefix} ${result}<br>`;
                            break;

                    }
                }
            }
        ),

        // weather
        "weather": new this.App(
            "weather",
            {
                "display": "Weather",
                "type": "gui",
                "category": "utilities",
            },
            {
                "run": (windowID) => {

                    // make window
                    spawnWindow("Weather", `
                        <div class="centered apps-weather-loading" id="window-${windowID}-weather-loading">
                            <h1>Loading...</h1>
                        </div>
                        <div class="centered apps-weather-has-location" id="window-${windowID}-weather-has-location">
                            <h1>Weather</h1>
                            <div class="apps-weather-boxes" id="window-${windowID}-weather-boxes"></div>
                            <span class="subtitle">
                                Weather data provided by <a href="https://open-meteo.com/">Open-Meteo</a>.
                            </span>
                        </div>
                        <div class="centered apps-weather-no-location" id="window-${windowID}-weather-no-location">
                            <h1>No location info available</h1>
                            <button class="bfull" onclick="appAction(${windowID}, 'update')">
                                Give location permissions
                            </button>
                        </div>
                    `, windowID);

                    // update it for the first time
                    processStorage[windowID] = {};
                    appAction(windowID, "update");

                },
                "action": (windowID, action) => {

                    switch (action) {

                        case "update":

                            // get location info
                        function getLocationInfo() {
                            navigator.geolocation.watchPosition(
                                // success
                                function (position) {
                                    processStorage[windowID]["longitude"] = position.coords.longitude;
                                    processStorage[windowID]["latitude"] = position.coords.latitude;
                                    getWeatherInfo().then(function (success) {
                                        if (success) {
                                            updateBoxes();
                                        }
                                    });
                                },

                                // error
                                () => {
                                    id(`window-${windowID}-weather-loading`).style.display = "none";
                                    id(`window-${windowID}-weather-no-location`).style.display = "block";
                                },

                                {enableHighAccuracy: true}
                            );
                        }

                            // get weather info
                            let weatherInfo;

                        async function getWeatherInfo() {
                            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                            const response = await fetch(
                                `https://api.open-meteo.com/v1/forecast?latitude=${processStorage[windowID]["latitude"]}&longitude=${processStorage[windowID]["longitude"]}&timezone=${timezone}&hourly=temperature_2m,relative_humidity_2m,rain,cloud_cover,uv_index&past_days=1&forecast_days=1`
                            );
                            if (response.ok) {
                                weatherInfo = await response.json();
                                processStorage[windowID]["info_gathered"] = true;
                                return true;
                            }
                            return false;
                        }

                            // update and show boxes
                        function updateBoxes() {
                            const hourlyData = weatherInfo["hourly"];
                            let generated = "";
                            for (let i = 0; i < Object.keys(hourlyData["time"]).length; ++i) {
                                generated += `
                                        <a href="#" class="apps-weather-box" id="window-${windowID}-weather-box-${i}"
                                           onclick="appAction(${windowID}, 'select_box', { "box": ${i} )">
                                            <span class="subtitle">
                                                ${hourlyData["time"][i].replace("T", "<br>")}
                                            </span>
                                            &#x1f321;&#xfe0f; ${hourlyData["temperature_2m"][i]}&deg;C
                                            <br>
                                            &#x1f327;&#xfe0f; ${hourlyData["rain"][i]}%
                                            <br>
                                            &#x1f4a7; ${hourlyData["relative_humidity_2m"][i]}%
                                            <br>
                                            &#x2601;&#xfe0f; ${hourlyData["cloud_cover"][i]}%
                                            <br>
                                            &#x2600;&#xfe0f; ${hourlyData["uv_index"][i]}
                                        </a>
                                    `;
                            }
                            id(`window-${windowID}-weather-boxes`).innerHTML = generated;
                            id(`window-${windowID}-weather-loading`).style.display = "none";
                            id(`window-${windowID}-weather-has-location`).style.display = "block";
                            id(`window-${windowID}-weather-boxes`).scrollLeft = id(`window-${windowID}-weather-boxes`).offsetWidth * 3;
                        }

                            getLocationInfo();
                            break;

                    }
                }
            }
        )

    }

    //endregion

    //region ──────────            add the apps            ──────────

    this.apps = {...this.apps, ...coreUtilities, ...coreApps};

    //endregion

    //endregion

    //region ━━━━━━━━━━━━━━━           BSOD           ━━━━━━━━━━━━━━━

    //region ──────────           bsod function            ──────────

        function bsod(text, givenOptions) {

            const defaultOptions = {
                "js_error": false,
                "fatal": false
            };
            const options = {...defaultOptions, ...givenOptions};

            id("bsod").style.display = "block";
            id("bsod-type").innerText = options["js_error"] ? "JavaScript" : "Induced";
            id("bsod-error").innerText = text;

            if (options["fatal"]) {
                id("bsod-ignore").style.display = "none";
                id("bsod-fatal-text").style.display = "block";
            } else {
                onclick("bsod-ignore", ignoreBsod);
            }
            onclick("bsod-restart", () => {
                saveData();
                window.location.reload();
            });

        }

        function ignoreBsod() {
            id("bsod").style.display = "none";
        }

    //endregion

    //region ──────────          js error handler          ──────────

        function addJSErrorHandler() {
            window.addEventListener("error", (message) => {
                bsod(message.message, {"js_error": true});
            });
        }

    //endregion

    //endregion

    //region ━━━━━━━━━━━━━━━       QUIT SCREEN        ━━━━━━━━━━━━━━━

    //region ──────────            message data            ──────────

        const quitActionText = {
            "logout": {
                "text": "log out of Acrylic",
                "button": "Log out",
                "quitting": "Logging out..."
            },
            "reload": {
                "text": "reload Acrylic",
                "button": "Reload",
                "quitting": "Reloading..."
            },
            "quit": {
                "text": "quit Acrylic",
                "button": "Quit",
                "quitting": "Quitting..."
            },
            "reset": {
                "text": "reset all data in Acrylic",
                "button": "Reset",
                "quitting": "Resetting..."
            },
            "kill_core_process": {
                "text": "kill the Acrylic core process",
                "button": "Kill",
                "quitting": "Killing..."
            }
        };

    //endregion

    //region ──────────           quit functions           ──────────

        let quitAction;

        function quit(action) {
            quitAction = action;
            id("quitscreen").style.display = "block";
            id("quit-areyousure").style.display = "block";
            id("quit-areyousure-action").innerText = quitActionText[action]["text"];
            id("quit-areyousure-button").innerText = quitActionText[action]["button"];
        }

        function continueQuit() {
            id("quit-areyousure").style.display = "none";
            id("quit-quitting").style.display = "block";
            id("quit-quitting").innerText = quitActionText[quitAction]["quitting"];
            setTimeout(() => {
                id("quit-quitting").style.display = "none";
                switch (quitAction) {

                    case "logout":
                        sessionStorage.removeItem("username");
                        sessionStorage.removeItem("password");
                        window.location.reload();
                        break;

                    case "reload":
                        window.location.reload();
                        break;

                    case "quit":
                        id("quit-done").style.display = "block";
                        break;

                    case "reset":
                        localStorage.clear();
                        sessionStorage.clear();
                        window.location.reload();
                        break;

                    case "kill_core_process":
                        bsod("Acrylic core process killed", {"fatal": true});
                        break;

                }
            }, 500);
        }

        function cancelQuit() {
            id("quitscreen").style.display = "none";
            id("quit-areyousure").style.display = "none";
        }

    //endregion

    //endregion

}

acr.boot();