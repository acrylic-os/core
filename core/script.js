"use strict";
/*
    Acrylic is (c) Anpang 2024 - 2025
    https://github.com/acrylic-os/core
*/

let acr = new function() {


    // #region ━ FUNCTIONS/CONSTANTS

    // #region ─ constants

        this.version = "0.2.1";
        this.versionDate = "12 Sep 2025";
        let dataVersion = 1;

        this.codename = "m(y)ewh₁";
        this.codenamePage = "m(y)ewh₁-";

        const dayNames = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];
        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];

    // #endregion

    // #region ─ DOM shorthand functions

        function id(name) {
            return document.getElementById(name);
        }
        function onclick(id, action) {
            document.getElementById(id).addEventListener("click", action);
        }
        function append(id, html) {
            document.getElementById(id).insertAdjacentHTML("beforeend", html);
        }

        const domShorthandFunctions = `
            function id(name) {
                return document.getElementById(name);
            }
            function onclick(id, action) {
                document.getElementById(id).addEventListener("click", action);
            }
            function append(id, html) {
                document.getElementById(id).insertAdjacentHTML("beforeend", html);
            }
        `;
        // prepended to the code of extensions

    // #endregion

    // #region ─ other functions

        // pad zeros at the start of a number
        function pad(number, length) {
            return String(number).padStart(length, "0");
        }

        // random number generators
        function randomFloat(min, max) {
            return Math.random() * (max - min) + min;
        }
        function randomInt(min, max) {
            return Math.floor(randomFloat(min, max));
        }

        // damerau-levenshtein distance
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

    // #endregion

    // #region ─ basic classes

        class Vector2{
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            toArray() {
                return [this.x, this.y];
            }
        }
        class Vector3{
            constructor(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
            toArray() {
                return [this.x, this.y, this.z];
            }
        }

    // #endregion

    // #region ─ mouse down

        let mouseDown = false;

        document.body.addEventListener("mousedown", () => {
            mouseDown = true;
        });
        document.body.addEventListener("mouseup", () => {
            mouseDown = false;
        });

    // #endregion

    // #endregion

    
    // #region ━ BOOT

    // #region ─ logging

    this.logs = [];
    let startTime = window.performance.now();

    // print an initial piece of text into the JS console
    function initializeLogging() {

        // plain version of main text
        const plainText = `Acrylic ${acr.version}`;

        // generate colored version of main text
        let coloredText = "\n";
        let coloredStyles = [];
        for(let i = 0; i < plainText.length; ++i) {
            coloredText += `%c${plainText.charAt(i)}`;
            coloredStyles.push(`color: ${randomAcrylicColor()}; font-size: 1.5em; font-weight: bold`);
        }

        // subtitle text and margin
        coloredText += "\n%cHi there! This is where Acrylic will log stuff. You can also run JS commands here.%c\n\n";
        coloredStyles.push("margin-top: 0.5em", "");

        // log it
        console.log(coloredText, ...coloredStyles);

    }

    // log colors
    const logColors = {
        "info": "#a8cfff",
        "warn": "#ffe1a8",
        "error": "#ffa8a8",
        "done": "#b4ffa8"
    };

    // actual log function
    function log(type, text, zeroTime = false) {

        // get time
        let time;
        if(zeroTime) {    // first log, so use 0
            time = (0).toFixed(6);
        } else {    // not the first log, so use the actual time
            time = ((window.performance.now() / 1000) - (startTime / 1000)).toFixed(4);
        }

        // make log text
        const logContent = `%c[${time}] [${type}] ${text}`;

        // put it
        acr.logs.push([logContent, logColors[type]]);
        console.log(logContent, `color: ${logColors[type]}`);

        // notify instances of the logs app (implement as a hook later when hooks are added)
        for(const [PID, process] of Object.entries(acr.processes)) {
            if(process.app === "logs" && process.storage.initialized) {
                process.action("update");
            }
        }

    }

    // #endregion

    // #region ─ boot function

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

        log("info", "Started runBoot()");

        // spawn acrylic core process
        new acr.Process("Acrylic core", "acrylic");

        // get/make config
        if (!localStorage.hasOwnProperty(`${dataVersion}-config`)) {
            localStorage.setItem(`${dataVersion}-config`, JSON.stringify({
                "setup": false
            }));
        }
        config = JSON.parse(localStorage.getItem(`${dataVersion}-config`));

        // get/make files
        if(localStorage.hasOwnProperty(`${dataVersion}-files`)) {
            files = deserializeInode(localStorage.getItem(`${dataVersion}-files`), true);
        }

        log("done", "Loaded config and files");

        // progress safe mode
        if(getGlobalConfig("safe_mode") === "activated") {
            setGlobalConfig("safe_mode", "active");
        } else if(getGlobalConfig("safe_mode") === "active") {
            setGlobalConfig("safe_mode", "disabled");
        }

        // load default theme
        if(getGlobalConfig("setup")) {
            if(getGlobalConfig("default_theme") != "") {    // no default theme set
                loadExtension(getGlobalConfig("default_theme"));
            }
        } else {    // hasn't been setup yet
            loadExtension("../extensions/default");
        }

        // wayback machine warning
        if(window.location.hostname === "web.archive.org") {
            acr.spawnPopup(
                "warning",
                "You are using Acrylic on the Wayback Machine. The Wayback Machine messes with a lot of stuff, so many things simply will not work.",
                {
                    "Continue anyways": (process) => {
                        process.kill();
                    },
                    "Go to current Acrylic": () => {
                        window.location.replace("https://acrylic.anpang.lol/stable/")
                    }
                }
            )
        }

        // add error handler
        addJSErrorHandler();

        // bind quit buttons
        onclick("quit-areyousure-button", continueQuit);
        onclick("quit-areyousure-cancel", cancelQuit);

        // hide bootscreen
        hideBootScreen();

        log("done", "Finished runBoot()");

    }

    // #endregion

    // #region ─ other functions

        // save config and files to localStorage
        function saveData() {
            localStorage.setItem(`${dataVersion}-config`, JSON.stringify(config));
            localStorage.setItem(`${dataVersion}-files`, JSON.stringify(files));
        }

        // generate a random acrylic-themed color (used in the bootscreen and initial log message)
        function randomAcrylicColor() {
            return `hsl(${randomFloat(40, 280)}deg 100% ${randomFloat(60, 90)}%)`
        }

    // #endregion

    // #region ─ bootscreen

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
                        log("done", "Finished boot, showing login screen");
                        showLoginScreen();
                    } else {
                        log("done", "Finished boot, showing setup screen");
                        showSetup();
                    }

                }
            }, 10);

        }

    // #endregion

    // #endregion


    // #region ━ FILESYSTEM/CONFIGS

    // #region ─ filesystem classes

    // basic inode
    class Inode{

        // constructor
        constructor(path, description, owner) {

            // basic file info
            this.path = path;
            this.description = description;
            this.owner = owner;
            this.name = path.split("/").slice(-1)[0];
            
            // set both dates to now
            this.lastAccessed = Date.now();
            this.lastModified = Date.now();

        }

        // serialize
        toJSON() {
            this["!type"] = this.constructor.name;
            return this;
        }

        // copy
        copy(newPath) {

            // get folder and name of new path
            let newPathFolder = newPath.split("/");
            let newPathName = newPathFolder.pop();
            newPathFolder = newPathFolder.join("/");

            // copy to there
            let newLocation = getInode(newPathFolder);
            let newObject = Object.assign({}, this);
            newObject.path = newPath;
            newLocation.contents[newPathName] = newObject;

            saveData();

        }

        // delete
        delete() {

            // todo: using eval is dirty so find a better solution

            let splitted = this.path.split("/");
            splitted.shift();
            const statement = `delete files.contents["${splitted.join(`"].contents["`)}"]`;
            eval(statement);

            saveData();

        }

        // move (shorthand for copy then delete)
        move(newPath) {
            this.copy(newPath);
            this.delete();
        }

        // set dates
        setDates(accessed, modified, booting) {

            if(accessed) {
                this.lastAccessed = accessed;
            }
            if(modified) {
                this.lastModified = modified;
            }

            if(!booting) {
                saveData();
            }
            // before 0.2.0-b33, the filesystem would often become undefined because it was saving the data when the filesystem wasn't loaded
            // this booting parameter flows down from the deserializeInode() in runBoot() to here, where it prevents saving the filesystem and making it undefined

        }

    }

    // files
    class File extends Inode{

        // constructor
        constructor(path, description, owner, content) {
            super(path, description, owner);
            this.content = content;
        }

        // read/write file
        read() {
            return this.content;
        }
        write(content) {
            this.content = content;
            saveData();
        }

    }

    // folders
    class Folder extends Inode{

        // constructor
        constructor(path, description, owner, contents) {
            super(path, description, owner);
            this.contents = contents;
        }

    }

    // symlinks
    class Symlink extends Inode{

        // constructor
        constructor(path, description, owner, target) {
            super(path);
            super(description);
            super(owner);
            this.target = target;
        }

        // read/write (does it with the target file)
        read() {
            const file = getInode(target);
            return file.read();
        }
        write(content) {
            let file = getInode(target);
            return file.write(content);
        }

    }

    // nonexistent inodes
    class NonexistentInode extends Inode{

        // constructor
        constructor(path) {
            super(path);
            this.name = path.split("/").slice(-1)[0];
            this.parentObject = getInode(this.path.split("/").slice(0, -1).join("/"));
        }

        // replace with actual inode objects
        putFile(description, owner, content) {
            this.parentObject.contents[this.name] = new File(this.path, description, owner, content);
            saveData();
        }
        putFolder(description, owner, contents) {
            this.parentObject.contents[this.name] = new Folder(this.path, description, owner, contents);
            saveData();
        }
        putSymlink(description, owner, target) {
            this.parentObject.contents[this.name] = new Symlink(this.path, description, owner, target);
            saveData();
        }

        // override methods
        copy() {
            log("error", `Attempted to copy ${this.path}, but it is a nonexistent inode`);
        }
        delete() {
            log("error", `Attempted to delete ${this.path}, but it is a nonexistent inode`);
        }
        move() {
            log("error", `Attempted to move ${this.path}, but it is a nonexistent inode`);
        }
        setDates() {
            log("error", `Attempted to set dates to ${this.path}, but it is a nonexistent inode`);
        }

    }

    // #endregion

    // #region ─ internal filesystem functions

    let files;

    // remove initial double slash from paths
    function rds(path) {
        if(path.startsWith("//")) {
            path = path.replace("//", "/");
        }
        return path;
    }

    // initial filesystem for new users
    function getInitialFilesystem(user) {

        // make root and admin's home folder
        let filesystem = new Folder(
            "/", "The root of the Acrylic filesystem.", "admin",
            {
                "README.md": new File("/README.md", "Some explaining to do here", "admin", "Welcome!"),
                "acrylic": new Folder("/acrylic", "Files for Acrylic itself", "admin", {}),
                "apps": new Folder("/apps", "System-wide files for apps", "admin", {}),
                "cache": new Folder("/cache", "System cache", "admin", {}),
                "users": new Folder("/users", "Users' personal files", "admin", {
                    "admin": new Folder("/users/admin", "The admin's home directory", "admin", {})
                })
            }
        );

        // make home folders
        const homeFolders = ["Documents", "Downloads", "Images", "Sounds", "Videos", "Trash"];
        let finishedHomeFolders = {};
        for(const homeFolder of homeFolders) {
            finishedHomeFolders[homeFolder] = new Folder(
                `/users/${user}/${homeFolder}`,
                `${user}'s ${homeFolder.toLowerCase()} folder`,
                user,
                {}
            );
        }

        // put user's home folder
        filesystem.contents["users"].contents[user] = new Folder(
            `/users/${user}`, `${user}'s home directory`, user, finishedHomeFolders
        );

        return filesystem;

    }

    // get the Inode-derived object from the path
    function getInode(path) {

        // add / if not in input
        if(path.charAt(0) !== "/") {
            path = `/${path}`;
        }

        // return root if /
        if(path === "/") {
            return files;
        }

        // split path
        let splitted = path.split("/");
        splitted.shift();

        // go through filesystem
        let currentObject = files;
        for(const part of splitted) {
            switch(currentObject.constructor.name) {

                // file, can't go any deeper so return it
                case "File":
                    return currentObject;
                
                // folder
                case "Folder":
                    if(part in currentObject.contents) {
                        // next part exists, go into it
                        currentObject = currentObject.contents[part];
                    } else {
                        // doesn't exist, return NonexistentInode
                        return new NonexistentInode(rds(`${currentObject.path}/${part}`));
                    }
                    break;
                
                // symlink, return target
                case "Symlink":
                    return getInode(currentObject.target);

            }

        }


        return currentObject;
    }

    // deserialize
    function deserializeInode(serialized, booting=false) {
        let deserialized = JSON.parse(serialized);
        deserialized = classifyInode(deserialized, booting);
        return deserialized;
    }
    function classifyInode(inode, booting=false) {    // turn an object into one of the Inode classes
        let done;

        // make object with basic values
        switch(inode["!type"]) {

            case "File":
                done = new File(inode.path, inode.description, inode.owner, inode.content);
                break;

            case "Folder":
                
                // recursively classify contents
                let classifiedContents = {};
                for(const [name, innerInode] of Object.entries(inode.contents)) {
                    classifiedContents[name] = classifyInode(innerInode, booting);
                }

                done = new Folder(inode.path, inode.description, inode.owner, classifiedContents);
                break;

            case "Symlink":
                done = new Symlink(inode.path, inode.description, inode.owner, inode.target);
                break;
                
        }

        // set date
        done.setDates(inode.lastAccessed, inode.lastModified, booting);

        return done;

    }

    // #endregion

    // #region ─ file picker function

    function openFilePicker(actionText="Select") {
        return new Promise((resolve) => {
            let process = acr.apps["file-picker"].launch({
                "actionText": actionText
            });
            process.storage["completion"] = (pickedPath) => {
                resolve(getInode(pickedPath));
                // returns an inode object, not a path
            };
        })
    }

    // #endregion
    
    // #region ─ config data

        let config = {};

        // wallpapers
        const defaultWallpapers = [
            "assets/wallpapers/acrylic.png",
            "assets/wallpapers/baltic_sea.jpg",
            "assets/wallpapers/cosmos.jpg",
            "assets/wallpapers/rocinha.jpg"
        ];
        const wallpaperNames = {
            "assets/wallpapers/acrylic.png": "Acrylic",
            "assets/wallpapers/baltic_sea.jpg": "Baltic sea",
            "assets/wallpapers/cosmos.jpg": "Cosmos",
            "assets/wallpapers/rocinha.jpg": "Rocinha"
        };
        const noUserWallpaper = defaultWallpapers[0];
            // wallpaper used when there's no user (setup, login, etc.)

        // default configs
        const defaultGlobalConfigs = {

            "default_theme": "../extensions/default",
            "safe_mode": "disabled"

        };
        const defaultUserConfigs = {

            // time
            "time_format": 0,

            // appearance
            "transparent_topbar": false,
            "darken_wallpaper": true,

            // behavior
            "fullscreen_overlay": false,

            // effects
            "animations": true,
            "click_confetti": false,
            "blue_rectangle": true,

            // extensions
            "extensions": []

        };

    // #endregion

    // #region ─ config functions

        // get/set global config
        function getGlobalConfig(configName) {
            try {
                const configValue = config[configName];
                if (configValue === undefined) {
                    return defaultGlobalConfigs[configName];
                }
                return configValue;
            } catch (error) {
                return defaultGlobalConfigs[configName];
            }
        }
        function setGlobalConfig(configName, newValue) {
            config[configName] = newValue;
            saveData();
            log("done", `Global config ${configName} set to ${newValue}`);
        }

        // get/set user config
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
            log("done", `User config ${configName} set to ${newValue}`);
        }

    // #endregion

    // #endregion


    // #region ━ PROCESSES/APPS

    // #region ─ process management

        let currentPID = -1;
        this.processes = {};

        this.Process = class{

            // create a new process
            constructor(name, app, parent = null, type = null, additionalData = null) {

                // set values
                this.name = name;
                this.app = app;
                this.parent = parent;
                this.type = type;
                this.additionalData = additionalData ? additionalData : {};
                this.storage = {};

                // increment and set PID
                ++currentPID;
                this.PID = currentPID;

                // add to processes
                acr.processes[currentPID] = this;

                // change dock
                regenerateDock();

                log("done", `New process of ${this.app} named "${this.name}" launched with PID ${this.PID}`);

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

                // check if there's a kill step
                if ("kill" in acr.apps[acr.processes[this.PID]["app"]]) {
                    acr.apps[acr.processes[this.PID]["app"]]["kill"](this);
                }

                // delete any windows of the process
                if (this.PID in windows) {

                    delete windows[this.PID];

                    id(`window-${this.PID}`).classList.add("window-animation-close");
                    setTimeout(() => {
                        id(`window-${this.PID}`).remove();
                    }, getAnimationDelay("window-close"));

                    if (selectedWindow === this.PID) {    // the window was the selected window
                        selectedWindow = undefined;
                    }

                }

                // self-destruct
                delete acr.processes[this.PID];

                // change dock
                regenerateDock();

                log("done", `Killed process ${this.app} with PID ${this.PID}`);

            }

        }

    // #endregion

    // #region ─ app management

        this.apps = {};

        // this App class represents an app, not an instance of an app (that's just Process)
        this.App = class{

            // register a new app
            constructor(id, info, steps) {

                // set values
                this.id = id;
                this.display = info.display;
                this.type = info.type;
                this.category = info.category;
                this.utility = ("utility" in info)? info.utility:false;
                this.icon = "icon" in info? info.icon: "../../iconol/square_question.svg";
                this.run = "run" in steps? steps.run: function() {};
                this.action = "action" in steps? steps.action: function() {};
                this.kill = "kill" in steps? steps.kill: function() {};

            }

            // launch a new instance of the app
            launch(additionalData) {
                let process = new acr.Process(this.display, this.id, null, this.type, additionalData);
                this.run(process);
                log("done", `App ${this.id} launched`);
                return process;
            }

        }


    // #endregion

    // #region ─ core process app

    this.apps["acrylic"] = new this.App(
        "acrylic",
        {
            "display": "Acrylic core",
            "type": "none",
            "category": "none"
        },
        {
            "run": () => {
                error("There's obviously already an Acrylic core process. Why the hell would you want to spawn another one?");
            }
        }
    );

    // #endregion

    // #endregion


    // #region ━ SETUP/LOGIN

    // #region ─ show login screen

        let user;
        let skippedLogin;

        function showLoginScreen() {

            // check if there's existing session login data
            if (sessionStorage.getItem(`${dataVersion}-username`) === null) {
                skippedLogin = false;
            } else {
                skippedLogin = true;
                user = sessionStorage.getItem(`${dataVersion}-username`);
                showDesktop();
                return;
            }

            // add eventlisteners
            onclick("loginbox-login", () => {
                login(id("loginbox-username").value, id("loginbox-password").value);
            });
            onclick("loginbox-create", () => {
                error("Account creation is currently not implemented yet.");
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

    // #endregion

    // #region ─ login function

        function login(username, password) {
            if (username in config["users"]) {
                if (config["users"][username].password === password) {
                    user = username;
                    sessionStorage.setItem(`${dataVersion}-username`, username);
                    sessionStorage.setItem(`${dataVersion}-password`, password);
                    showDesktop();
                } else {
                    error("Incorrect password.");
                }
            } else {
                error("User doesn't exist.");
            }
        }

    // #endregion

    // #region ─ show setup

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

    // #endregion

    // #region ─ setup stages

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
                        error("Importing data not implemented");
                    });
                    break;


                case 2:
                    onclick("setup-2-create", () => {

                        // set user
                        let users = {};
                        users[id("setup-2-username").value] = {
                            "display_name": id("setup-2-username").value,
                            "password": id("setup-2-password").value
                        };
                        config["users"] = users;

                        // make filesystem
                        user = id("setup-2-username").value;
                        files = getInitialFilesystem(user);

                        // make extension list
                        let coreExtensionPaths = [];
                        for(const ID of coreExtensions) {
                            coreExtensionPaths.push(`../extensions/${ID}`);
                        }
                        config["users"][user]["extensions"] = coreExtensionPaths;

                        showSetupStage(3);
                    });
                    onclick("setup-2-back", () => {
                        showSetupStage(1);
                    })
                    break;


                case 3:

                    let selectedWallpaper = noUserWallpaper;
                    id("setup-3-selected-wallpaper").innerText = wallpaperNames[selectedWallpaper];

                    // put wallpaper options
                    id("setup-3-number-wallpapers").innerText = defaultWallpapers.length;
                    for(const wallpaper of defaultWallpapers) {
                        append("setup-3-wallpapers", `
                            <button id="setup-3-wallpapers-${wallpaper}">
                                <img src="${wallpaper}"></img>
                                <br>
                                <span class="subtitle">${wallpaperNames[wallpaper]}</span>
                            </button>
                        `);
                        onclick(`setup-3-wallpapers-${wallpaper}`, () => {
                            selectedWallpaper = wallpaper;
                            id("setup-3-selected-wallpaper").innerText = wallpaperNames[selectedWallpaper];
                        });
                    }
                    
                    onclick("setup-3-continue", () => {
                        config["users"][user]["wallpaper"] = selectedWallpaper;
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

    // #endregion

    // #endregion


    // #region ━ DESKTOP

    // #region ─ show desktop

        function setDesktopWallpaper() {
            id("desktop").style.backgroundImage = `url(${getUserConfig("wallpaper")})`;
        }

        function showDesktop() {

            // fullscreen
            registerFullscreen();

            // set wallpaper
            setDesktopWallpaper();

            // load extensions
            for(const extensionPath of getUserConfig("extensions")) {
                if(extensionPath == getGlobalConfig("default_theme")) {    // no need to load the default theme again
                    continue;
                }
                loadExtension(extensionPath);
            }

            // warning popup if no theme extension is installed
            setTimeout(() => {
                let hasThemeExtension = false;
                for(const extensionInfo of Object.values(acr.extensionInfos)) {
                    if(extensionInfo.type == "theme") {
                        hasThemeExtension = true;
                        break;
                    }
                }
                if(!hasThemeExtension) {
                    spawnPopup(
                        "warning",
                        `
                            You are using Acrylic without a theme.
                            <br>
                            Make sure to install a theme to make Acrylic actually look good.    
                        `,
                        {
                            "Ignore": (process) => {
                                process.kill();
                            },
                            "Go to Settings": () => {
                                let process = acr.apps["settings"].launch();
                                process.action("switch_tab", {"tab": "extensions"});
                            }
                        }
                    );                
                }
            }, 1000);
                // delayed by 1 second because if it was run directly after loading extensions, sometimes not all extensions would've been loaded

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

            // put context menu
            contextMenu("desktop-click", [
                {
                    "type": "button",
                    "text": "Settings",
                    "run": () => {
                        acr.apps["settings"].launch();
                    }
                }
            ]);

            // bind start button
            onclick("start-button", toggleStart);

            // enable keyboard shortcuts
            enableDesktopShortcuts();

            // enable configs
            if(getUserConfig("click_confetti")) {
                enableClickConfetti();
            }
            if(getUserConfig("blue_rectangle")) {
                enableBlueRectangle();
            }
            if(getUserConfig("animations")) {
                document.body.classList.add("animations");
            }
            if(getUserConfig("transparent_topbar")) {
                id("topbar").classList.add("topbar-transparent");
            }
            if(getUserConfig("darken_wallpaper")) {
                id("desktop").classList.add("darken-wallpaper");
            }

            log("done", "Desktop setup complete");

        }

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

    // #endregion

    // #region ─ searchbar

        const searchTypeNames = {
            "app": "App"
        };

        class searchMatch{

            // constructor
            constructor(type, ID, name, searchTerm) {

                this.type = type;
                this.ID = ID;
                this.name = name;
                this.score = this.calculateScore(searchTerm);

            }

            // calculate the score of the name with a search term
            calculateScore(searchTerm) {

                // lowercase versions of name and term
                const lowerName = this.name.toLowerCase();
                const lowerTerm = searchTerm.toLowerCase();

                // calculate score
                const damerauLevenshteinScore = damerauLevenshtein(lowerName, lowerTerm, "ratio") / 2;
                const substringScore = (lowerName.includes(lowerTerm) || lowerTerm.includes(lowerName))? 0.5: 0;

                return damerauLevenshteinScore + substringScore;

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

                let matchText;
                if(match.score === 100) {
                    matchText = "Exact match";
                } else {
                    matchText = `${Math.round(match.score * 100)}% match`;
                }

                append("searchmenu", `
                    <button class="searchentry" id="searchentry-${match.ID}">
                        <img src="${acr.apps[match.ID.substring(4)].icon}" alt="${match.name}" class="searchentry-icon" />
                        <span class="searchentry-name">${match.name}</span>
                        <span class="searchentry-type">${searchTypeNames[match.type]}</span>
                        <span class="searchentry-match">${matchText}</span>
                        <span class="searchentry-offset"></span>
                    </button>
                `);

                id(`searchentry-${match.ID}`).addEventListener("click", () => {

                    const split = match.ID.split(":");

                    // action
                    switch(split[0]) {
                        case "app":
                            acr.apps[split[1]].launch();
                            break;
                    }

                    // hide
                    id("searchmenu").style.display = "none";

                });
            }

            // show menu
            id("searchmenu").style.display = "block";

        }

    // #endregion

    // #region ─ time

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

    // #endregion

    // #region ─ dock

        function regenerateDock() {

            // generate list of icons to show
            let icons = {}
            for(const [PID, processInfo] of Object.entries(acr.processes)) {
                if(PID == 0) {    // core process
                    continue;
                }
                if(icons.hasOwnProperty(processInfo.app)) {    // icon already exists for app
                    icons[processInfo.app].push(PID);
                } else {    // app doesn't have icon yet
                    icons[processInfo.app] = [PID];
                }
            }

            // show the icons
            id("dock-apps").innerHTML = "";
            for(const [app, PIDs] of Object.entries(icons)) {
                append("dock-apps", `
                    <a
                        href="#" class="dock-app" id="dock-app-${app}"
                        style='background-image: url("${acr.apps[app].icon}")'
                    ></a>
                `);
                onclick(`dock-app-${app}`, () => {
                    dockClick(app, PIDs);
                });
            }

            log("done", "Dock regenerated");

        }

        // when a dock button is clicked
        function dockClick(app, PIDs) {
            for(const PID of PIDs) {

                // window minimized, so unminimize it
                if(!windows[PID].shown) {
                    windows[PID].unminimize();
                    continue;
                }
                
            }
        }

    // #endregion

    // #region ─ start menu

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
                }, getAnimationDelay("startmenu-close"));

                startOpened = false;
                log("done", "Start menu closed");

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
                },getAnimationDelay("startmenu-open"));

                startOpened = true;
                log("done", "Start menu opened");

            }

        }

    // switch category

        let startSelectedCategory = "favorites";
        let appTileID = 0;

        function startSwitchCategory(category) {

            // select new selected category
            id(`startmenu-category-${startSelectedCategory}`).classList.remove("startmenu-category-selected");
            id(`startmenu-category-${category}`).classList.add("startmenu-category-selected");
            startSelectedCategory = category;

            // show apps
            let sortedApps = Object.keys(acr.apps).sort();
            let appData;

            id("startmenu-apps").innerHTML = "";
            for (const app of sortedApps) {

                appData = acr.apps[app];

                // check if app in selected category
                if ("category" in appData) {
                    if (appData["category"] === category) {

                        // don't show if app is a utility
                        if(appData.utility) {
                            continue;
                        }

                        // put tile
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

    // #endregion

    // #region ─ click confetti

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

    // #endregion

    // #region ─ blue rectangle

        let blueRectangleOrigin;
        let blueRectangleOn = false;

        function blueRectangleShow(event) {
            if (mouseDown && !blueRectangleOn) {
                blueRectangleOrigin = new Vector2(event.clientX, event.clientY);
                id("bluerectangle").style.top = `${blueRectangleOrigin.y}px`;
                id("bluerectangle").style.left = `${blueRectangleOrigin.x}px`;
                id("bluerectangle").style.width = "0";
                id("bluerectangle").style.height = "0";
                id("bluerectangle").style.display = "block";
                blueRectangleOn = true;
            }
        }
        function blueRectangleMove(event) {
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
        }
        function blueRectangleHide() {
            id("bluerectangle").style.display = "none";
            blueRectangleOn = false;
        }

        function enableBlueRectangle() {
            id("desktop-click").addEventListener("mousemove", blueRectangleShow);
            id("desktop").addEventListener("mousemove", blueRectangleMove);
            id("desktop").addEventListener("mouseup", blueRectangleHide);
        }
        function disableBlueRectangle() {
            id("desktop-click").removeEventListener("mousemove", blueRectangleShow);
            id("desktop").removeEventListener("mousemove", blueRectangleMove);
            id("desktop").removeEventListener("mouseup", blueRectangleHide);
        }

    // #endregion

    // #region ─ context menu
        
        // add context menu
        function contextMenu(elementID, elements) {
            id(elementID).addEventListener("contextmenu", (event) => {

                // show and position context menu
                id("contextmenu").style.left = `${event.clientX}px`;
                id("contextmenu").style.top = `${event.clientY}px`;
                id("contextmenu").style.display = "block";

                // put elements
                let i = 0;
                id("contextmenu").innerHTML = "";
                for(const element of elements) {
                    switch(element.type) {

                        // button
                        case "button":
                            append("contextmenu", `
                                <button id="contextmenu-${i}">${element.text}</button>
                            `);
                            onclick(`contextmenu-${i}`, element.run);
                            break;

                        // divider
                        case "divider":
                            append("contextmenu", `
                                <hr id="contextmenu-${i}">
                            `);
                            break;

                        // checkbox
                        case "checkbox":
                            append("contextmenu", `
                                <div id="contextmenu-${i}">
                                    <input type="checkbox" id="contextmenu-${i}-checkbox" ${element.checked? "checked":""}></input>
                                    ${element.text}
                                </div>
                            `);
                            onclick(`contextmenu-${i}-checkbox`, function(event, i) {
                                event.stopPropagation();
                                const newValue = id(`contextmenu-${i}-checkbox`).checked;
                                element.run(newValue);
                            }.bind(null, event, i));
                            break;

                        // html
                        case "html":
                            append("contextmenu", `
                                <div id="contextmenu-${i}">${element.html}</div>
                            `);
                            break;

                    }
                    ++i;
                }

            })
        }

        // remove default context menu
        id("body").addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        // click anywhere = hide context menu
        onclick("body", () => {
            id("contextmenu").style.display = "none";
        });

    // #endregion

    // #endregion


    // #region ━ WINDOWING

    // #region ─ window management

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
            }, getAnimationDelay("window-open"));

            // set initial dimensions
            if(initialDimensions) {
                id(`window-${windowID}`).style.width = initialDimensions[0];
                id(`window-${windowID}`).style.height = initialDimensions[1];
            }

            // make the buttons actually do stuff
            onclick(`window-${windowID}-minimize`, () => {
                if(this.shown) {
                    this.minimize(windowID);
                } else {
                    this.unminimize(windowID);
                }
            });
            onclick(`window-${windowID}-toggle`, () => {
                if(this.maximized) {
                    this.unmaximize();
                } else {
                    this.maximize();
                }
            });
            onclick(`window-${windowID}-close`, () => {
                acr.processes[windowID].kill();
            });

            // make the window selectable and draggable
            id(`window-${windowID}-titlebar`).addEventListener("mousedown", (event) => {

                // select
                this.select();

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

            log("done", `Window ${windowID} spawned`);

        }

        // select
        select() {
            if (selectedWindow !== this.windowID) {    // if the selected window isn't this window
                id(`window-${this.windowID}`).classList.add("selected");
                if (typeof selectedWindow !== "undefined") {
                    id(`window-${selectedWindow}`).classList.remove("selected");
                }
                selectedWindow = this.windowID;
            }
            log("done", `Window ${this.windowID} selected`);
        }

        // maximize/unmaximize
        maximize() {
            windows[this.windowID]["maximized"] = true;
            id(`window-${this.windowID}`).classList.add("maximized");
            windows[this.windowID]["leftStyle"] = id(`window-${this.windowID}`).style.left;
            windows[this.windowID]["topStyle"] = id(`window-${this.windowID}`).style.top;
            id(`window-${this.windowID}`).removeAttribute("style");
            log("done", `Window ${this.windowID} maximized`);
        }
        unmaximize() {
            windows[this.windowID]["maximized"] = false;
            id(`window-${this.windowID}`).classList.remove("maximized");
            id(`window-${this.windowID}`).classList.add("unmaximized");
            setTimeout(() => {
                id(`window-${this.windowID}`).classList.remove("unmaximized");
            }, getAnimationDelay("window-change"));
            id(`window-${this.windowID}`).style.left = windows[this.windowID]["leftStyle"];
            id(`window-${this.windowID}`).style.top = windows[this.windowID]["topStyle"];
            log("done", `Window ${this.windowID} unmaximized`);
        }

        // minimize/unminimize
        minimize() {
            id(`window-${this.windowID}`).classList.add("window-animation-close");
            setTimeout(() => {
                id(`window-${this.windowID}`).style.display = "none";
                id(`window-${this.windowID}`).classList.remove("window-animation-close");
            }, getAnimationDelay("window-change"));
            this.shown = false;
            log("done", `Window ${this.windowID} minimized`);
        }
        unminimize() {
            id(`window-${this.windowID}`).style.display = "flex";
            id(`window-${this.windowID}`).classList.add("window-animation-open");
            setTimeout(() => {
                id(`window-${this.windowID}`).classList.remove("window-animation-open");
            }, getAnimationDelay("window-change"));
            this.shown = true;
            log("done", `Window ${this.windowID} unminimized`);
        }

        // drag
        dragWindow(event) {
            if(windows[windowDragData["id"]]["maximized"]) {
                this.unmaximize(windowDragData["id"]);
            }
            id(`window-${windowDragData["id"]}`).style.left = `${event.clientX - windowDragData["xOffset"]}px`;
            id(`window-${windowDragData["id"]}`).style.top = `${event.clientY - windowDragData["yOffset"]}px`;
        }

    }

    // #endregion

    // #region ─ spawn popup

        const popupTypes = {
            "error": {
                "name": "Error",
                "icon": "iconol/circle_no.png"
            },
            "warning": {
                "name": "Warning",
                "icon": "iconol/square_?.svg"
            },
            "info": {
                "name": "Info",
                "icon": "iconol/square_?.svg"
            },
            "unknown": {
                "name": "Unknown",
                "icon": "iconol/square_?.svg"
            }
        };

        // spawn a popup
        function spawnPopup(type, content, buttons, parentProcess = 0) {
            // the parent process defaults to 0 (the acrylic core process)

            let popupProcess = new acr.Process("Popup", acr.processes[parentProcess]["app"], parentProcess);
            let popupPID = popupProcess.PID;

            new acr.Window(
                popupTypes[type]["name"],
                `
                    <div class="popup-grid">
                        <div class="popup-grid-icon" id="window-${popupPID}-popup-icon">
                            <img src="${popupTypes[type]["icon"]}" class="popup-icon">
                        </div>
                        <div class="popup-grid-content">
                            <span class="popup-content" id="window-${popupPID}-popup-content">
                                ${content}
                            </span>
                        </div>
                        <div class="popup-grid-buttons" id="window-${popupPID}-popup-buttons">
                        </div>
                    </div>
                `,
                popupProcess, ["24em", "12em"]
            );

            let i = 0;
            for (const [buttonText, buttonAction] of Object.entries(buttons)) {
                append(`window-${popupPID}-popup-buttons`, `
                    <button class="bflat" id="window-${popupPID}-popup-buttons-${i}">${buttonText}</button>
                `);
                onclick(`window-${popupPID}-popup-buttons-${i}`, buttonAction.bind(null, popupProcess));
                ++i;
            }

            log("done", `Popup of type ${type} spawned`);

        }

        // spawn a debug popup
        function debugPopup(content) {
            spawnPopup(
                "info",
                `
                    <b>Debug information:</b>
                    <pre>${JSON.stringify(content)}</pre>
                `,
                {
                    "OK": function(process) {
                        process.kill();
                    }
                }
            );
        }

    // #endregion

    // #endregion


    // #region ━ EXTENSIONS/API

    // #region ─ extension loader

    this.extensionInfos = {};

    async function loadExtension(path) {
        
        // don't load if safemode is on
        if(getGlobalConfig("safe_mode") == "active") {
            log("info", `Attempted to load extension ${path}, but safe mode is on`);
            return;
        }

        // get info.json
        let request = await fetch(`${path}/info.json`);
        let info = await request.json();
        
        // put info in extensionInfos
        acr.extensionInfos[path] = info;

        // variables
        let text;
        let common = "";

        // load steps
        let steps = {};
        if(info.steps) {
            for(const step of info.steps) {
                request = await fetch(`${path}/steps/${step}.js`);
                text = await request.text();
                if(step === "common") {
                    common = text;
                } else {
                    steps[step] = new Function(`${domShorthandFunctions} ${common} ${text}; return ${step};`)();
                }
            }
        }

        // load hooks
        let hooks = {};
        if(info.hooks) {
            for(const hook of info.hooks) {
                request = await fetch(`${path}/hooks/${hook}.js`);
                text = await request.text();
                hooks[hook] = new Function(`${domShorthandFunctions} ${common} ${text}; return hook;`)();
            }
        }

        // load styles
        if(info.styles) {
            append("head", `
                <link rel="stylesheet" href="${path}/styles.css" id="extension-stylesheet-${path}">
            `);
        }

        // load theme.json
        if(info.type == "theme") {
            request = await fetch(`${path}/theme.json`);
            info = await request.json();
            animationDelays = info["animation-delays"];    // set animation delays
        }

        log("done", `Loaded extension ${path}`);

        // register app
        if(info.type === "app") {
            acr.apps[info.id] = new acr.App(
                info.id, info.appInfo, steps
            );
            log("done", `Registered app ${info.id}`);
        }

    }

    function unloadExtension(path) {

        const info = acr.extensionInfos[path];
        const extensionID = info.id;

        // remove app
        if("appInfo" in info) {
        
            // kill running processes
            for(const process of Object.values(acr.processes)) {
                if(process.app == extensionID) {
                    process.kill();
                }
            }

            // delete from list
            delete acr.apps[extensionID];

        }

        // remove stylesheet
        if(info.styles) {
            id(`extension-stylesheet-${path}`).remove();
        }

        // remove from extensionInfos
        delete acr.extensionInfos[path];

        log("done", `Unloaded extension ${path}`);

    }

    // #endregion

    // #region ─ expose things to acr

    // helper functions
    function getUser() {
        return user;
    }

    // functions and classes to expose to the public API so that others (extensions, devtools, ...) can use them as acr.(name)
    const exposeFunctions = [

        // utility
        isFullscreen, log, error, safeMode,

        // configs
        getUserConfig, setUserConfig, getGlobalConfig, setGlobalConfig,
        enableClickConfetti, disableClickConfetti, enableBlueRectangle, disableBlueRectangle,

        // users
        getUser,

        // filesystem
        Inode, File, Folder, Symlink,
        getInitialFilesystem, getInode, deserializeInode, rds,
        openFilePicker,
        
        // interface
        debugPopup, contextMenu,
        quit, registerFullscreen,
        spawnPopup,
        setDesktopWallpaper,

        // extensions
        loadExtension, unloadExtension

    ];

    let name;
    for(const functionObject of exposeFunctions) {
        name = typeof functionObject === "function"? functionObject.name: functionObject.constructor.name;
        this[name] = functionObject;
    }

    // #endregion

    // #region ─ core extensions

    const coreExtensions = [

        // apps
        "about", "calculator", "clock", "files", "logs", "notepad", "paint", "sandbox", "settings", "system-monitor", "terminal", "weather",

        // utilities
        "file-picker",

        // themes
        "default"

    ];

    // #endregion

    // #region ─ safe mode

    function safeMode() {
        setGlobalConfig("safe_mode", "activated");
        console.log(`
Safe mode has been activated.
On the next boot, all extensions will be disabled to help debug things.
Acrylic will restart in 3 seconds.
        `);
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    // #endregion

    // #region ─ animation delays

        const animationDelayKeys = [
            "window-open", "window-close", "window-change",
            "startmenu-open", "startmenu-close"
        ];

        let animationDelays = [];
        for(const key of animationDelayKeys) {
            animationDelays[animationDelayKeys] = 0;
        }

        function getAnimationDelay(key) {
            if(getUserConfig("animations")) {
                return animationDelays[key];
            } else {
                return 0;
            }
        }

    // #endregion

    // #endregion


    // #region ━ SPECIAL SCREENS

    // #region ─ quit message data

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

    // #endregion

    // #region ─ quit screen

        let quitAction;

        function quit(action) {
            quitAction = action;
            id("quitscreen").style.display = "block";
            id("quit-areyousure").style.display = "block";
            id("quit-areyousure-action").innerText = quitActionText[action]["text"];
            id("quit-areyousure-button").innerText = quitActionText[action]["button"];
            log("done", "Quit menu shown");
        }

        function continueQuit() {
            id("quit-areyousure").style.display = "none";
            id("quit-quitting").style.display = "block";
            id("quit-quitting").innerText = quitActionText[quitAction]["quitting"];
            setTimeout(() => {
                id("quit-quitting").style.display = "none";
                switch (quitAction) {

                    case "logout":
                        sessionStorage.removeItem(`${dataVersion}-username`);
                        sessionStorage.removeItem(`${dataVersion}-password`);
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
                        window.location.reload();
                        break;

                }
            }, 500);
        }

        function cancelQuit() {
            id("quitscreen").style.display = "none";
            id("quit-areyousure").style.display = "none";
        }

    // #endregion

    // #region ─ errors

        // log and show popup for error
        function error(content, JSerror=false) {
            log("error", content);
            spawnPopup(
                "error",
                `
                    <b>${JSerror? "A JavaScript":"An"} error occurred!</b>
                    <pre class="error-pre">${content}</pre>
                `,
                {
                    "OK": function(process) {
                        process.kill();
                    },
                    "Copy": () => {
                        navigator.clipboard.writeText(content);
                    },
                    "Restart": function() {
                        window.location.reload();
                    }
                }
            );
        }

        // JS error handler
        function addJSErrorHandler() {
            window.addEventListener("error", (message) => {
                error(message.message, true);
            });
        }

    // #endregion

    // #region ─ fullscreen

    function isFullscreen() {
        const userFullscreen = (screen.width === window.outerWidth) && (screen.height === window.outerHeight);
        const jsFullscreen = document.fullscreenElement != null;
        return userFullscreen || jsFullscreen;
    }

    function registerFullscreen() {

        if(getUserConfig("fullscreen_overlay") === false) {    // fullscreen overlay disabled
            return;
        }

        checkFullscreen();
        window.addEventListener("resize", checkFullscreen);
        window.addEventListener("fullscreenchange", checkFullscreen);

        onclick("fullscreen", () => {
            document.body.requestFullscreen();
            hideFullscreenPopup();
        });
        onclick("fullscreen-cancel", hideFullscreenPopup);

        log("done", "Fullscreen overlay shown");

    }

    let fullscreenExempted = false;

    function checkFullscreen() {
        if(!fullscreenExempted) {
            if(isFullscreen()) {
                hideFullscreenPopup();
            } else {
                showFullscreenPopup();
            }
        }
    }

    function showFullscreenPopup() {
        id("fullscreen").style.display = "block";
    }
    function hideFullscreenPopup(event=null) {
        id("fullscreen").style.display = "none";
        if(event) {    // activated from cancel button
            fullscreenExempted = true;
            event.stopPropagation();
        }
    }

    // #endregion

    // #endregion

    
}

acr.boot();