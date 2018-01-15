var players = [];

function handleMessages(message) {
  console.log("Incoming message: " + message.type);
  console.log(message.players);
  switch (message.type) {
    case "persist-players":
      persistPlayers(message);
      break;
    case "load-players":
      loadPlayers(message);
      break;
    case "send-content":
      chrome.runtime.sendMessage({
        type: "load-content",
        players: players,
      });
      break;
    case "remove-players":
      removePlayers(message);
      break;
    case "set-alarms":
      setAlarms(message);
      break;
    case "clear-alarms":
      clearAlarms(message);
      break;
  }
}

function removePlayers(message) {
  message.players.filter(player => player.checked)
    .forEach(player => chrome.alarms.clear(player.name));
  players = message.players.filter(player => !player.checked);
}

function getPlayersAlarm(name) {
  let player = players.find(player => player.name === name);
  if (player) {
    return player.alarm;
  } else {
    return false;
  }
}

function persistPlayers(message) {
  /**
   * TODO:
   * - If player already exists here update its date.
   * - If there is an alarm for old date remove that and create a new alarm.
   */
  players = message.players;
  chrome.browserAction.setBadgeText({text: players.length.toString()});
  chrome.browserAction.setBadgeBackgroundColor({color: "#224303"});
}

function loadPlayers(message) {
  /**
   * TODO:
   * - If player already exists here update its date.
   * - If there is an alarm for old date remove that and create a new alarm.
   */
  message.players.forEach(p => p.alarm = getPlayersAlarm(p.name));
  players = message.players;
  chrome.browserAction.setBadgeText({text: players.length.toString()});
  chrome.browserAction.setBadgeBackgroundColor({color: "#224303"});
}

function clearAlarms(message) {
  players = message.players;
  players.filter(player => !player.alarm)
    .forEach(player => chrome.alarms.clear(player.name));
}

function fixDateCollisions(players) {
  for (let i = 0; i < players.length; i++) {
    let addedMillis = 100;
    for (let j = 0; j < players.length; j++) {
      if (players[i].name === players[j].name) {
        continue;
      } else if (players[i].date === players[j].date) {
        players[j].date = players[j].date + addedMillis;
        addedMillis += 600;
      }
    }
  }
}

function setAlarms(message) {
  players = message.players;
  let playersDated = players.filter(p => p.alarm);
  fixDateCollisions(playersDated);
  playersDated.forEach(player => chrome.alarms.create(
    player.name, {when: alarmTime(player)}
    )
  );
}

// Alarm time is 1 minute left before deadline
function alarmTime(player) {
  return player.date - 60000;
}

function handleAlarms(alarm) {
  console.log("Alarm for " + alarm.name);
  createNotification(alarm.name);
  const sound = new Audio(chrome.extension.getURL("alarms/mz-alarm.wav"));
  sound.play();
  players = players.filter(player => player.name !== alarm.name);
}

function createNotification(name) {
  chrome.notifications.create({
    "type": "basic",
    "iconUrl": chrome.extension.getURL("icons/logo-48.png"),
    "title": "MZ Transfer Alarm",
    "message": chrome.i18n.getMessage("transferAlarmMessage", name)
  });
}

chrome.runtime.onMessage.addListener(handleMessages);
chrome.alarms.onAlarm.addListener(handleAlarms);
