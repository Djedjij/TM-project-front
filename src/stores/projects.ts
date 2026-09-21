import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TProject, TProjectCreateRequest } from '@/api/projects/types'
import { createProject, getProjects, getProject } from '@/api/projects'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<TProject[]>([])
  const isLoading = ref(false)
  const project = ref<TProject | null>(null)

  const loadProjects = async () => {
    try {
      isLoading.value = true
      const res = await getProjects()
      if (res.data) {
        projects.value = res.data
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const createNewProject = async (data: TProjectCreateRequest) => {
    try {
      isLoading.value = true
      const res = await createProject(data)
      if (res) {
        loadProjects()
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  const loadProject = async (id: string) => {
    try {
      isLoading.value = true
      const res = await getProject(id)
      if (res.data) {
        project.value = res.data
      }
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    project,
    isLoading,
    loadProjects,
    createNewProject,
    loadProject,
  }
})
