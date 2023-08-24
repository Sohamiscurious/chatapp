const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  const messages = document.querySelector("#messages");
  const form = document.querySelector("#form");
  const input = document.querySelector("#input");
  const chatContacts = document.querySelector(".chat-contacts");

  alert(
    " - type /help to see the list of available commands \n - list of icons that can switch : \n -React, \n -Woah, \n -Lol, \n -Like, \n -Hey, \n -Congratulation \n type iconname + : to bypass the icon switch (eg:- react:)"
  );
  const contactName = prompt("Please enter a contact name:");
  if (contactName) {
    const contactDiv = document.createElement("div");
    contactDiv.classList.add("contact");
    contactDiv.textContent = contactName;
    chatContacts.appendChild(contactDiv);

    socket.emit("set contact", contactName);
    socket.on("user count", (count) => {
      const contactCount = document.querySelector("#userCount");
      contactCount.textContent = count;
    });
  }

  const emojiMapping = new Map([
    ["react" || "React" || "REACT", "⚛️"],
    ["woah" || "Woah" || "WOAH", "😯"],
    ["hey" || "Hey" || "HEY", "👋🏼"],
    ["lol" || "Lol" || "LOL", "😂"],
    ["like" || "Like" || "LIKE", "❤️"],
    ["congratulation" || "Congratulation" || "CONGRATULATION", "🥳"],
    ["react:", "react"],
    ["woah:", "woah"],
    ["hey:", "hey"],
    ["lol:", "lol"],
    ["like:", "like"],
    ["congratulation:", "congratulation"],
  ]);

  function clearContactsSession() {
    localStorage.removeItem("contacts");
    existingContacts.length = 0;
    updateContactDisplay();
  }

  const number = "0123456789";
  let result = "";

  const commandMapping = new Map([
    [
      "/help",
      () => {
        alert(
          "List of Available Commands! \n \n -/clear: Clear the Chat \n -/reload: Reload the Page \n -/random: Provide a Randome Numbers \n -/calc: Calculator \n -rem: remeber and Retrive words (eg:- /rem key value)\n we can revtrive the value by using the key \n -clearcontact: Clear the Contact"
        );
      },
    ],
    [
      "/clearcontact",
      () => {
        while (chatContacts.firstChild) {
          chatContacts.removeChild(chatContacts.firstChild);
          clearContactsSession();
        }
      },
    ],
    [
      "/clear",
      () => {
        while (messages.firstChild) {
          messages.removeChild(messages.firstChild);
        }
      },
    ],
    [
      "/reload",
      () => {
        location.reload();
      },
    ],
    [
      "/random",
      () => {
        for (let i = 0; i < 10; i++) {
          const index = Math.floor(Math.random() * number.length);
          result += number.charAt(index);
        }
        socket.emit("chat message", result);
      },
    ],
    [
      "/rem",
      (key, value) => {
        result = "";
        if (key && value) {
          emojiMapping.set(key, value);
          alert("Remembered!!");
        } else if (key) {
          let value = `The remembered word for ${key}  is ${emojiMapping.get(
            key
          )}`;
          socket.emit("chat message", value);
          value = "";
        }
      },
    ],
    [
      "/calc",
      (input) => {
        let output = `The answer is = ${eval(input)}`;
        socket.emit("chat message", output);
        output = "";
      },
    ],
  ]);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const sentence = input.value.trim().toLowerCase();
    const words = sentence.split(" ");

    if (words.length > 0) {
      var firstWord = words[0];
      var secondword = words[1];
      var thirdword = words[2];
    }

    let cmd;

    cmd = commandMapping.get(firstWord);

    let msg = words.map((word) => emojiMapping.get(word) || word).join(" ");
    if (cmd) {
      if (firstWord === "/calc") {
        cmd(secondword);
      } else cmd(secondword, thirdword);
      input.value = "";
    } else if (msg !== "") {
      socket.emit("chat message", msg);

      input.value = "";
    }
  });

  socket.on("chat message", (msg) => {
    const li = document.createElement("li");
    li.textContent = msg;
    messages.appendChild(li);
  });
});