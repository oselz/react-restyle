import pkg from './package.json';

export default [
  {
    input: 'src/main.js',
    output: {
      name: 'react-restyle',
      file: pkg.browser,
      format: 'umd',
      exports: 'named'
    },
  },
  {
    input: 'src/main.js',
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'es' },
    ]
  }
];
