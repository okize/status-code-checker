#!/usr/bin/env node

import { program } from 'commander';
import { checkUrls } from '../src/checker.mjs';

const color = (code, text) => `\x1b[${code}m${text}\x1b[0m`;
const red = (text) => color(31, text);
const green = (text) => color(32, text);

program
  .version('1.0.0')
  .description('Check HTTP status codes for one or more URLs')
  .argument('<urls...>', 'URLs to check (space-separated)')
  .action(async (urls) => {
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
  });

program.parse();
