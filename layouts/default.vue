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
  head: {
    script: [
      {
        src: '/g2.min.js'
      },
      {
        src: '/data-set.min.js'
      }
    ]
  },
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
      this.pageInit()
    }
  },
  created() {},
  mounted() {
    let u = navigator.userAgent

    this.setStoreData({
      key: 'isCollapse',
      value: /(iPhone|iPad|iPod|iOS|Android|Linux)/i.test(u)
    })

    this.pageInit()
  },
  methods: {
    ...mapMutations({
      setStoreData: 'setStoreData',
      setBreadcrumb: 'setBreadcrumb'
    }),
    /**
     * 页面初始化
     */
    pageInit() {
      let { token, user_info } = localStorage,
        { path, fullPath } = this.$route

      if (path !== '/login' && !token) {
        this.$router.replace({
          path: '/login',
          query: {
            from_path: fullPath
          }
        })
      } else if (user_info && !this.user_info.realName) {
        this.setStoreData({
          key: 'user_info',
          value: JSON.parse(user_info)
        })
      }

      this.setBreadcrumb(path.replace(/\/$/, ''))
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

