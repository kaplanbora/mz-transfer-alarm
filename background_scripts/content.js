var players = [];

function handleMessages(message) {
  switch (message.type) {
    case "persist-players":
      persistPlayers(message);
      break;
    case "send-content":
      browser.runtime.sendMessage({
        type: "load-content",
        players: players,
      });
      break;
    case "create-alarms":
      setAlarms(message.players);
      break;
    case "clear-alarms":
      clearAlarms();
      break;
  }
}

function persistPlayers(message) {
  if (players.length === 0) {
    players = message.players;
  } else {
    players = players.filter(player =>
      message.players.some(mplayer => mplayer.name === player.name)
    );
    /**
     * TODO:
     * - If player already exists here update its date.
     * - If there is an alarm for old date remove that and create a new alarm.
     */
  }
  browser.browserAction.setBadgeText({text: players.length.toString()});
  browser.browserAction.setBadgeBackgroundColor({color: "#224303"});
}

function clearAlarms() {
  browser.alarms.clearAll();
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/logo-48.png"),
    "title": "MZ Transfer Alarm",
    "message": browser.i18n.getMessage("clearAlarmsMessage")
  });
}

function setAlarms(players) {
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
  createNotification(alarm.name);
  const sound = new Audio(browser.extension.getURL("alarms/mz-alarm.wav"));
  sound.play();
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
