var players = [];
var alarms = [];

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
    "iconUrl": browser.extension.getURL("light-icons/logo-48.png"),
    "title": "MZ Transfer Alarm",
    "message": `Created alarms for ${players.length} players.`
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
  const container = document.querySelector("#container");
  container.innerHTML = "";

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
    container.appendChild(pdiv);
  });
}

browser.runtime.sendMessage({
  type: "send-content",
});

browser.runtime.onMessage.addListener(onMessage);
document.querySelector("#setAlarms").addEventListener("click", setAlarms);
document.querySelector("#clearAlarms").addEventListener("click", clearAlarms);