var players;

function getContent() {
  browser.tabs.query({active: true, currentWindow: true})
    .then(send)
    .catch(error => console.log("Tab query error: " + error.data));
}

function setAlarm() {

}

function send(tabs) {
  browser.tabs.sendMessage(tabs[0].id, {command: "load"});
}

function createNotification(count) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("dark-icons/logo-48.png"),
    "title": "MZ Transfer Alarm",
    "message": "Loaded " + count + " players from shortlist."
  });
}

function populate(message) {
  players = message;
  const container = document.getElementById("container");
  container.innerHTML = "";

  for (let player of players) {
    let pdiv = document.createElement("div");
    let pname = document.createElement("span");
    let pdate = document.createElement("span");

    pname.innerText = player.name;
    pname.classList.add("name");
    pdate.innerText = player.date;
    pdate.classList.add("date");

    pdiv.classList.add("player");
    pdiv.appendChild(pname);
    pdiv.appendChild(pdate);
    container.appendChild(pdiv);
  }

  createNotification(message.length);
}

getContent();
document.getElementById("setAlarm").addEventListener("click", setAlarm);
browser.runtime.onMessage.addListener(populate);

