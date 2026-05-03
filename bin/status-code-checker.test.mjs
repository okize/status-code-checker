import { describe, it, expect } from 'vitest';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const bin = new URL('./status-code-checker.mjs', import.meta.url).pathname;

const run = (args = []) =>
  execFileAsync(process.execPath, [bin, ...args], {
    timeout: 15000,
    env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' },
  });

describe('status-code-checker CLI', () => {
  it('should print version with --version', async () => {
    const { stdout } = await run(['--version']);
    expect(stdout.trim()).toBe(pkg.version);
  });

  it('should print help with --help', async () => {
    const { stdout } = await run(['--help']);
    expect(stdout).toContain('Usage: status-check');
  });

  it('should print help when no URLs are provided', async () => {
    const { stdout } = await run([]);
    expect(stdout).toContain('Usage: status-check');
  });

  it('should check a valid URL and print status', async () => {
    const { stdout, stderr } = await run(['https://example.com']);
    const output = stdout + stderr;
    expect(output).toMatch(/example\.com/);
    expect(output).toMatch(/\d{3}/);
  });

  it('should print an error for an invalid URL', async () => {
    const result = await run(['https://this-does-not-exist.mock']).catch((e) => e);
    expect(result.stderr).toMatch(/this-does-not-exist\.mock/);
  });

  it('should exit with error for unknown flags', async () => {
    const result = await run(['--bogus']).catch((e) => e);
    expect(result.code).not.toBe(0);
  });
});
