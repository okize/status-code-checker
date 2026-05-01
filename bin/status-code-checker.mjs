#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { checkUrls } from '../src/checker.mjs';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

const color = (code, text) => `\x1b[${code}m${text}\x1b[0m`;
const red = (text) => color(31, text);
const green = (text) => color(32, text);

const { values, positionals: urls } = parseArgs({
  options: {
    help: { type: 'boolean', short: 'h' },
    version: { type: 'boolean', short: 'v' },
  },
  allowPositionals: true,
  strict: true,
});

if (values.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (values.help || urls.length === 0) {
  console.log('Usage: status-check <urls...>');
  console.log('Check HTTP status codes for one or more URLs');
  console.log('\nOptions:');
  console.log('  -v, --version  Show version number');
  console.log('  -h, --help     Show help');
  process.exit(0);
}

try {
  const results = await checkUrls(urls);
  results.forEach(({ url, status, error }) => {
    if (error) {
      console.error(red(`❌ ${url}: ${error}`));
    } else {
      console.log(green(`✅ ${url}: ${status}`));
    }
  });
} catch (error) {
  console.error(red(`Error: ${error.message}`));
  process.exit(1);
}
