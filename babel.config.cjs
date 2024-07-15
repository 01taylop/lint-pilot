module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: 'auto',
      targets: { node: 'current' },
    }],
    '@babel/preset-typescript',
  ],
}
