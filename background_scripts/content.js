var players = [];

function handleMessages(message) {
  switch (message.type) {
    case "persist-players":
      persistPlayers(message);
      break;
    case "load-players":
      loadPlayers(message);
      break;
    case "send-content":
      browser.runtime.sendMessage({
        type: "load-content",
        players: players,
      });
      break;
    case "set-alarms":
      setAlarms(message.players);
      break;
    case "clear-alarms":
      clearAlarms(message.players);
      break;
  }
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
  browser.browserAction.setBadgeText({text: players.length.toString()});
  browser.browserAction.setBadgeBackgroundColor({color: "#224303"});
}

function loadPlayers(message) {
  /**
   * TODO:
   * - If player already exists here update its date.
   * - If there is an alarm for old date remove that and create a new alarm.
   */
message.players.forEach(p => p.alarm = getPlayersAlarm(p.name));
players = message.players;
browser.browserAction.setBadgeText({text: players.length.toString()});
browser.browserAction.setBadgeBackgroundColor({color: "#224303"});
}

function clearAlarms(players) {
  players.forEach(player => browser.alarms.clear(player.name));
}

function fixDateCollisions(players) {
  for (let i = 0; i < players.length; i++) {
    let date1 = players[i].date;
    let addedSeconds = 1;
    for (let j = 0; j < players.length; j++) {
      let date2 = players[j].date;
      if (players[i].name === players[j].name) {
        continue;
      } else if (date1.getHours() === date2.getHours() && date1.getMinutes() === date2.getMinutes()) {
        date2.setSeconds(date2.getSeconds() + addedSeconds);
        addedSeconds += 1;
      }
    }
  }
}

function setAlarms(players) {
  fixDateCollisions(players);
  players.forEach(player => browser.alarms.create(
    player.name, {when: alarmTime(player)}
    )
  );
}

function alarmTime(player) {
  let date = player.date;
  date.setMinutes(date.getMinutes() - 1);
  return date.getTime();
}

function handleAlarms(alarm) {
  console.log("Alarm for "+ alarm.name);
  createNotification(alarm.name);
  const sound = new Audio(browser.extension.getURL("alarms/mz-alarm.wav"));
  sound.play();
  players = players.filter(player => player.name !== alarm.name);
}

function createNotification(name) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/logo-48.png"),
    "title": "MZ Transfer Alarm",
    "message": browser.i18n.getMessage("transferAlarmMessage", name)
  });
}

browser.runtime.onMessage.addListener(handleMessages);
browser.alarms.onAlarm.addListener(handleAlarms);
