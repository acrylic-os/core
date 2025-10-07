

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

            "topbar_style": {
                "type": "select",
                "name": "Topbar style",
                "subtitle": "The background style of the topbar.",
                "options": {
                    "solid": "Solid",
                    "transparent": "Transparent",
                    "gradient": "Gradient"
                },
                "selected": ["user", "topbar_style"],
                "set": function(newValue) {
                    id("topbar").classList.remove(`topbar-${acr.getUserConfig("topbar_style")}`);
                    acr.setUserConfig("topbar_style", newValue);
                    id("topbar").classList.add(`topbar-${newValue}`);
                }
            },

            "font_heading": {
                "type": "select",
                "name": "Heading font",
                "subtitle": "The font used for headings and the big text on the bootscreen.",
                "options": {
                    "Google Sans Code": "Google Sans Code",
                    "IBM Plex Sans": "IBM Plex Sans",
                    "IBM Plex Mono": "IBM Plex Mono",
                    "Inter": "Inter",
                    "Noto Sans": "Noto Sans",
                    "Noto Serif": "Noto Serif",
                    "Roboto": "Roboto",
                    "Roboto Mono": "Roboto Mono",
                    "Schibsted Grotesk": "Schibsted Grotesk"
                },
                "selected": ["user", "font_heading"],
                "set": function(newValue) {
                    acr.setUserConfig("font_heading", newValue);
                    acr.setFonts();
                }
            },
            "font_main": {
                "type": "select",
                "name": "Main font",
                "subtitle": "The main font used in Acrylic.",
                "options": {
                    "Google Sans Code": "Google Sans Code",
                    "IBM Plex Sans": "IBM Plex Sans",
                    "IBM Plex Mono": "IBM Plex Mono",
                    "Inter": "Inter",
                    "Noto Sans": "Noto Sans",
                    "Noto Serif": "Noto Serif",
                    "Roboto": "Roboto",
                    "Roboto Mono": "Roboto Mono",
                    "Schibsted Grotesk": "Schibsted Grotesk"
                },
                "selected": ["user", "font_main"],
                "set": function(newValue) {
                    acr.setUserConfig("font_main", newValue);
                    acr.setFonts();
                }
            },
            "font_monospace": {
                "type": "select",
                "name": "Monospace font",
                "subtitle": "The font used for code and the version text. Only monospace fonts are available.",
                "options": {
                    "Google Sans Code": "Google Sans Code",
                    "IBM Plex Mono": "IBM Plex Mono",
                    "Roboto Mono": "Roboto Mono"
                },
                "selected": ["user", "font_monospace"],
                "set": function(newValue) {
                    acr.setUserConfig("font_monospace", newValue);
                    acr.setFonts();
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

            "animations": {
                "type": "checkbox",
                "name": "Animations",
                "subtitle": "Show various animations, for example when opening a window.",
                "selected": ["user", "animations"],
                "set": function(newValue) {
                    acr.setUserConfig("animations", newValue);
                    if(newValue) {
                        document.body.classList.add("animations");
                    } else {
                        document.body.classList.remove("animations");
                    }
                }
            },

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
            },

            "blue_rectangle": {
                "type": "checkbox",
                "name": "Blue rectangle",
                "subtitle": "Makes a blue selection rectangle appear on the desktop when we drag, like the feature on Windows that we all used to play with.",
                "selected": ["user", "blue_rectangle"],
                "set": function (newValue) {
                    acr.setUserConfig("blue_rectangle", newValue);
                    if (newValue) {
                        acr.enableBlueRectangle();
                    } else {
                        acr.disableBlueRectangle();
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