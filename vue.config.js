module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  
  publicPath: process.env.NODE_ENV === 'production'
    ? '/math-generator/'
    : '/',

  pluginOptions: {
    i18n: {
      locale: 'cn',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
      enableBridge: false
    }
  },
}
