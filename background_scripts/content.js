var players = [];

function handleMessages(message) {
  switch (message.type) {
    case "persist-players":
      players = message.players;
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
      browser.alarms.clearAll();
      break;
  }
}

function setAlarms(players) {
  players.forEach(player => browser.alarms.create(
      player.name, {when: player.date.getTime()}
    )
  );
}

function handleAlarms(alarm) {
  createNotification(alarm.name);
  const sound = new Audio(browser.extension.getURL("alarms/metro_1.wav"));
  sound.play();
}

function createNotification(name) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("light-icons/logo-48.png"),
    "title": "MZ Transfer Alarm",
    "message": browser.i18n.getMessage("transferAlarmMessage", name)
  });
}

browser.runtime.onMessage.addListener(handleMessages);
browser.alarms.onAlarm.addListener(handleAlarms);
