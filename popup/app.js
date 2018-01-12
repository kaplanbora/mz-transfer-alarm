var players = [];
var alarms = [];

function setAlarm(date) {
  console.log(players[0].date.getTime());
  browser.alarms.create(players[0].name, {
    when: players[0].date.getTime()
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

function onAlarm(alarm) {
  createNotification(alarm.name);
  const sound = new Audio(browser.extension.getURL("alarms/şak.ogg"));
  sound.play();
}

function createNotification(name) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("light-icons/logo-48.png"),
    "title": "MZ Transfer Alarm",
    "message": name
  });
}

function populate() {
  const container = document.querySelector("#container");
  container.innerHTML = "";

  for (let player of players) {
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
    container.appendChild(pdiv);
  }
}

browser.runtime.sendMessage({
  type: "send-content",
});

browser.runtime.onMessage.addListener(onMessage);
browser.alarms.onAlarm.addListener(onAlarm);

document.querySelector("#setAlarm").addEventListener("click", setAlarm);
