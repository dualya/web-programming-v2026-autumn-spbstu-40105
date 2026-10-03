import {
  Car,
  groupCarsByMake,
  getUniqueOwners,
  groupCarsByOwnerCount,
  findCarsByOwner,
  findModelsByMake,
} from "./model.js";

const STORAGE_KEY = "lab4_cars_v1";

let cars = [];

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return;
    }

    cars = [];
    for (const c of parsed) {
      cars.push(new Car(c.make, c.model, c.owners || []));
    }
  } catch (e) {
    console.error("Ошибка загрузки из localStorage:", e);
    cars = [];
  }
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
}

window.addEventListener("beforeunload", saveToStorage);

function asyncOp(action, delay = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(action()), delay);
  });
}

const carForm = document.getElementById("carForm");
const ownerForm = document.getElementById("ownerForm");
const carSelect = document.getElementById("carSelect");
const carList = document.getElementById("carList");

function render() {
  carList.innerHTML = "";

  for (let i = 0; i < cars.length; i++) {
    const car = cars[i];

    const card = document.createElement("div");
    card.className = "card";
    card.dataset.testid = "entity-card";

    const h3 = document.createElement("h3");
    h3.textContent = car.make;

    const modelEl = document.createElement("div");
    modelEl.className = "model";
    modelEl.textContent = `Модель: ${car.model}`;

    const ul = document.createElement("ul");
    ul.className = "owners";

    if (car.owners.length === 0) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "Нет владельцев";
      ul.appendChild(li);
    } else {
      for (const owner of car.owners) {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = owner;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "danger";
        btn.textContent = "✕";
        btn.title = "Удалить владельца";
        btn.addEventListener("click", () => handleRemoveOwner(i, owner));

        li.appendChild(span);
        li.appendChild(btn);
        ul.appendChild(li);
      }
    }

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.textContent = "Добавить владельца";
    addBtn.addEventListener("click", () => handleQuickAddOwner(i));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "danger";
    delBtn.textContent = "Удалить автомобиль";
    delBtn.dataset.testid = "delete-entity";
    delBtn.addEventListener("click", () => handleRemoveCar(i));

    actions.appendChild(addBtn);
    actions.appendChild(delBtn);

    card.appendChild(h3);
    card.appendChild(modelEl);
    card.appendChild(ul);
    card.appendChild(actions);

    carList.appendChild(card);
  }

  carSelect.innerHTML = "";

  if (cars.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "— нет автомобилей —";
    opt.disabled = true;
    opt.selected = true;
    carSelect.appendChild(opt);
    carSelect.disabled = true;
  } else {
    carSelect.disabled = false;
    for (let i = 0; i < cars.length; i++) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = `${cars[i].make} ${cars[i].model}`;
      carSelect.appendChild(opt);
    }
  }
}

carForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(carForm);
  const make = String(fd.get("make") || "").trim();
  const model = String(fd.get("model") || "").trim();
  if (!make || !model) {
    return;
  }

  asyncOp(() => {
    cars.push(new Car(make, model));
    saveToStorage();
  }).then(() => {
    carForm.reset();
    render();
  });
});

ownerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(ownerForm);
  const idx = Number(fd.get("carIndex"));
  const name = String(fd.get("owner") || "").trim();
  if (!name || !cars[idx]) {
    return;
  }

  asyncOp(() => {
    const ok = cars[idx].addOwner(name);
    if (ok) {
      saveToStorage();
    }
    return ok;
  }).then((ok) => {
    if (!ok) {
      alert("Такой владелец уже есть у этого автомобиля");
    } else {
      ownerForm.reset();
    }
    render();
  });
});

function handleQuickAddOwner(idx) {
  const name = prompt("Имя владельца:");
  if (name === null) {
    return;
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return;
  }

  asyncOp(() => {
    const ok = cars[idx].addOwner(trimmed);
    if (ok) {
      saveToStorage();
    }
    return ok;
  }).then((ok) => {
    if (!ok) {
      alert("Такой владелец уже есть у этого автомобиля");
    }
    render();
  });
}

function handleRemoveOwner(idx, owner) {
  asyncOp(() => {
    cars[idx].removeOwner(owner);
    saveToStorage();
  }).then(render);
}

function handleRemoveCar(idx) {
  asyncOp(() => {
    cars.splice(idx, 1);
    saveToStorage();
  }).then(render);
}

loadFromStorage();
render();

export {
  Car,
  groupCarsByMake,
  getUniqueOwners,
  groupCarsByOwnerCount,
  findCarsByOwner,
  findModelsByMake,
};