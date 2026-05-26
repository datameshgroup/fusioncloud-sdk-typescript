import { arch, platform, release } from 'node:os';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

let cachedVersion: string | undefined;

function readSdkVersion(): string {
  if (cachedVersion) return cachedVersion;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    // dist/util/userAgent.js → dist/.. → package root
    const pkgPath = resolve(here, '..', '..', 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string };
    cachedVersion = pkg.version ?? 'UNKNOWN';
  } catch {
    cachedVersion = 'UNKNOWN';
  }
  return cachedVersion!;
}

/**
 * Reproduces the C# `SaleSoftware.GetAssemblyVersionData` format:
 *   DataMesh.Fusion/<sdkVersion>(<runtime>; <osVersion>; <appArch>; <osArch>)
 */
export function sdkUserAgent(): string {
  const base = 'DataMesh.Fusion';
  try {
    const ver = readSdkVersion();
    const runtime = `Node.js ${process.version}`;
    const osVersion = `${platform()} ${release()}`;
    const appArchitecture = process.arch === 'x64' ? 'Win64' : 'Win32';
    const osArchitecture = arch() === 'x64' ? 'x64' : 'x86';
    return `${base}/${ver}(${runtime}; ${osVersion}; ${appArchitecture}; ${osArchitecture})`;
  } catch {
    return base;
  }
}
