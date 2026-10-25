import { NoiseSensor } from "./models/NoiseSensor.js";
import { NoiseMeasurement } from "./models/NoiseMeasurement.js";
import { MobileNoiseSensor } from "./models/MobileNoiseSensor.js";
import { MonitoringSystem } from "./services/MonitoringSystem.js";

// Початкові дані з методички (розділ 6.1)
const initialSensorsData = [
  {
    id: "NS-01",
    district: "Галицький",
    location: "просп. Свободи",
    noiseLevel: 58,
  },
  {
    id: "NS-02",
    district: "Франківський",
    location: "вул. Наукова",
    noiseLevel: 74,
  },
  {
    id: "NS-03",
    district: "Шевченківський",
    location: "просп. Чорновола",
    noiseLevel: 83,
  },
];

// Ініціалізація системи
const system = new MonitoringSystem();

// Додаємо базові сенсори через статичний метод fromObject
initialSensorsData.forEach(item => {
  system.addSensor(NoiseSensor.fromObject(item));
});

// Додаємо мобільний сенсор (демонстрація наслідування extends)
const mobileSensor = new MobileNoiseSensor("NS-04-M", "Сихівський", "вул. Червоної Калини", 52, 18);
system.addSensor(mobileSensor);

// Поточний список для рендерингу
let displayedSensors = [...system.sensors];

// Рендеринг картки сенсора
function renderSensorCard(sensor) {
  const status = sensor.getStatus();
  const isMobile = sensor instanceof MobileNoiseSensor;

  const card = document.createElement("div");
  card.className = `sensor-card ${status}`;
  card.id = `card-${sensor.id}`;

  card.innerHTML = `
    <div class="sensor-top">
      <h3>${sensor.id}</h3>
      <span class="badge ${status}">${status}</span>
    </div>
    
    <div class="sensor-info">
      <p><strong>Район:</strong> ${sensor.district}</p>
      <p><strong>Локація:</strong> ${sensor.location}</p>
      <div class="noise-metric">
        <span class="value">${sensor.noiseLevel}</span>
        <span class="unit">dB</span>
      </div>
      ${isMobile ? `
        <div class="battery-tag ${sensor.needsCharging() ? 'low' : ''}">
          🔋 Батарея: ${sensor.batteryLevel}% ${sensor.needsCharging() ? '⚠️ Потрібна підзарядка!' : ''}
        </div>
      ` : ''}
      <p style="margin-top: 8px;"><strong>Замірів в історії:</strong> ${sensor.measurements.length}</p>
    </div>

    <div class="sensor-card-actions">
      <button class="btn-action-add" data-id="${sensor.id}">+5 dB</button>
      <button class="btn-action-sub btn-secondary" data-id="${sensor.id}">-5 dB</button>
    </div>
  `;

  // Обробники подій на оновлення стану сенсора через методи класу
  card.querySelector(".btn-action-add").addEventListener("click", () => {
    sensor.updateNoiseLevel(sensor.noiseLevel + 5);
    updateUI();
  });

  card.querySelector(".btn-action-sub").addEventListener("click", () => {
    const newVal = Math.max(0, sensor.noiseLevel - 5);
    sensor.updateNoiseLevel(newVal);
    updateUI();
  });

  return card;
}

// Оновлення інтерфейсу
function updateUI() {
  const container = document.getElementById("sensors-container");
  container.innerHTML = "";

  displayedSensors.forEach(sensor => {
    container.appendChild(renderSensorCard(sensor));
  });

  // Оновлюємо статистику системи
  document.getElementById("total-sensors").textContent = system.sensors.length;
  document.getElementById("critical-sensors").textContent = system.getCriticalSensors().length;
  document.getElementById("avg-noise").textContent = `${system.getAverageNoiseLevel()} dB`;
}

// Фільтрація за районом
document.getElementById("district-filter").addEventListener("change", (e) => {
  displayedSensors = system.getSensorsByDistrict(e.target.value);
  updateUI();
});

// Пошук за ID
document.getElementById("btn-search").addEventListener("click", () => {
  const query = document.getElementById("search-id").value;
  if (!query.trim()) return;
  const found = system.findSensorById(query);
  displayedSensors = found ? [found] : [];
  updateUI();
});

// Скидання пошуку та фільтрів
document.getElementById("btn-reset").addEventListener("click", () => {
  document.getElementById("search-id").value = "";
  document.getElementById("district-filter").value = "all";
  displayedSensors = [...system.sensors];
  updateUI();
});

// ----------------------------------------------------
// Консольні експерименти за пунктом 7.1 методички
// (відкрий консоль F12 для демонстрації викладачу)
// ----------------------------------------------------
console.log("%c=== Лабораторна робота 5: Перевірка prototype та ООП ===", "color: #58a6ff; font-weight: bold; font-size: 14px;");

const sensorA = system.findSensorById("NS-01");
const sensorB = system.findSensorById("NS-02");

console.log("1. Чи однакове посилання на метод getStatus в різних екземплярах?");
console.log("sensorA.getStatus === sensorB.getStatus ->", sensorA.getStatus === sensorB.getStatus); // true

console.log("2. Чи є noiseLevel власною властивістю екземпляра (Object.hasOwn)?");
console.log("Object.hasOwn(sensorA, 'noiseLevel') ->", Object.hasOwn(sensorA, "noiseLevel")); // true

console.log("3. Чи є getStatus власною властивістю екземпляра (чи він у prototype)?");
console.log("Object.hasOwn(sensorA, 'getStatus') ->", Object.hasOwn(sensorA, "getStatus")); // false

console.log("4. Середній рівень шуму через систему:", system.getAverageNoiseLevel());
console.log("5. Критичні сенсори:", system.getCriticalSensors());
console.log("6. Об'єкт системи з колекцією сенсорів:", system);

// Початковий рендер
window.addEventListener("DOMContentLoaded", () => {
  updateUI();
});
