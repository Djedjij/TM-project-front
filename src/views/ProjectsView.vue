<script setup lang="ts">
import BaseStub from '@/components/base/stub/BaseStub.vue'
import ProjectCard from '@/components/project/projectCard/ProjectCard.vue'
import { useProjectsStore } from '@/stores/projects'
import { onMounted, ref, computed } from 'vue'

const store = useProjectsStore()

const projects = computed(() => store.projects)
const isLoading = computed(() => store.isLoading)

onMounted(() => store.loadProjects())

const openModal = () => {
  createProjectModalOpen.value = true
}

const createProjectModalOpen = ref(false)
</script>

<template>
  <div class="wrapper">
    <div class="projects-empty" v-if="!projects.length && !isLoading">
      <el-row>
        <el-col :sm="24">
          <BaseStub description="Созданных проектов не найдено. Создайте новый проект" />
          <BaseButton text="Создать новый проект" @click="openModal" />
        </el-col>
      </el-row>
    </div>
    <div v-loading="store.isLoading" v-else class="content">
      <div class="content-actions">
        <BaseButton text="Создать новый проект" @click="openModal" />
      </div>
      <div class="projects">
        <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
      </div>
    </div>
  </div>
  <CreateProjectModal v-model="createProjectModalOpen" />
</template>

<style lang="scss" scoped>
@use '@/assets/main.scss' as *;
.wrapper {
  width: 100%;
  display: flex;
}
.projects-empty {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.content {
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.content-actions {
  display: flex;
  gap: 20px;
}

.projects {
  display: flex;
  gap: 24px;
  align-items: center;
}
</style>
