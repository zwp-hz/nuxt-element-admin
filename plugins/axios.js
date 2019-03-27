import qs from "qs";

export default function({ $axios, redirect }) {
  $axios.onRequest(config => {
    config.timeout = "10000";
    config.data.token = localStorage.token;
    if (config.url.indexOf("http") === -1) {
      config.baseURL = process.env.PATH_API[process.env.NUXT_ENV_PATH];
    }

    if (config.method !== "get") {
      config.data = qs.stringify(config.data);
    }
  });

  $axios.onResponse(res => {
    // token失效或者未登录跳转到登录页
    if (res.data.code === -1) {
      redirect("/login");
    } else {
      return res.data;
    }
  });

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 500) {
      redirect("/500");
    }
  });
}
