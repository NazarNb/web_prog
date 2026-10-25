import { NoiseMeasurement } from "./NoiseMeasurement.js";

export const NOISE_LIMITS = Object.freeze({
  normalMax: 55,
  warningMax: 70,
});

export class NoiseSensor {
  constructor(id, district, location, noiseLevel) {
    if (!id || typeof id !== "string") {
      throw new Error("ID сенсора обов'язковий і має бути рядком");
    }
    if (!NoiseSensor.isValidNoiseLevel(noiseLevel)) {
      throw new Error(`Некоректний рівень шуму: ${noiseLevel}`);
    }

    this.id = id;
    this.district = district;
    this.location = location;
    this.noiseLevel = noiseLevel;
    this.measurements = [];

    // Додаємо початкове вимірювання
    this.measurements.push(new NoiseMeasurement(noiseLevel));
  }

  getStatus() {
    if (this.noiseLevel <= NOISE_LIMITS.normalMax) {
      return "normal";
    }
    if (this.noiseLevel <= NOISE_LIMITS.warningMax) {
      return "warning";
    }
    return "critical";
  }

  updateNoiseLevel(value) {
    if (!NoiseSensor.isValidNoiseLevel(value)) {
      throw new Error(`Неприпустиме значення шуму: ${value}`);
    }
    this.noiseLevel = value;
    this.measurements.push(new NoiseMeasurement(value));
  }

  addMeasurement(measurement) {
    if (!(measurement instanceof NoiseMeasurement)) {
      throw new Error("Очікується об'єкт NoiseMeasurement");
    }
    this.measurements.push(measurement);
    this.noiseLevel = measurement.value;
  }

  static isValidNoiseLevel(value) {
    return Number.isFinite(value) && value >= 0 && value <= 200;
  }

  static fromObject(data) {
    if (!data.id || !data.district || !data.location || data.noiseLevel === undefined) {
      throw new Error("Неповні дані для створення NoiseSensor");
    }
    return new NoiseSensor(data.id, data.district, data.location, data.noiseLevel);
  }
}
