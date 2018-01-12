function init() {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  load();
}

function toDate(textDate) {
  // textDate example: "13-01-2018 00:31";
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
  let names = Array.from(document.querySelectorAll(".player_name"));
  let dates = Array.from(document.querySelectorAll(".bid_history_lite"));

  names = names.map(name => name.innerText);
  dates = dates.map(date => date.children[1].children[1].innerText);

  let players = [];

  for (let i = 0; i < names.length; i++) {
    players.push({
      name: names[i],
      date: toDate(dates[i])
    });
  }

  players.sort((a,b) => a.date - b.date);

  console.log(players);
  
  browser.runtime.sendMessage({
    type: "persist-players",
    players: players
  });
}

init();
