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
      clearAlarms();
      break;
  }
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
  console.log(`Setting alarm for ${player.name} at ${date.toLocaleString()}`);
  return date.getTime();
}

function handleAlarms(alarm) {
  console.log("Alarm ringing for: " + alarm.name);
  createNotification(alarm.name);
  const sound = new Audio(browser.extension.getURL("alarms/metro_1.wav"));
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
