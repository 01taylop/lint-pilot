// https://github.com/AndyOGo/stylelint-declaration-strict-value

export default {
  'scale-unlimited/declaration-strict-value': [
    ['/color$/', 'fill', 'stroke', 'font-size'], {
      disableFix: true,
    },
  ],
}
