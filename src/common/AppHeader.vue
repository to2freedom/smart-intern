<template>
  <el-header class="app-header">
    <div class="header-container">
      <!-- 页面logo -->
      <router-link to="/" class="brand">
        <el-icon class="logo">
          <Opportunity />
        </el-icon>
        <h1>实习助手</h1>
      </router-link>

      <!-- 导航菜单 -->
      <el-menu :default-active="activeIndex" mode="horizontal" :router="true" class="nav-menu">
        <el-menu-item index="/">个人主页</el-menu-item>
        <el-menu-item index="/positions">岗位管理</el-menu-item>
        <el-menu-item index="/skills">技能训练</el-menu-item>
      </el-menu>

      <!-- 用户信息 -->
      <div class="user-info">
        <el-dropdown>
          <span class="user-wrapper">
            <el-avatar :size="36" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span class="username">任家恒</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Opportunity } from '@element-plus/icons-vue'

const route = useRoute()
const activeIndex = ref('/')

watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.app-header {
  --el-header-padding: 0 20px;
  height: 60px;
  border-bottom: 1px solid var(--el-border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;

  .header-container {
    height: 100%;
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;

    .brand {
      display: flex;
      align-items: center;
      text-decoration: none;
      margin-right: 40px;

      .logo {
        font-size: 24px;
        color: var(--el-color-primary);
        margin-right: 8px;
      }

      h1 {
        font-size: 20px;
        color: var(--el-text-color-primary);
        margin: 0;
      }
    }

    .nav-menu {
      flex: 1;
      border-bottom: none;
    }

    .user-info {
      margin-left: auto;

      .user-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;

        .username {
          margin-left: 8px;
          font-size: 14px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .app-header {
    .header-container {
      padding: 0 10px;

      .brand h1 {
        display: none;
      }

      .nav-menu {
        :deep(.el-menu-item) {
          padding: 0 10px;
          font-size: 14px;
        }
      }

      .user-info .username {
        display: none;
      }
    }
  }
}
</style>