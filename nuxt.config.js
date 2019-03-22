const pkg = require('./package')
const { PATH_API } = require('./assets/js/utils')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  loading: { color: '#fff' },
  env: {
    NUXT_ENV_PATH: process.env.NUXT_ENV_PATH || 'dev',
    PATH_API: PATH_API
  },
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/base.scss',
    '@/assets/css/font.scss'
  ],
  plugins: ['@/plugins/axios', '@/plugins/filters', '@/plugins/element-ui'],
  modules: ['@nuxtjs/axios'],
  axios: {
    retry: { retries: 2 }
  },
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
