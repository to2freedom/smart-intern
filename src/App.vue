<script setup lang="ts">
import AppHeader from '@/common/AppHeader.vue'
import AppFooter from '@/common/AppFooter.vue'
</script>

<template>
  <div class="app-container">
    <app-header />
    <main class="main-content">
      <router-view />
    </main>
    <app-footer />
  </div>
</template>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .main-content {
    flex: 1;
    margin-top: 60px;
    margin-bottom: 60px;
    padding: 20px;
    overflow-y: auto;
  }
}
</style>
