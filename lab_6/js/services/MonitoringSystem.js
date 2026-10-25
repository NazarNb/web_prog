import { NoiseSensor } from "../models/NoiseSensor.js";

export class MonitoringSystem {
  constructor() {
    this.sensors = [];
  }

  addSensor(sensor) {
    if (!(sensor instanceof NoiseSensor)) {
      throw new Error("Можна додавати лише екземпляри NoiseSensor");
    }
    const sensorExists = this.sensors.some(item => item.id === sensor.id);
    if (sensorExists) {
      throw new Error(`Датчик ${sensor.id} вже існує в системі`);
    }
    this.sensors.push(sensor);
  }

  findSensorById(id) {
    return this.sensors.find(sensor => sensor.id.toLowerCase() === id.trim().toLowerCase()) || null;
  }

  getSensorsByDistrict(district) {
    if (!district || district === "all") {
      return [...this.sensors];
    }
    return this.sensors.filter(
      sensor => sensor.district.toLowerCase() === district.toLowerCase()
    );
  }

  getCriticalSensors() {
    return this.sensors.filter(sensor => sensor.getStatus() === "critical");
  }

  getAverageNoiseLevel() {
    if (this.sensors.length === 0) return 0;
    const total = this.sensors.reduce((acc, sensor) => acc + sensor.noiseLevel, 0);
    return Number((total / this.sensors.length).toFixed(2));
  }
}
