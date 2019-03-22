import actions from './mutations'

/**
 * store 数据
 * @param {Boolean} device.isMobile - 是否为手机环境
 * @param {Object} user_info - 用户信息
 * @param {Boolean} isCollapse - 是否折叠
 * @param {String} url_path - 路由地址
 * @param {Array} breadcrumb_list - 面包屑列表
 * @param {Array} menu_list - 菜单列表
 */
let data = {
  user_info: {},
  isCollapse: false,
  url_path: '',
  breadcrumb_list: [],
  menu_list: [
    { key: '', name: '首页', icon: 'iconfont icon-index' },
    {
      key: 'order',
      name: '订单',
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
}

export const state = () => data
export const mutations = actions
