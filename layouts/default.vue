<template>
  <div>
    <el-container style="height: 100vh;">
      <el-aside :width="isCollapse ? '64px' : '200px' " class="u_transition_300">
        <Menu/>
      </el-aside>
      <el-container>
        <el-header height="40px">
          <Header/>
        </el-header>
        <el-main class="main">
          <Breadcrumb/>
          <nuxt class="container"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Menu from '~/components/menu'
import Header from '~/components/header'
import Breadcrumb from '~/components/breadcrumb'

export default {
  components: {
    Menu,
    Header,
    Breadcrumb
  },
  computed: {
    ...mapState(['isCollapse'])
  },
  watch: {
    $route(to, from) {
      this.pageInit(from.path)
    }
  },
  created() {},
  mounted() {
    let u = navigator.userAgent

    this.setStoreData({
      key: 'isCollapse',
      value: /(iPhone|iPad|iPod|iOS|Android|Linux)/i.test(u)
    })

    this.pageInit(this.$route.path)
  },
  methods: {
    ...mapMutations({
      setStoreData: 'setStoreData',
      setBreadcrumb: 'setBreadcrumb'
    }),
    /**
     * 页面初始化
     * @param {String} path - 路由地址
     */
    pageInit(path) {
      let { token, user_info } = localStorage

      if (!token) {
        this.$router.replace({
          path: '/login',
          query: {
            from_path: path
          }
        })
      } else if (user_info) {
        this.setStoreData({
          key: 'user_info',
          value: JSON.parse(user_info)
        })
      }

      this.setBreadcrumb(this.$route.path)
    }
  }
}
</script>

<style lang='scss' scoped>
.main {
  display: flex;
  flex-direction: column;
  background-color: #eff0f4;
}
</style>

