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
document.querySelector("#select-all-label").addEventListener("click", selectAll);

function selectAll() {

}

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

function showEmptyMessage(playersDiv) {
  let link = document.createElement("a");
  const pdiv = document.createElement("div");
  pdiv.classList.add("player");
  pdiv.appendChild(link);
  link.href = "https://www.managerzone.com/?p=shortlist";
  link.classList.add("empty");
  link.innerText = browser.i18n.getMessage("emptyPopupMessage");
  playersDiv.appendChild(pdiv);
}

function createPlayerDiv(player) {
  const noAlarmIcon = "font-awesome_4-7-0_bell-o_24_0_e8e8e8_none.png";
  const alarmIcon = "font-awesome_4-7-0_bell-o_24_0_282828_none.png";
  const pdiv = document.createElement("div");
  const tick = document.createElement("div");
  const info = document.createElement("div");
  const alarm = document.createElement("div");
  const pname = document.createElement("span");
  const pdeadline = document.createElement("span");
  const icon = document.createElement("img");
  const checkbox = document.createElement("input");

  checkbox.type = "checkbox";
  tick.classList.add("tick");
  tick.appendChild(checkbox);

  pname.innerText = player.name;
  pname.classList.add("name");
  pdeadline.innerText = player.date.toLocaleString(); // customize this
  pdeadline.classList.add("date");
  info.classList.add("info");
  info.appendChild(pname);
  info.appendChild(pdeadline);

  icon.src = player.alarm ? alarmIcon : noAlarmIcon;
  icon.alt = "Alarm Icon";
  alarm.classList.add("alarm");
  alarm.appendChild(icon);

  pdiv.classList.add("player");
  pdiv.appendChild(tick);
  pdiv.appendChild(info);
  pdiv.appendChild(alarm);
  return pdiv;
}

function populate() {
  const playersDiv = document.querySelector(".players");
  if (players.length === 0) {
    showEmptyMessage(playersDiv);
    return;
  }
  playersDiv.innerHTML = "";

  players.forEach(player => {
    let pdiv = createPlayerDiv(player);
    playersDiv.appendChild(pdiv);
  });
}

browser.runtime.sendMessage({
  type: "send-content",
});

browser.runtime.onMessage.addListener(onMessage);
setAlarmsButton.addEventListener("click", setAlarms);
clearAlarmsButton.addEventListener("click", clearAlarms);