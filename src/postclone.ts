import { sync } from 'cross-spawn';
import { rmdirSync, copyFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';

export function clone(url: string, name: string) {
  // eslint-disable-next-line no-console
  console.log(`Cloning repository ${url}...`);

  sync('git', ['clone', url, name], { stdio: 'ignore' });
}

export function tryGitInit(path: string) {
  try {
    // eslint-disable-next-line no-console
    console.log('\nSetting up new repository...');

    const gitPath = resolve(path, '.git');

    rmdirSync(gitPath, { recursive: true });
    sync('git', ['init'], { cwd: path, stdio: 'ignore' });

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Git repo not initialized:', error.message);
    return false;
  }
}

export function tryGitCommit(path: string) {
  try {
    sync('git', ['add', '-A'], { cwd: path, stdio: 'ignore' });
    sync(
      'git',
      [
        'commit',
        '--no-verify', // skip commitlint rules here
        '-m',
        '"Initialize project using create-nwb-app"',
      ],
      {
        cwd: path,
        stdio: 'ignore',
      }
    );

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Git commit not created:', error.message);

    return false;
  }
}

export function install(path: string, useNpm: boolean = false) {
  // eslint-disable-next-line no-console
  console.log('\nInstalling dependencies...');

  const cmd = useNpm ? 'npm' : 'yarn';
  const args = useNpm ? ['install'] : [];

  const proc = sync(cmd, args, {
    cwd: path,
    stdio: 'inherit',
  });

  if (proc.status !== 0) {
    // eslint-disable-next-line no-console
    console.error(`\`${cmd} ${args.join(' ')}\` failed`);
    return;
  }

  if (useNpm) {
    unlinkSync(resolve(path, 'yarn.lock'));
  }

  // eslint-disable-next-line no-console
  console.log('Finished installing dependencies!');
}

export function copyEnv(path: string) {
  // eslint-disable-next-line no-console
  console.log('Moving .env file...');
  copyFileSync(resolve(path, '.env.example'), resolve(path, '.env'));
}
