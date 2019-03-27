# nuxt-element-admin

## 特别注意

如果要使用 cnpm 下载包请在 package.json 添加 core-js@2 版本
cnpm i core-js@2 --save-dev

## 目录结构介绍

    |-- assest                        	  // 资源文件
    |-- components                    	  // 组件
    |-- layouts                           // 布局文件
    |-- middleware                        // 中间件
    |-- pages                             // 页面
    |-- plugins                           // 插件
    |-- static                            // 静态文件
    |-- store                             // Vuex 状态树
    |-- .eslintrc.js                      // eslint 配置文件
    |-- .prettierrc                       // prettierrc 配置文件
    |-- nuxt.config.js                    // nuxt 配置文件
    |-- package.json                      // 项目及工具的依赖配置文件
    |-- README.md                         // 说明

## 构建生产

    // 包安装
    npm install

    // 本地环境
    npm run dev

    // 开发环境
    npm run generate

    // 测试环境
    npm run development

    // 预发环境
    npm run pre

    // 线上环境
    npm run online

### 如何通过 axios 请求接口？

```javascript
this.$axios
  .post(url, {})
  .then(res => {})
  .catch(err => {})
```

### 菜单组件生成配置 后续接入了权限管理 可以加上 disabled

```
  menu_list: [
    { key: '', name: '首页', icon: 'iconfont icon-index', disabled: false },
    {
      key: 'order',
      name: '订单中心',
      icon: 'el-icon-tickets',
      child: [
        { key: 'order1', name: '订单1' },
        {
          key: 'order2',
          name: '订单2',
          child: [{ key: 'order3', name: '订单3' }]
        }
      ]
    },
    { key: 'setting', name: '设置', icon: 'el-icon-setting' }
  ]
```

### 不同环境的请求 host 配置

```
// 配置地址
~/aseets/js/utils.js

exports.PATH_API = {
  dev: '', // 开发
  test: '', // 测试
  pre: '', // 预发
  online: '' // 线上
}
```
