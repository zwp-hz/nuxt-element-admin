<template>
  <section id="login">
    <div class="main">
      <el-form :model="loginForm" ref="loginForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :rules="[
          { required: true, message: '账号不能为空'}
        ]">
          <el-input
            prefix-icon="iconfont icon-user"
            type="text"
            v-model="loginForm.user"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'else',
  data() {
    return {
      loginForm: {
        user: '',
        password: ''
      }
    }
  },

  computed: {},

  mounted() {},

  methods: {
    /**
     * 表单提交
     * @param {String} formName - 表单名字
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
#login {
  width: 100vw;
  height: 100vh;
  .main {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #fff;
    text-align: center;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
}
</style>
