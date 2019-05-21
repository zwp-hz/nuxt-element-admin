<template>
  <div id="header" class="g-r-center">
    <i
      class="iconfont"
      :class="{'icon-menu-fold': isCollapse, 'icon-menu-fold1': !isCollapse}"
      @click="setStoreData({key: 'isCollapse', value: !isCollapse})"
    ></i>
    <div class="box">
      <el-badge value="1" class="item">
        <i class="el-icon-bell"></i>
      </el-badge>
      <el-tooltip class="item" effect="dark" content="退出登陆" placement="bottom">
        <i @click="logout" class="iconfont icon-logout"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {}
  },

  computed: {
    ...mapState(['user_info', 'isCollapse'])
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setStoreData: 'setStoreData'
    }),
    /**
     * 退出登陆
     */
    logout() {
      this.$router.replace({
        path: '/login',
        query: {
          from_path: this.$route.fullPath
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
#header {
  height: 100%;
  justify-content: flex-start;
  .iconfont {
    cursor: pointer;
  }
  .box {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    .el-badge {
      cursor: pointer;
    }
    .el-icon-bell {
      font-size: 16px;
    }
    .icon-logout {
      margin-left: 15px;
    }
  }
}
</style>
