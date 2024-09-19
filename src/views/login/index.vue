<template>
  <div class="login">
    <div class="login__box">
      <h2 class="login__box-title">
        Gilgamesh 后台管理系统
      </h2>
      <el-form ref="ruleFormRef" label-position="right" :model="loginForm" :rules="loginFormRules" label-width="auto" status-icon hide-required-asterisk>
        <el-form-item label="用户" prop="username">
          <el-input
            v-model.trim="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            auto-complete="off"
            :prefix-icon="User"
            maxlength="64"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.trim="loginForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
            :prefix-icon="Lock"
            clearable
            minlength="6"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item class="el-form-item el-form-item-rememberMe">
          <el-checkbox v-model="loginForm.rememberMe" label="记住我" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login__btn" @click="submitForm(ruleFormRef)">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { sysUser } from "@/api"

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

const ruleFormRef = ref<FormInstance>();

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  rememberMe: true,
});

const loginFormRules = reactive<FormRules<LoginForm>>({
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
});

async function submitForm(formEl: FormInstance | undefined) {
  if (formEl == null)
    return;
  await formEl.validate((valid: boolean) => {
    if (valid) {
      // vue3 axios封装统一处理接口
      const result = sysUser.login({username: loginForm.username, password: loginForm.password, verifyCode: 'n24e'});
      console.log(result);
    }
  });
}

// function validatePassword(rule, value, callback) {
//   if (!value || value.length < 6) {
//     callback(new Error('密码最少6位'));
//   } else {
//     callback();
//   }
// }

// onUpdated(async () => {});

// onMounted(async () => {
//   // 拿到租户数据
//   const res = await proxy.$api.sys_tenant.list();
//   tenantList.value = res.data;
// });

// function handleLogin() {
//   proxy.$refs.loginFormRef.validate((valid) => {
//     if (valid) {
//       login(loginForm).then(() => {
//         const fullPath = proxy.$route.fullPath;
//         if (fullPath.startsWith('/login?redirect=')) {
//           const lastPath = fullPath.replace('/login?redirect=', '');
//           // 跳转到上次退出的页面
//           proxy.$router.push({ path: lastPath });
//         } else {
//           // 跳转到首页
//           proxy.$router.push({ path: '/' });
//         }
//       });
//     }
//   });
// }
</script>

  <style lang="scss" scoped>
.login {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #00aaff;
    box-sizing: border-box;

    &__box {
      width: 50rem;
      padding: 3.2rem 4.8rem;
      margin: 0 auto;
      text-align: center;
      border-radius: 9px;
      background-color: #fafcff;
      box-shadow: 0 10px 15px rgba(#ccc, 0.2);
      &-title {
        font-size: 1.8rem;
        letter-spacing: -1.5px;
        margin-bottom: 3.2rem;
      }
    }

    &__btn {
      display: inline-block;
      width: 100%;
      margin: 0 auto;
      text-align: center;
    }
  }
  </style>
