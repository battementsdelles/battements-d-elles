module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'ci',
        'build',
        'chore',
        'docs',
        'feat',
        'feature',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'tool',
      ],
    ],
  },
};
