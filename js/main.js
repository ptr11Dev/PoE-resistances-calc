/* =================================
          Instruction - START
==================================== */
const popup = document.querySelector(".popup");
document.querySelector(".popup button").addEventListener("click", function() {
  popup.classList.add("notActive");
});

document.querySelector(".instruction").addEventListener("click", function() {
  popup.classList.toggle("notActive");
});
/* =================================
          Instruction - END
==================================== */

/* =================================
        Alert - START
==================================== */
const alertBox = document.querySelector(".alert");
const alertContent = document.querySelector(".alert .content");
const alertButton = document.querySelector(".alert button");
alertButton.addEventListener("click", function() {
  alertBox.classList.remove("on");
});
/* =================================
        Alert - END
==================================== */

/* =================================
          character - START
==================================== */

let myCharacter = {
  name: "",
  fire: 0,
  cold: 0,
  lightning: 0
};

const characterButton = document.querySelector(".myCharacter button");
let editActive = 0;

const toggleDisable = () => {
  let specification = document.querySelectorAll("header input");
  for (let i = 0; i < specification.length; i++) {
    specification[i].disabled = !specification[i].disabled;
  }
  if (!editActive) {
    characterButton.textContent = "Edit";
    characterButton.classList.toggle("unActive");
    characterButton.classList.toggle("active");
    editActive = 1;
  } else {
    characterButton.textContent = "Save";
    characterButton.classList.toggle("unActive");
    characterButton.classList.toggle("active");
    editActive = 0;
  }
};
const characterCreate = e => {
  e.preventDefault();
  myCharacter.name = document.querySelector(".nickname input").value;
  myCharacter.fire = parseInt(document.querySelector(".myFire input").value);
  myCharacter.cold = parseInt(document.querySelector(".myCold input").value);
  myCharacter.lightning = parseInt(
    document.querySelector(".myLightning input").value
  );
  if (
    isNaN(myCharacter.fire) ||
    isNaN(myCharacter.cold) ||
    isNaN(myCharacter.lightning)
  ) {
    alertBox.classList.add("on");
    alertContent.innerHTML =
      "<p>Make sure you've filled all the information about your character.</p>";
    return;
  } else {
    toggleDisable();
  }
};

characterButton.addEventListener("click", characterCreate);

/* =================================
        character  - END
==================================== */

/* =================================
      Ring generator - START
==================================== */

const specificRings = document.getElementsByClassName("ring");
const mainSection = document.querySelector(".main");
const ringsList = []; // list of objects
const elementsList = []; //list of html objects

class Ring {
  constructor(name, fire, cold, lightning) {
    this.name = name;
    this.fire = fire;
    this.cold = cold;
    this.lightning = lightning;
  }
}

const removeRing = e => {
  const index = e.target.parentNode.dataset.key;
  ringsList.splice(index, 1);
  elementsList.splice(index, 1);
  renderList();
};

