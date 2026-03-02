<script lang="ts" setup>
import { Component } from 'vue'

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

type TMenuItem = {
  id: string
  title: string
  path: string
  icon?: Component
}

const menuItems: TMenuItem[] = [
  {
    id: 'main',
    title: 'Главная',
    path: '/',
  },
  {
    id: 'boards',
    title: 'Доски задач',
    path: '/boards',
  },
]
</script>

<template>
  <el-col :span="4">
    <el-menu default-active="/" :router="true" class="menu" @open="handleOpen" @close="handleClose">
      <el-menu-item :route="item.path" v-for="item in menuItems" :key="item.id" :index="item.id">
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</template>

<style scoped>
.menu {
  height: 100vh;
}
</style>
