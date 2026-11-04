interface Sensor {
    id: string;
    name: string;
    district: string;
    noiseLevel: number;
    status: "active" | "inactive";
}

function renderSensors(sensors: Sensor[]): void {
    const container = document.querySelector<HTMLDivElement>("#sensors");
    if (!container) {
        return;
    }
    container.innerHTML = "";

    sensors.forEach((sensor) => {
        const card = document.createElement("div");
        card.className = "sensor-card";
        card.innerHTML = `
            <h3>${sensor.name}</h3>
            <p>Район: ${sensor.district}</p>
            <p>Рівень шуму: ${sensor.noiseLevel} дБ</p>
            <p>Статус: ${sensor.status}</p>
        `;
        container.appendChild(card);
    });
}

async function loadSensors(): Promise<void> {
    try {
        const response = await fetch(
            "https://6aeb9523ee39618d7bf87041.mockapi.io/api/v1/sensors"
        );
        if (!response.ok) {
            throw new Error("Не вдалося завантажити сенсори");
        }
        const sensors: Sensor[] = await response.json();
        renderSensors(sensors);
    } catch (error) {
        console.error("Помилка:", error);
    }
}

loadSensors();