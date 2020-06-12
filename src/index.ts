/* eslint-disable no-console */
import { Command } from 'commander';
import { existsSync, rmdirSync } from 'fs';
import { resolve } from 'path';
import { exit } from 'process';

import {
  options,
  defaultTemplate,
  description,
  name,
  version,
  makeUrl,
} from './common';
import { tryGitInit, install, copyEnv, tryGitCommit, clone } from './utils';

const program = new Command(name).version(version).description(description);

options.forEach(({ description, arg }) => {
  program.option(arg, description);
});

program.parse(process.argv);

const template = program.template || defaultTemplate;
const projectName =
  program.template || `next-with-batteries-${defaultTemplate}`;

if (existsSync(projectName)) {
  // eslint-disable-next-line no-console
  console.error(
    `A folder with the name
>>> "${projectName}"
already exists.

Please rename or remove it before trying again.`
  );
  exit(1);
}

const workingDirectory = resolve(process.cwd(), projectName);
const url = makeUrl(template);

try {
  clone(url, projectName);

  const gitInitialized = tryGitInit(workingDirectory);

  copyEnv(workingDirectory);
  install(workingDirectory, program.useNpm);

  if (gitInitialized) {
    tryGitCommit(workingDirectory);
  }
} catch (error) {
  // rollback
  rmdirSync(projectName, { recursive: true });

  // eslint-disable-next-line no-console
  console.warn(`An error occured during project initialization.
  Please ensure that
    - the template exists: "${url}"
    - you're online
  
  Error: "${error.message}"
  `);
}
