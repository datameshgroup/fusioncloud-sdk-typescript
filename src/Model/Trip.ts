import type { FieldSchema, Newable } from '../util/json/schema.js';
import { Stop } from './Stop.js';

export class Trip {
  TotalDistanceTravelled?: number;
  Stops: Stop[];

  constructor() {
    this.Stops = [new Stop(0), new Stop(1)];
  }

  /** Convenience accessor for the first stop. */
  get Pickup(): Stop | undefined {
    return this.Stops[0];
  }
  set Pickup(value: Stop) {
    this.ensureMinStops();
    this.Stops[0] = value;
  }

  /** Convenience accessor for the last stop. */
  get Destination(): Stop | undefined {
    return this.Stops[this.Stops.length - 1];
  }
  set Destination(value: Stop) {
    this.ensureMinStops();
    this.Stops[this.Stops.length - 1] = value;
  }

  private ensureMinStops(): void {
    while (this.Stops.length < 2) this.Stops.push(new Stop(this.Stops.length));
  }

  static readonly __schema: readonly FieldSchema[] = [
    { name: 'TotalDistanceTravelled', decimal: true },
    { name: 'Stops', isArray: true, type: Stop as unknown as Newable },
  ];
}
