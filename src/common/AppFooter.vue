<template>
  <el-footer class="app-footer">
    <div class="footer-container">
      <el-row>
        <el-col :xs="24" :md="12">
          <div class="copyright">
            © 2025 实习助手 · 基于 Vue3 & Element Plus 构建
          </div>
        </el-col>

        <el-col :xs="24" :md="12">
          <div class="links">
            <a href="#" target="_blank">GitHub仓库</a>
            <el-divider direction="vertical" />
            <a href="#" target="_blank">使用文档</a>
            <el-divider direction="vertical" />
            <a href="#" target="_blank">关于作者</a>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-footer>
</template>

<script setup lang="ts">
import { ElDivider } from 'element-plus'
</script>

<style lang="scss" scoped>
.app-footer {
  --el-footer-padding: 20px 0;
  background-color: #fafafa;
  border-top: 1px solid var(--el-border-color);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    .copyright {
      color: var(--el-text-color-secondary);
      font-size: 14px;
      text-align: center;

      @media (min-width: 768px) {
        text-align: left;
      }
    }

    .links {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;

      @media (min-width: 768px) {
        justify-content: flex-end;
        margin-top: 0;
      }

      a {
        color: var(--el-text-color-secondary);
        text-decoration: none;
        font-size: 14px;
        transition: color 0.3s;

        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>