const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'id'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  localePath: path.resolve('./public/locales'),
  fallbackLng: {
    default: ['en'],
    id: ['en'],
  },
  debug: process.env.NODE_ENV === 'development',
  serializeConfig: false,
  use: [],
  ns: ['common', 'home', 'services', 'pricing', 'faq'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
}