var players = [];
var alarms = [];

document.querySelector("#set-alarms-label").innerText = browser.i18n.getMessage("setAlarmsLabel");
document.querySelector("#clear-alarms-label").innerText = browser.i18n.getMessage("clearAlarmsLabel");
document.querySelector("#remove-players-label").innerText = browser.i18n.getMessage("removePlayersLabel");
document.querySelector("#players-label").innerText = browser.i18n.getMessage("players");
document.querySelector("#select-all-label").innerText = browser.i18n.getMessage("selectAll");
document.querySelector("#set-alarms-button").addEventListener("click", setAlarms);
document.querySelector("#clear-alarms-button").addEventListener("click", clearAlarms);
document.querySelector("#remove-players-button").addEventListener("click", removePlayers);

function removePlayers(event) {

}

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

function clearPlayersArea(playersDiv) {
  if (players.length > 0) {
    playersDiv.innerHTML = "";
  } else {
    let link = document.createElement("a");
    link.href = "https://www.managerzone.com/?p=shortlist";
    link.classList.add("empty");
    link.innerText = browser.i18n.getMessage("emptyPopupMessage");
    playersDiv.appendChild(link);
  }
}

function populate() {
  const playersDiv = document.querySelector("#players");
  clearPlayersArea(playersDiv);

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