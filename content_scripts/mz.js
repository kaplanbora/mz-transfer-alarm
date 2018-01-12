function init() {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  load();
}

function load() {
  let names = Array.from(document.getElementsByClassName("player_name"));
  let dates = Array.from(document.getElementsByClassName("bid_history_lite"));

  names = names.map(name => name.innerText);
  dates = dates.map(date => date.children[1].children[1].innerText);

  let players = [];

  for (let i = 0; i < names.length; i++) {
    players.push({
      name: names[i],
      date: dates[i]
    });
  }

  console.log(players);
  
  browser.runtime.sendMessage({
    type: "persist-players",
    data: players
  });
}

init();
