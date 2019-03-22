<template>
  <div>
    <el-container style="height: 100vh;">
      <el-aside class="u_transition_300" :width="isCollapse ? '64px' : '200px' ">
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
    $route() {
      this.pageInit()
    }
  },
  created() {},
  mounted() {
    this.pageInit()

    let u = navigator.userAgent

    this.setStoreData({
      key: 'isCollapse',
      value: /(iPhone|iPad|iPod|iOS|Android|Linux)/i.test(u)
    })
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
      if (!localStorage.token) {
        this.$router.replace({
          path: '/login'
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

