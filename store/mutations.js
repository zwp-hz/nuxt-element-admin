const mutations = {
  /**
   * 基于store key  直接修改数据
   * @param {Object} data - 参数 {key: '', value: ''}
   */
  setStoreData(state, data) {
    state[data.key] = data.value
  },
  /**
   * 通过path地址设置面包屑列表数据
   * @param {String} path - router 地址
   */
  setBreadcrumb(state, path) {
    let paths = path.split('/'),
      array = []

    // 通过key获取对应的name
    paths.splice(0, 1)
    paths.forEach((item, index) => {
      let param = state.menu_list

      if (index === 1) {
        param = state.menu_list[array[0].index].child
      } else if (index === 2) {
        param = state.menu_list[array[0].index].child[array[1].index].child
      }

      for (let i = 0; i < param.length; i++) {
        if (item === param[i].key) {
          array.push({
            name: param[i].name,
            index: i
          })

          break
        }
      }
    })

    state.breadcrumb_list = array.map(item => item.name)
    state.url_path = path
  }
}

export default mutations
