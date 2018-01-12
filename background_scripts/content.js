var players = [];
var alarms = [];

function listener(message) {
  switch (message.type) {
    case "persist-players":
      players = message.data;
      break;
    case "persist-alarms":
      alarms = message.alarms;
      break;
    case "send-content":
      browser.runtime.sendMessage({
        type: "load-content",
        players: players,
        alarms: alarms
        });
      break;
  }
}

browser.runtime.onMessage.addListener(listener);