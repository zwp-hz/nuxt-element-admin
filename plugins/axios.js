import qs from 'qs'

export default function({ $axios, redirect }) {
  $axios.onRequest(config => {
    if (config.url.indexOf('http') === -1) {
      config.baseURL = process.env.PATH_AP[process.env.NUXT_ENV_PATH]
      config.timeout = '10000'
    }

    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
  })

  $axios.onResponse(res => {
    // token失效或者未登录跳转到登录页
    if (res.data.code === 2000) {
      redirect('/login')
    } else {
      return res.data
    }
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 500) {
      redirect('/500')
    }
  })
}
