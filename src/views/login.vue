<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登陆您的账户</h2>
        <p>请输入您的用户名和密码</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            size="large"
            placeholder="请输入用户名"
            @keydown.enter="handleKeyDown"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            size="large"
            placeholder="请输入密码"
            type="password"
            show-password
            @keydown.enter="handleKeyDown"
          />
        </el-form-item>
        <el-button
          class="btn"
          size="large"
          type="primary"
          @click="submitForm(ruleFormRef)"
        >
          登录
        </el-button>
      </el-form>
      <div class="footer">
        <p>
          还没有账户?
          <router-link to="/auth/register">去注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/admin'

const ruleFormRef = ref()
const router = useRouter()

const formData = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 处理键盘事件
const handleKeyDown = e => {
  if (e.key === 'Enter') {
    submitForm(ruleFormRef.value)
  }
}

// 登录
const submitForm = async formEl => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      login(formData)
        .then(data => {
          // 判断token是否存在
          if (!data.token) {
            ElMessage.error('登录失败，请检查用户名和密码')
            return
          }
          // 登录成功，将token和userInfo信息存储到localStorage中
          localStorage.setItem('token', data.token)
          localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
          // 根据用户角色决定跳转的路径
          if (data.userInfo.userType === 2) {
            router.push('/back/dashboard')
          } else {
            router.push('/')
          }
        })
        .catch(error => {
          // 捕获登录失败的错误
          console.error('登录失败:', error)
        })
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  width: 384px;
  .title {
    .back-home {
      margin-bottom: 60px;
    }
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
