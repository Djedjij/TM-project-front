<script setup lang="ts">
import { ArrowDown, Right } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";
import { computed } from "vue";
const userStore = useUserStore();

const userName = computed(() => userStore.userData?.name || "");

const { logoutUser } = userStore;
</script>

<template>
  <div class="header">
    <div class="user-panel">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          {{ userName }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logoutUser" :icon="Right">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/main.scss' as *;
.header {
  width: 100%;
  height: 80px;
  border-bottom: 1px solid $gray-400;
  padding: 20px;
  display: flex;
  align-items: center;
}
</style>
