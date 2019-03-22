<template>
  <div id="menu" :class="{fold: isCollapse}">
    <img class="logo" src="~/assets/images/logo.png" alt>
    <el-menu
      :collapse="isCollapse"
      :default-active="url_path"
      class="el-menu-vertical-demo"
      text-color="#fff"
      background-color="#545c64"
      active-text-color="#ffd04b"
      :router="true"
    >
      <template v-for="i of menu_list">
        <el-submenu v-if="i.child" :index="`/${i.key}`" :key="`/${i.key}`">
          <template slot="title">
            <i v-if="i.icon" :class="i.icon"/>
            <span slot="title">{{ i.name }}</span>
          </template>
          <template v-for="j of i.child">
            <el-submenu v-if="j.child" :index="`/${i.key}/${j.key}`" :key="`/${i.key}/${j.key}`">
              <span slot="title">{{ j.name }}</span>
              <el-menu-item
                v-for="l of j.child"
                :index="`/${i.key}/${j.key}/${l.key}`"
                :key="`/${i.key}/${j.key}/${l.key}`"
              >
                <span slot="title">{{ l.name }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :index="`/${i.key}/${j.key}`" :key="`/${i.key}/${j.key}`">
              <span slot="title">{{ j.name }}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item v-else :index="`/${i.key}`" :key="`/${i.key}`">
          <i v-if="i.icon" :class="i.icon"/>
          <span slot="title">{{ i.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['menu_list', 'isCollapse', 'url_path'])
  },
  created() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
#menu {
  height: 100%;
  padding-top: 10px;
  background-color: #545c64;
  .logo {
    display: block;
    width: 40px;
    margin: 0 auto;
  }
  &.fold span {
    opacity: 0;
  }
  .el-menu {
    border-color: #545c64;
    .iconfont {
      display: inline-block;
      width: 24px;
      margin-right: 5px;
      font-size: 18px;
      text-align: center;
      vertical-align: middle;
    }
  }
}
</style>
