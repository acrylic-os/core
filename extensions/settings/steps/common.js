

const settingsData = {


    "general": {
        "options": {

            "language": {
                "type": "select",
                "options": acr.getLanguages(),
                "selected": ["global", "language"],
                "set": function (newValue) {
                    acr.setGlobalConfig("language", newValue);
                },
                "reload": true
            },

        }
    },


    "appearance": {
        "options": {

            "wallpaper": {
                "type": "select",
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
        "options": {

            "fullscreen_overlay": {
                "type": "checkbox",
                "selected": ["user", "fullscreen_overlay"],
                "set": function (newValue) {
                    acr.setUserConfig("fullscreen_overlay", newValue);
                }
            },

            "pig_latin": {
                "type": "checkbox",
                "selected": ["user", "pig-latin"],
                "set": function (newValue) {
                    acr.setUserConfig("pig-latin", newValue);
                },
                "reload": true
            },

        }
    },


    "effects": {
        "options": {

            "animations": {
                "type": "checkbox",
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
        "options": {

            "extension-load": {
                "type": "extension-load"
            },
            "extension-list": {
                "type": "extension-list"
            },

            "default_theme": {
                "type": "textbox",
                "selected": ["global", "default_theme"],
                "set": (newValue) => {
                    acr.setGlobalConfig("default_theme", newValue);
                }
            }

        }
    },


    "system": {
        "options": {

            "reset": {
                "type": "button",
                "click": () => {
                    acr.quit("reset");
                }
            }

        }
    }


};