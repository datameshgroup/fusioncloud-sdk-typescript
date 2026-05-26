/**
 * Mirrors `DataMeshGroup.Fusion.LogLevel`. Ordered by severity; the FusionClient
 * suppresses log events below the configured level.
 */
export const LogLevel = {
  Trace: 0,
  Debug: 1,
  Information: 2,
  Warning: 3,
  Error: 4,
  Critical: 5,
  None: 6,
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export interface LogEventArgs {
  logLevel: LogLevel;
  createdDateTime: Date;
  data: string;
  exception?: Error;
}
