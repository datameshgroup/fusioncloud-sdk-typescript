import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FusionClient,
  LoginRequest,
  LogLevel,
  SaleCapability,
  UnifyURL,
  type LogEventArgs,
  type SaleCapability as SaleCapabilityT,
} from '../../../src/index.js';

export interface IntegrationTestSettings {
  ProfileName?: string;
  SaleID: string;
  POIID: string;
  KEK: string;
  ProviderIdentification: string;
  ApplicationName: string;
  SoftwareVersion: string;
  CertificationCode: string;
  UseTestEnvironment: boolean;
  OperatorID?: string | null;
  ShiftNumber?: string | null;
  EnableLogFile?: boolean;
  EnableVolumeTest?: boolean;
  CustomURL?: string;
}

const FIXTURE_DIR = dirname(fileURLToPath(import.meta.url));
const SETTINGS_PATH = resolve(FIXTURE_DIR, 'IntegrationTestSettings.json');
const LOG_PATH = resolve(FIXTURE_DIR, '..', '..', '..', 'IntegrationTest.log');

export const settingsAvailable = existsSync(SETTINGS_PATH);

export function loadSettings(): IntegrationTestSettings {
  return JSON.parse(readFileSync(SETTINGS_PATH, 'utf8')) as IntegrationTestSettings;
}

export class FusionClientFixture {
  readonly settings: IntegrationTestSettings;
  readonly client: FusionClient;
  readonly saleToPOIRequestHistory: unknown[] = [];

  constructor() {
    this.settings = loadSettings();
    const caps: SaleCapabilityT[] = [SaleCapability.CashierStatus, SaleCapability.PrinterReceipt];
    this.client = new FusionClient({ useTestEnvironment: this.settings.UseTestEnvironment });
    this.client.LoginRequest = new LoginRequest(
      this.settings.ProviderIdentification,
      this.settings.ApplicationName,
      this.settings.SoftwareVersion,
      this.settings.CertificationCode,
      caps,
    );
    this.client.SaleID = this.settings.SaleID;
    this.client.POIID = this.settings.POIID;
    this.client.KEK = this.settings.KEK;
    if (this.settings.CustomURL) {
      this.client.CustomURL = this.settings.CustomURL;
      this.client.URL = UnifyURL.Custom;
    }

    if (this.settings.EnableLogFile) {
      this.client.on('log', (e: LogEventArgs) => {
        try {
          appendFileSync(LOG_PATH, `${new Date().toISOString()} ${e.logLevel}\t\t${e.data}\n`);
        } catch {
          // ignore log write errors
        }
      });
    }
    this.client.LogLevel = LogLevel.Trace;
  }

  async dispose(): Promise<void> {
    await this.client.disconnectAsync();
  }
}
