// 1. Дані сенсорів (розділ 4 методички)
const sensors = [
  {
    id: "NS-01",
    district: "Галицький",
    location: "просп. Свободи, 1",
    noiseLevel: 52,
    status: "normal"
  },
  {
    id: "NS-02",
    district: "Франківський",
    location: "вул. Наукова, 10",
    noiseLevel: 68,
    status: "warning"
  },
  {
    id: "NS-03",
    district: "Шевченківський",
    location: "просп. Чорновола, 20",
    noiseLevel: 83,
    status: "critical"
  },
  {
    id: "NS-04",
    district: "Галицький",
    location: "вул. Городоцька, 15",
    noiseLevel: 79,
    status: "critical"
  }
];

// 2. Пошук потрібних DOM-елементів (розділ 5 методички)
const sensorList = document.querySelector(".sensor-list");
const districtFilter = document.querySelector("#district-filter");
const criticalFilter = document.querySelector("#critical-filter");

// 3. Створення однієї картки сенсора (розділ 6 методички)
function createSensorCard(sensor) {
  const card = document.createElement("article");
  card.classList.add("sensor-card");
  card.classList.add(`sensor-card--${sensor.status}`);

  const title = document.createElement("h3");
  title.textContent = sensor.id;

  const district = document.createElement("p");
  district.textContent = `Район: ${sensor.district}`;

  const location = document.createElement("p");
  location.textContent = `Локація: ${sensor.location}`;

  const level = document.createElement("p");
  level.textContent = `Рівень шуму: ${sensor.noiseLevel} дБ`;

  const status = document.createElement("p");
  status.textContent = `Статус: ${sensor.status}`;

  card.append(title, district, location, level, status);
  return card;
}

// 4. Відображення списку сенсорів (розділ 7 методички)
function renderSensors(sensorArray) {
  sensorList.replaceChildren();
  sensorArray.forEach((sensor) => {
    const card = createSensorCard(sensor);
    sensorList.append(card);
  });
}

// 5. Фільтрація сенсорів за районом і статусом (розділ 8 методички)
function applyFilters() {
  const selectedDistrict = districtFilter.value;
  const criticalOnly = criticalFilter.checked;

  const filteredSensors = sensors.filter((sensor) => {
    const matchesDistrict =
      selectedDistrict === "all" ||
      sensor.district === selectedDistrict;

    const matchesStatus =
      !criticalOnly ||
      sensor.status === "critical";

    return matchesDistrict && matchesStatus;
  });

  renderSensors(filteredSensors);
}

// 6. Обробка зміни фільтрів (розділ 9 методички)
districtFilter.addEventListener("change", applyFilters);
criticalFilter.addEventListener("change", applyFilters);

// 7. Початкове відображення всіх сенсорів при відкритті сторінки
renderSensors(sensors);