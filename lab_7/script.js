const API_URL = "https://6aeb9523ee39618d7bf87041.mockapi.io/api/v1/sensors";

async function loadSensors() {
    const container = document.querySelector("#sensors-list");
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }

        const sensors = await response.json();
        renderSensors(sensors);
    } catch (error) {
        console.error("Не вдалося завантажити сенсори:", error);
        container.innerHTML = `<div class="error"><p>❌ Не вдалося завантажити дані сенсорів. Перевірте з'єднання з API.</p></div>`;
    }
}

function renderSensors(sensors) {
    const container = document.querySelector("#sensors-list");
    container.innerHTML = "";

    if (!sensors || sensors.length === 0) {
        container.innerHTML = "<p>Сенсорів не знайдено.</p>";
        return;
    }

    sensors.forEach((sensor) => {
        const card = document.createElement("article");
        const isActive = sensor.status === "active";

        card.classList.add("sensor-card", isActive ? "sensor-card--active" : "sensor-card--inactive");

        card.innerHTML = `
            <h3>${sensor.name}</h3>
            <p><strong>Район:</strong> ${sensor.district}</p>
            <p><strong>Рівень шуму:</strong> ${sensor.noiseLevel} дБ</p>
            <p><strong>Статус:</strong> 
                <span class="badge ${isActive ? 'badge--active' : 'badge--inactive'}">
                    ${sensor.status}
                </span>
            </p>
        `;

        container.append(card);
    });
}

// Запуск завантаження після відкриття сторінки
document.addEventListener("DOMContentLoaded", loadSensors);