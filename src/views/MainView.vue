<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import BaseStub from '@/components/base/stub/BaseStub.vue'
import ProjectCard from '@/components/project/projectCard/ProjectCard.vue'
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore()

const projects = computed(() => projectsStore.projects)
const isLoading = computed(() => projectsStore.isLoading)

const createProjectModalOpen = ref(false)

onMounted(() => projectsStore.loadProjects())
</script>

<template>
  <div class="wrapper">
    <div class="wrapper__header">
      <div class="wrapper__titles">
        <h1 class="wrapper__title">Проекты</h1>
        <p class="wrapper__subtitle">
          Выберите проект, чтобы перейти к его задачам, или создайте новый
        </p>
      </div>
      <BaseButton text="Создать проект" @click="createProjectModalOpen = true" />
    </div>

    <div v-if="isLoading" v-loading="isLoading" class="wrapper__loader"></div>

    <BaseStub
      v-else-if="!projects.length"
      description="Проектов пока нет. Создайте первый проект"
    />

    <div v-else class="projects">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </div>

  <CreateProjectModal v-model="createProjectModalOpen" />
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__title {
    font-size: 28px;
    font-weight: 600;
    color: var(--el-text-color-primary, #303133);
  }

  &__subtitle {
    margin-top: 6px;
    font-size: 14px;
    color: var(--el-text-color-secondary, #909399);
  }

  &__loader {
    width: 100%;
    min-height: 200px;
  }
}

.projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
</style>
