<template>
  <div :class="['login-wrapper', ['', 'login-form-right', 'login-form-left'][direction]]">
    <el-form ref="form" size="large" :model="form" :rules="rules" class="login-form ele-bg-white"
      @keyup.enter.native="doSubmit">
      <h4>卡号平台</h4>
      <el-form-item prop="userName">
        <el-input clearable v-model="form.userName" prefix-icon="el-icon-user" :placeholder="'账号'" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input show-password v-model="form.password" prefix-icon="el-icon-lock" :placeholder="'密码'" />
      </el-form-item>
      <div class="el-form-item">
        <el-checkbox v-model="form.remember">{{ $t('login.remember') }}</el-checkbox>
      </div>
      <div class="el-form-item">
        <el-button size="large" type="primary" class="login-btn" :loading="loading" @click="doSubmit">
          {{ loading ? $t('login.loading') : $t('login.login') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import setting from '@/config/setting';
import request from '@/utils/request'

export default {
  name: 'Login',
  data() {
    return {
      direction: 0,
      // 加载状态
      loading: false,
      // 表单数据
      form: {},
      text: ''
    };
  },
  computed: {
    // 表单验证规则
    rules() {
      return {
        userName: [
          { required: true, message: this.$t('login.userName'), type: 'string', trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('login.password'), type: 'string', trigger: 'blur' }
        ],
      };
    },
    // 当前语言
    language() {
      return this.$i18n.locale;
    }
  },
  mounted() {
    if (setting.takeToken()) {
      this.goHome();
    }
  },
  methods: {
    /* 提交 */
    doSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        request({
          url: 'backend/login',
          method: 'post',
          data: this.form
        }).then((res) => {
          this.loading = false;
          console.log(res, 'res');
          if (res.data) {
            this.$message.success('登录成功');
            this.$store.dispatch('user/setToken', {
              token: res.data,
              remember: this.form.remember
            }).then(() => {
              this.goHome();
            });
          }else{
            this.$message.error(res.errno);
          }
        })
      });
    },
    /* 跳转到首页 */
    goHome() {
      const query = this.$route.query;
      const path = query && query.from ? query.from : '/';
      this.$router.push(path).catch(() => {
      });
    },
  }
}
</script>

<style scoped>
/* 背景 */
.login-wrapper {
  padding: 50px 20px;
  position: relative;
  box-sizing: border-box;
  background-image: url("~@/assets/bg-login.png");
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
}

.login-wrapper:before {
  content: "";
  background-color: rgba(0, 0, 0, .2);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 卡片 */
.login-form {
  margin: 0 auto;
  width: 380px;
  max-width: 100%;
  padding: 25px 30px;
  position: relative;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  border-radius: 4px;
  z-index: 2;
}

.login-form-right .login-form {
  margin: 0 15% 0 auto;
}

.login-form-left .login-form {
  margin: 0 auto 0 15%;
}

.login-form h4 {
  text-align: center;
  margin: 0 0 25px 0;
}

.login-form>.el-form-item {
  margin-bottom: 25px;
}

/* 验证码 */
.login-input-group {
  display: flex;
  align-items: center;
}

.login-input-group ::v-deep .el-input {
  flex: 1;
}

.login-captcha:hover {
  opacity: .75;
}

.login-btn {
  display: block;
  width: 100%;
}

/* 第三方登录图标 */
.login-oauth-icon {
  color: #FFF;
  padding: 5px;
  margin: 0 10px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
}

/* 底部版权 */
.login-copyright {
  color: #eee;
  padding-top: 20px;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 响应式 */
@media screen and (min-height: 550px) {
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -220px;
  }

  .login-form-right .login-form,
  .login-form-left .login-form {
    left: auto;
    right: 15%;
    transform: translateX(0);
    margin: -220px auto auto auto;
  }

  .login-form-left .login-form {
    right: auto;
    left: 15%;
  }

  .login-copyright {
    position: absolute;
    bottom: 20px;
    right: 0;
    left: 0;
  }
}

@media screen and (max-width: 768px) {

  .login-form-right .login-form,
  .login-form-left .login-form {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    margin-right: auto;
  }
}
</style>
