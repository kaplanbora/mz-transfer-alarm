function init() {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  load();
}

function toDate(textDate) {
  // textDate example: "13-01-2018 00:31"
  return new Date(
    textDate.slice(6, 10),
    textDate.slice(3, 5) - 1,
    textDate.slice(0, 2),
    textDate.slice(11, 13),
    textDate.slice(14, 16),
    0
  );
}

function load() {
  let players = [];

  const container = Array.from(document.querySelector("#players_container").children);
  console.log("Container: " + container);
  container.forEach(player => {
    console.log("Player: " + player);
    let nameElement = player.querySelector(".player_name");
    let dateElement = player.querySelector(".bid_history_lite");
    if (dateElement) {
      let deadline = toDate(dateElement.children[1].children[1].innerText);
      if (deadline.getTime() >= Date.now()){
        players.push({
          name: nameElement.innerText,
          date: deadline.getTime(),
          alarm: false,
          checked: false
        });
      }
    }
  });

  players.sort((a,b) => a.date - b.date);
  
  chrome.runtime.sendMessage({
    type: "load-players",
    players: players
  });
}

init();
