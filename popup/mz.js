var names = Array.from(document.getElementsByClassName("player_name"));
var dates = Array.from(document.getElementsByClassName("bid_history_lite"));

names = names.map(name => name.innerText);
dates = dates.map(date => date.children[1].children[1].innerText);

var players = [];

for (let i = 0; i < names.length; i++) {
    players.push({
        name: names[i],
        date: dates[i]
    });

}
