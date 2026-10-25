import { NoiseSensor } from "./NoiseSensor.js";

export class MobileNoiseSensor extends NoiseSensor {
  constructor(id, district, location, noiseLevel, batteryLevel = 100) {
    super(id, district, location, noiseLevel);
    this.batteryLevel = Math.max(0, Math.min(100, batteryLevel));
  }

  needsCharging() {
    return this.batteryLevel <= 20;
  }
}
