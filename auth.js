let KEYS;
$.getJSON("keys.json", json => {
    KEYS = json;
});

let YOUTUBE_SECRET;
$.getJSON("youtube-secret.json", json => {
    YOUTUBE_SECRET = json;
});

export function getYouTubeClientID() {
    return YOUTUBE_SECRET.installed.client_id;
}

export function getYouTubeAPIKey() {
    return KEYS.youtube_key;
}