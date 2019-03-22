<template>
  <section>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="日期" prop="date" width="120" sortable>
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="btns">
      <el-button @click="allSelection()">全选</el-button>
    </div>
  </section>
</template>

<script>
let data = [
  {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  },
  {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  },
  {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }
]

export default {
  data() {
    return {
      loading: true,
      tableData: [],
      multipleSelection: []
    }
  },
  created() {
    setTimeout(() => {
      this.loading = false
      this.tableData = data
    }, 1000)
  },
  mounted() {},
  methods: {
    /**
     * 全选
     */
    allSelection() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang='scss' scoped>
.btns {
  margin: 20px 0 0 20px;
}
</style>
