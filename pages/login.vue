<template>
  <section id="login">
    <div class="main">
      <i class="iconfont icon-logo"></i>
      <el-form :model="loginForm" ref="loginForm" class="demo-ruleForm">
        <el-form-item
          prop="user"
          :rules="[
            { required: true, message: '账号不能为空'}
          ]"
        >
          <el-input
            prefix-icon="iconfont icon-user"
            type="text"
            placeholder="请输入账号"
            v-model="loginForm.user"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[
            { required: true, message: '密码不能为空'}
          ]"
        >
          <el-input
            prefix-icon="iconfont icon-password"
            placeholder="请输入密码"
            v-model="loginForm.password"
            show-password
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
          this.$router.push({
            path: '/'
          })
          localStorage.token = 1
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss'>
#login {
  width: 100vw;
  height: 100vh;
  background-color: #f0f8ff;
  .main {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    max-width: 300px;
    padding: 10px;
    color: #fff;
    text-align: center;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    .icon-logo {
      display: block;
      margin-bottom: 20px;
      font-size: 50px;
      color: #000;
    }
    .el-input__prefix {
      width: 25px;
    }
    button {
      width: 100%;
    }
  }
}
</style>
