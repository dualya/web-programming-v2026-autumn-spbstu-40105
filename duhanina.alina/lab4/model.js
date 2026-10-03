export class Car {
  constructor(make, model, owners = []) {
    this.make = make;
    this.model = model;
    this.owners = [...owners];
  }

  addOwner(name) {
    if (!name || this.owners.includes(name)) return false;
    this.owners.push(name);
    return true;
  }

  removeOwner(name) {
    const idx = this.owners.indexOf(name);
    if (idx === -1) return false;
    this.owners.splice(idx, 1);
    return true;
  }

  get ownerCount() {
    return this.owners.length;
  }
}

export function groupByMake(cars) {
  const acc = {};

  for (const car of cars) {
    const key = car.make;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(car);
  }

  return acc;
}

export function getUniqueOwners(cars) {
  const set = new Set();

  for (const car of cars) {
    for (const owner of car.owners) {
      set.add(owner);
    }
  }

  return [...set];
}

export function groupByOwnerCount(cars) {
  const acc = {};

  for (const car of cars) {
    const key = car.ownerCount;

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(car);
  }

  return acc;
}

export function carsByOwner(cars, name) {
  const acc = [];

  for (const car of cars) {
    if (car.owners.includes(name)) {
      acc.push(car);
    }
  }

  return acc;
}

export function modelsByMake(cars, make) {
  const acc = [];

  for (const car of cars) {
    if (car.make === make) {
      acc.push(car.model);
    }
  }

  return acc;
}