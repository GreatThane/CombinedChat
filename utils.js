export class Platform {

    constructor(name, icon = name + ".svg") {
        this.name = name;
        this.icon = icon;
    }
}

export function addChat(platform, username, message) {
    const userlist = document.getElementById("userlist");

    const div = document.createElement('div');
    div.classList.add(platform.name, "chat");

    const img = document.createElement('img');
    img.setAttribute("src", platform.icon);
    img.setAttribute("alt", platform.name);

    const user = document.createElement('span');
    user.classList.add("username");
    user.innerText = username + ":";

    const text = document.createElement('div');
    text.classList.add("message");
    text.innerText = message;

    div.append(img, user, text);
    moveUp(userlist, getHeight(div));

    userlist.prepend(div);

    const messages = userlist.getElementsByClassName("chat");
    if (window.innerHeight - messages.item(messages.length - 1).getBoundingClientRect().bottom + getHeight(div) <= 40) {
        removeChat(messages.item(messages.length - 1));
    }

    setIntervalX(() => {
        moveDown(userlist, 1);
    }, getHeight(div));

    return div;
}

export function removeChat(chat) {
    if (chat.style.opacity !== 0) chat.style.opacity = 100;
    let speed = 1;
    setIntervalX(() => {
        moveLeft(chat, speed++);
        chat.style.opacity = chat.style.opacity - 1;
    }, chat.offsetWidth, 80, () => {
        chat.parentNode.removeChild(chat);
    });
}

export function getHeight(node) {
    if (node.offsetHeight === 0) {
        const clone = node.cloneNode(true);
        // hide the measured (cloned) element
        clone.style.opacity = "0";
        clone.style.position = "fixed";
        clone.style.top = "-9999px";
        // add the clone to the DOM
        document.body.appendChild(clone);
        // measure it
        const height = height(clone);
        // cleanup
        clone.parentNode.removeChild(clone);
        return height
    } else return height(node)
}

function height(e) {
    return e.offsetHeight + e.style.marginTop.replace("px", "") + e.style.marginBottom.replace("px", "");
}

export function moveUp(element, units, unit = "px") {
    element.style.top = element.style.top.replace(unit, "") - units + unit;
}

export function moveDown(element, units, unit = "px") {
    moveUp(element, -units, unit);
}

export function moveLeft(element, units, unit = "px") {
    element.style.left = element.style.left.replace(unit, "") - units + unit;
}

export function moveRight(element, units, unit = "px") {
    moveLeft(element, -units, unit);
}

export function setIntervalX(callback, repetitions = 1, delay = 40, terminateCallback = null) {
    let x = 0;
    const intervalID = window.setInterval(function () {

        callback();
        if (++x === repetitions) {
            if (terminateCallback != null) terminateCallback();
            window.clearInterval(intervalID);
        }
    }, delay);
}