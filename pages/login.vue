<template>
  <section id="login">
    <div class="main">
      <i class="iconfont icon-logo"></i>
      <el-form ref="loginForm" :model="loginForm" class="demo-ruleForm">
        <el-form-item
          :rules="[
            { required: true, message: '账号不能为空'}
          ]"
          prop="username"
        >
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
            type="text"
            placeholder="请输入账号"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '密码不能为空'}
          ]"
          prop="password"
        >
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-password"
            placeholder="请输入密码"
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
import { mapMutations } from 'vuex'

export default {
  layout: 'else',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },

  computed: {},

  mounted() {},

  methods: {
    ...mapMutations({
      setStoreData: 'setStoreData'
    }),
    /**
     * 表单提交
     * @param {String} formName - 表单名字
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.token = 2
          this.$router.replace({
            path: this.$route.query.from_path || '/'
          })

          // 登录接口请求
          // this.$axios.post('user/login', this.loginForm).then(res => {
          //   if (res.code === 1) {
          //     // 用户信息存储
          //     localStorage.token = res.data.token
          //     localStorage.user_info = JSON.stringify(res.data.user_info)
          //     this.setStoreData({
          //       user_info: res.data.user_info
          //     })
          //     this.$message({
          //       message: '登录成功',
          //       type: 'success'
          //     })
          //     this.$router.replace({
          //       path: this.$route.query.from_path || '/'
          //     })
          //   } else {
          //     this.$message.error({
          //       message: '登录失败，请核定您的账号和密码'
          //     })
          //   }
          // })
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
      font-size: 40px;
      margin: 0 auto;
      margin-bottom: 20px;
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
