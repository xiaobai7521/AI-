<template>
  <el-aside :width="isCollapsed ? '64px' : '264px'">
    <el-menu
      :collapse="isCollapsed"
      :collapse-transition="false"
      default-active="dashboard"
      class="menu-style"
      router
    >
      <div class="brand">
        <el-image
          style="width: 50px; height: 50px; margin-right: 10px"
          :src="IconUrl"
          alt="logo"
        />
        <div v-show="!isCollapsed" class="info-card">
          <h1 class="brand-title">心理健康AI助手</h1>
          <p class="brand-subtitle">管理后台</p>
        </div>
      </div>
      <el-menu-item
        v-for="{ path, meta: { icon, title } } in router.options.routes[0]
          .children"
        :key="path"
        :index="path"
      >
        <el-icon><component :is="icon" /></el-icon>
        <span>{{ title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useAdminStore from '@/stores/admin'
// import * as Icons from "@element-plus/icons-vue";

const router = useRouter()

const IconUrl = new URL('@/assets/images/机器人.png', import.meta.url).href

const isCollapsed = computed(() => useAdminStore().isCollapsed)
</script>

<style lang="scss" scoped>
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #fff;
  border-radius: 1px solid #e5e7eb;
  margin-right: 20px;
  .info-card {
    .brand-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 5px;
      color: #1f2937;
    }
    .brand-subtitle {
      font-size: 14px;
      color: #6b7280;
    }
  }
}
.menu-style {
  height: 100%;
}
</style>
