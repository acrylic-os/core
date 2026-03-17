
function action(process, action, data) {

    let windowID = process.PID;

    switch(action) {


        case "load":

            let query = id(`window-${windowID}-url`).value;
            try{
                new URL(query);
            } catch(error) {
                // it's not a url so make it a google search url
                query = `https://google.com/search?q=${query}`;
            }

            let content = "";
            fetch("https://acrylic-frames.anpang.lol/", {
                "method": "POST",
                "body": JSON.stringify({
                    "url": query,
                    "version": acr.version
                })
            })
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    if(!json.ok) {
                        content = `${json.status} ${json.statusText}`;
                    } else {
                        content = json.body;
                    }
                    id(`window-${windowID}-iframe`).srcdoc = content;
                });
                // we have to send the request to a server to make the request, because a request directly from the client gets blocked by cors

            break;


    }

}