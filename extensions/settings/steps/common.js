

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
                    "assets/wallpapers/acrylic.png": "Acrylic",
                    "assets/wallpapers/baltic_sea.jpg": "Baltic sea",
                    "assets/wallpapers/cosmos.jpg": "Cosmos",
                    "assets/wallpapers/rocinha.jpg": "Rocinha"
                },
                "selected": ["user", "wallpaper"],
                "set": function (newValue) {
                    acr.setUserConfig("wallpaper", newValue);
                    acr.setDesktopWallpaper();
                }
            },

            "transparent_topbar": {
                "type": "checkbox",
                "name": "Transparent topbar",
                "subtitle": "Make the topbar appear transparent.",
                "selected": ["user", "transparent_topbar"],
                "set": function(newValue) {
                    acr.setUserConfig("transparent_topbar", newValue);
                    if (newValue) {
                        id("topbar").classList.add("topbar-transparent");
                    } else {
                        id("topbar").classList.remove("topbar-transparent");
                    }
                }
            },

            "darken_wallpaper": {
                "type": "checkbox",
                "name": "Darken wallpaper",
                "subtitle": "Darken the wallpaper by 25%.",
                "selected": ["user", "darken_wallpaper"],
                "set": function(newValue) {
                    acr.setUserConfig("darken_wallpaper", newValue);
                    if(newValue) {
                        id("desktop").classList.add("darken-wallpaper");
                    } else {
                        id("desktop").classList.remove("darken-wallpaper");
                    }
                }
            }

        }
    },


    "behavior": {
        "name": "Behavior",
        "options": {

            "fullscreen_overlay": {
                "type": "checkbox",
                "name": "Ask to enter fullscreen",
                "subtitle": "Enable or disable the overlay that asks to become fullscreen.",
                "selected": ["user", "fullscreen_overlay"],
                "set": function (newValue) {
                    acr.setUserConfig("fullscreen_overlay", newValue);
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
                    acr.setUserConfig("click_confetti", newValue);
                    if (newValue) {
                        acr.enableClickConfetti();
                    } else {
                        acr.disableClickConfetti();
                    }
                }
            }

        }
    },


    "extensions": {
        "name": "Extensions",
        "options": {

            "extension-load": {
                "type": "extension-load"
            },
            "extension-list": {
                "type": "extension-list"
            },

            "default_theme": {
                "type": "textbox",
                "name": "Default theme",
                "placeholder": "Extension path",
                "subtitle": "The theme to use on the login screen where there is no user",
                "selected": ["global", "default_theme"],
                "set": (newValue) => {
                    acr.setGlobalConfig("default_theme", newValue);
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
                    acr.quit("reset");
                }
            }

        }
    }


};