var players = [];

document.querySelector("#set-alarms-label").innerText = browser.i18n.getMessage("setAlarmsLabel");
document.querySelector("#clear-alarms-label").innerText = browser.i18n.getMessage("clearAlarmsLabel");
document.querySelector("#remove-players-label").innerText = browser.i18n.getMessage("removePlayersLabel");
document.querySelector("#players-label").innerText = browser.i18n.getMessage("players");
document.querySelector("#select-all-label").innerText = browser.i18n.getMessage("selectAll");

function selectPlayer(event) {
  let player = players.find(p => event.target.id === p.name);
  player.checked = !player.checked;
  event.checked = !event.checked;
}

function selectAll(event) {
  players.forEach(player => player.checked = !player.checked);
  Array.from(document.querySelectorAll(".select"))
    .forEach(checkbox => checkbox.checked = !checkbox.checked);
}

function removePlayers(event) {
  browser.runtime.sendMessage({
    type: "clear-alarms",
    players: players.filter(player => player.checked)
  });
  players = players.filter(player => !player.checked);
  populate();
  browser.runtime.sendMessage({
    type: "persist-players",
    players: players
  });
}

function clearAlarms(event) {
  let checkedPlayers = players.filter(player => player.checked);
  checkedPlayers.forEach(player => {
    player.alarm = false;
    player.checked = false;
  });
  populate();
  browser.runtime.sendMessage({
    type: "clear-alarms",
    players: checkedPlayers 
  });
  browser.runtime.sendMessage({
    type: "persist-players",
    players: players
  });
}

function setAlarms(event) {
  let checkedPlayers = players.filter(player => player.checked);
  checkedPlayers.forEach(player => {
    player.alarm = true;
    player.checked = false;
  });
  populate();
  browser.runtime.sendMessage({
    type: "set-alarms",
    players: checkedPlayers
  });
  browser.runtime.sendMessage({
    type: "persist-players",
    players: players
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

function padZero(time) {
  if (time < 10) {
    return `0${time}`;
  }
  return time;
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

function beautifyDate(date) {
  const now = new Date(Date.now());
  let day = "";
  switch (date.getDay()) {
    case now.getDay():
      day = browser.i18n.getMessage("today");
      break;
    case now.getDay() + 1:
      day = browser.i18n.getMessage("oneDayLater");
      break;
    case now.getDay() + 2:
      day = browser.i18n.getMessage("twoDaysLater");
      break;
    case now.getDay() + 3:
      day = browser.i18n.getMessage("threeDaysLater");
      break;
  }
  return `${day}, ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
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

  checkbox.addEventListener("click", selectPlayer);
  checkbox.id = player.name;
  checkbox.type = "checkbox";
  checkbox.classList.add("select");
  tick.classList.add("tick");
  tick.appendChild(checkbox);

  pname.innerText = player.name;
  pname.classList.add("name");
  pdeadline.innerText = beautifyDate(player.date);
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
  playersDiv.innerHTML = "";
  
  if (players.length === 0) {
    showEmptyMessage(playersDiv);
    return;
  }
  
  players.forEach(player => {
    let pdiv = createPlayerDiv(player);
    playersDiv.appendChild(pdiv);
  });
}

browser.runtime.sendMessage({
  type: "send-content",
});

browser.runtime.onMessage.addListener(onMessage);
document.querySelector("#set-alarms-button").addEventListener("click", setAlarms);
document.querySelector("#clear-alarms-button").addEventListener("click", clearAlarms);
document.querySelector("#remove-players-button").addEventListener("click", removePlayers);
document.querySelector("#select-all-label").addEventListener("click", selectAll);