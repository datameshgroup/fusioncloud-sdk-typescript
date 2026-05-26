import type { Newable } from './schema.js';

/**
 * Mirrors the C# `Type.GetType($"DataMeshGroup.Fusion.Model.{cat}{type}")`
 * lookup in NexoMessageParser. Payload classes register themselves at module
 * load so the parser can resolve `MessageCategory + MessageType` to a concrete
 * constructor without reflection.
 */
const registry = new Map<string, Newable>();

export function registerPayload(category: string, messageType: string, ctor: Newable): void {
  registry.set(key(category, messageType), ctor);
}

export function lookupPayload(category: string, messageType: string): Newable | undefined {
  return registry.get(key(category, messageType));
}

function key(category: string, messageType: string): string {
  return `${category}${messageType}`.toLowerCase();
}
