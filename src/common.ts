export const name = 'create-nwb-app';
export const version = '0.0.1';
export const description = 'Create a next-with-batteries app';

interface Option {
  arg: string;
  description: string;
}

export const options: Option[] = [
  {
    arg: '-t, --template <template>',
    description: 'the template to use, defaults to auth-i18n',
  },
  {
    arg: '--use-npm',
    description: 'optionally use npm',
  },
];

export const command = 'init';

export const defaultTemplate = 'auth-i18n';