const addRing = e => {
  e.preventDefault();
  const ringName = document.querySelector(".custom .name").value;
  const ringFire = document.querySelector(".custom .fire").value;
  const ringCold = document.querySelector(".custom .cold").value;
  const ringLightning = document.querySelector(".custom .lightning").value;
  if (
    ringName === "" ||
    ringFire === "" ||
    ringCold === "" ||
    ringLightning === ""
  ) {
    alertBox.classList.add("on");
    alertContent.innerHTML =
      "<p>Please input all the values - </br> in case of lack of information please input 0.</p>";
    return;
  }

  const newRing = new Ring(
    ringName,
    parseInt(ringFire),
    parseInt(ringCold),
    parseInt(ringLightning)
  );

  ringsList.push(newRing); //pushing object to object list

  const div = document.createElement("div");
  div.className = "ring";
  if (
    parseInt(ringFire) > parseInt(ringCold) &&
    parseInt(ringFire) > parseInt(ringLightning)
  ) {
    div.classList.add("fireBGC");
  } else if (
    parseInt(ringCold) > parseInt(ringFire) &&
    parseInt(ringCold) > parseInt(ringLightning)
  ) {
    div.classList.add("coldBGC");
  } else if (
    parseInt(ringLightning) > parseInt(ringFire) &&
    parseInt(ringLightning) > parseInt(ringCold)
  ) {
    div.classList.add("lightningBGC");
  }

  div.innerHTML = `<p>Name: ${ringName}</p> <p>Fire: ${ringFire}</p> <p>Cold: ${ringCold}</p> <p>Lightning: ${ringLightning}</p><button>Delete</button>`;
  elementsList.push(div); //pushing html object to corresponding list
  renderList();
  document.querySelector(".custom .name").value = "";
  document.querySelector(".custom .fire").value = "";
  document.querySelector(".custom .cold").value = "";
  document.querySelector(".custom .lightning").value = "";

  mainSection.appendChild(div);
  div.querySelector("button").addEventListener("click", removeRing);
  document.querySelector(".custom .name").focus();
};

const renderList = () => {
  mainSection.textContent = "";
  elementsList.forEach((elementList, key) => {
    elementList.dataset.key = key;
    mainSection.appendChild(elementList);
  });
};

document.querySelector(".custom button").addEventListener("click", addRing);

/* =================================
        Ring generator - END
==================================== */

/* =================================
        Calculation - START
==================================== */

const mergedRings = [];
let winner;

const calculate = () => {
  mergedRings.length = 0;
  if (!editActive) {
    alertBox.classList.add("on");
    alertContent.innerHTML =
      "<p>Please save information about your character.</p>";
    return;
  }
  for (let i = 0; i < ringsList.length - 1; i++) {
    for (let j = 1 + i; j < ringsList.length; j++) {
      let mergedName = ringsList[i].name + "&" + ringsList[j].name;
      let mergedFire = ringsList[i].fire + ringsList[j].fire + myCharacter.fire;
      let mergedCold = ringsList[i].cold + ringsList[j].cold + myCharacter.cold;
      let mergedLightning =
        ringsList[i].lightning + ringsList[j].lightning + myCharacter.lightning;
      let mergedRing = new Ring(
        mergedName,
        mergedFire,
        mergedCold,
        mergedLightning
      );
      mergedRings.push(mergedRing);
    }
  }
  if (mergedRings < 3) {
    alertBox.classList.add("on");
    alertContent.innerHTML =
      "<p>Please input information about at least 2 rings.</p>";
    return;
  }

  bestPair();
};

const bestPair = () => {
  const filteredRings = mergedRings
    .filter(
      ring =>
        ring.fire >= parseInt(document.querySelector(".demands .fire").value) &&
        ring.cold >= parseInt(document.querySelector(".demands .cold").value) &&
        ring.lightning >=
          parseInt(document.querySelector(".demands .lightning").value)
    ) // Find every ring where resistances are higher than the given value
    .map(ring => {
      return {
        name: ring.name,
        fire: ring.fire,
        cold: ring.cold,
        lightning: ring.lightning,
        sum: ring.fire + ring.cold + ring.lightning
      };
      // map will return an array with the filtered rings, and we put theirs resistances and names
    })
    .sort((a, b) => b.sum - a.sum); // Lastly we sort them high to low by their sum

  if (filteredRings.length == 0) {
    alertBox.classList.add("on");
    alertContent.innerHTML =
      "<p>There is no way to fulfill your expectations.</p>";
    return;
  }

  winner = filteredRings[0].name;
  const splitName = winner.split("&");

  document.querySelector(".firstRing").textContent = splitName[0];
  document.querySelector(".secondRing").textContent = splitName[1];
  document.querySelector(".invisible").style.opacity = 1;
};

document.querySelector(".result button").addEventListener("click", calculate);

/* =================================
        Calculation - END
==================================== */
