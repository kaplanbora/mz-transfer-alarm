function getContent() {
  console.log("getContent");
  browser.tabs.query({active: true, currentWindow: true})
    .then(send)
    .catch(error => console.log("Tab query error: " + error.data));
}

function send(tabs) {
  browser.tabs.sendMessage(tabs[0].id, {command: "load"});
}

function populate(message) {
  console.log("populate");
  const container = document.getElementById("container");

  for (let player of message) {
    let pdiv = document.createElement("div");
    let pname = document.createElement("span");
    let pdate = document.createElement("span");

    pname.innerText = player.name;
    pname.classList.add("name");
    pdate.innerText = player.date;
    pdate.classList.add("date");

    pdiv.classList.add("player");
    pdiv.appendChild(pname);
    pdiv.appendChild(pdate);
    container.appendChild(pdiv);
  }
}

document.getElementById("getButton").addEventListener("click", getContent);
browser.runtime.onMessage.addListener(populate);

console.log("app.js");

