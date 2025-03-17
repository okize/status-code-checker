#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { checkUrls } from '../src/checker.mjs';

program
  .version('1.0.0')
  .description('Check HTTP status codes for one or more URLs')
  .argument('<urls...>', 'URLs to check (space-separated)')
  .action(async (urls) => {
    try {
      const results = await checkUrls(urls);
      results.forEach(({ url, status, error }) => {
        if (error) {
          console.error(chalk.red(`❌ ${url}: ${error}`));
        } else {
          console.log(chalk.green(`✅ ${url}: ${status}`));
        }
      });
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program.parse();
