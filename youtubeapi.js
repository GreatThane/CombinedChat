import * as auth from "./auth"
import {addChat, Platform} from "./utils";

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function () {
                console.log("Sign-in successful");
            },
            function (err) {
                console.error("Error signing in", err);
            });
}

function loadClient() {
    gapi.client.setApiKey(auth.getYouTubeAPIKey());
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () {
                console.log("GAPI client loaded for API");
            },
            function (err) {
                console.error("Error loading GAPI client for API", err);
            });
}

gapi.load("client:auth2", function () {
    gapi.auth2.init({client_id: auth.getYouTubeClientID()});
});

authenticate().then(loadClient);

let liveID = null;
let nextPage = null;
export function addYoutubeChat(conditional) {
    if (liveID == null) getBroadcast();
    const request = nextPage != null ? {"pageToken": nextPage, "liveChatId": liveID} : {"liveChatId": liveID};

    return gapi.client.youtube.liveChatMessages.list(request)
        .then(function (response) {

                nextPage = response.result.nextPageToken;
                response.result.items.forEach(t => {
                    if (!conditional(t.snippet.displayMessage)) {
                        addChat(new Platform("discord"), t.authorDetails.displayName, t.snippet.displayMessage);
                    }
                });
                console.log("Response", response);
            },
            function (err) {
                console.error("Execute error", err);
            });
}

export function getBroadcast() {
    return gapi.client.youtube.liveBroadcasts.list({})
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
}