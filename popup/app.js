var players = [];
var alarms = [];
const setAlarmsButton = document.querySelector("#setAlarms");
const clearAlarmsButton = document.querySelector("#clearAlarms");
setAlarmsButton.innerText = browser.i18n.getMessage("setAlarmsButton");
clearAlarmsButton.innerText = browser.i18n.getMessage("clearAlarmsButton");
document.querySelector("#playersHeader").innerText = browser.i18n.getMessage("playerName");
document.querySelector("#datesHeader").innerText = browser.i18n.getMessage("transferDeadline");

function clearAlarms(event) {
  browser.runtime.sendMessage({
    type: "clear-alarms",
  });
}

function setAlarms(event) {
  browser.runtime.sendMessage({
    type: "create-alarms",
    players: players
  });

  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/logo-48.png"),
    "title": "MZ Transfer Alarm",
    "message": browser.i18n.getMessage("createdAlarmMessage", players.length)
  });
}

function onMessage(message) {
  switch (message.type) {
    case "load-content":
      players = message.players;
      alarms = message.alarms;
      populate();
      break;
  }
}

function populate() {
  const playersDiv = document.querySelector("#players");
  playersDiv.innerHTML = "";

  players.forEach(player => {
    let pdiv = document.createElement("div");
    let pname = document.createElement("span");
    let pdate = document.createElement("span");

    pname.innerText = player.name;
    pname.classList.add("name");
    pdate.innerText = player.date.toLocaleString();
    pdate.classList.add("date");

    pdiv.classList.add("player");
    pdiv.appendChild(pname);
    pdiv.appendChild(pdate);
    playersDiv.appendChild(pdiv);
  });
}

browser.runtime.sendMessage({
  type: "send-content",
});

browser.runtime.onMessage.addListener(onMessage);
setAlarmsButton.addEventListener("click", setAlarms);
clearAlarmsButton.addEventListener("click", clearAlarms);