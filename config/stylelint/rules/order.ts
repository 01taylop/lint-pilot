// https://github.com/hudochenkov/stylelint-order

export default {
  'order/order': [
    'custom-properties',
    'dollar-variables',
    'less-mixins',
    'at-variables',
    {
      name: 'extends',
      type: 'at-rule',
    },
    'at-rules',
    'declarations',
    'rules',
    {
      hasBlock: true,
      name: 'include',
      parameter: 'media',
      type: 'at-rule',
    },
    {
      hasBlock: true,
      name: 'media',
      type: 'at-rule',
    },
  ],
}
