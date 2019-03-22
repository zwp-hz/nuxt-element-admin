<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/' }" v-if="breadcrumb_list[0] !== '首页'">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item of breadcrumb_list" :key="item">{{ item }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['breadcrumb_list'])
  },
  mounted() {}
}
</script>
<style lang='scss' scoped>
</style>
