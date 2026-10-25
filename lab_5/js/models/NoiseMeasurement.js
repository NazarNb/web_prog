export class NoiseMeasurement {
  constructor(value, measuredAt = new Date()) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error("Некоректне значення рівня шуму для вимірювання");
    }
    this.value = value;
    this.measuredAt = measuredAt instanceof Date ? measuredAt : new Date(measuredAt);
  }

  toString() {
    return `${this.value} dB (${this.measuredAt.toLocaleTimeString()})`;
  }
}
