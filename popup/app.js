var players = [];
var alarms = [];

function setAlarm() {

}

function listener(message) {
  switch (message.type) {
    case "load-content":
      players = message.players;
      alarms = message.alarms;
      populate();
      break;
  }
}

function createNotification(count) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("dark-icons/logo-48.png"),
    "title": "MZ Transfer Alarm",
    "message": "Loaded " + count + " players from shortlist."
  });
}

function populate() {
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

browser.runtime.sendMessage({
  type: "send-content",
});

browser.runtime.onMessage.addListener(listener);

document.getElementById("setAlarm").addEventListener("click", setAlarm);
