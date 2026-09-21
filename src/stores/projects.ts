import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TProject, TProjectCreateRequest } from '@/api/projects/types'
import { createProject, getMyProjects, getProject } from '@/api/projects'
import toast from '@/components/base/toast/toast'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<TProject[]>([])
  const isLoading = ref(false)
  const project = ref<TProject | null>(null)

  const loadProjects = async () => {
    try {
      isLoading.value = true
      const res = await getMyProjects()
      projects.value = res ?? []
    } catch (e) {
      console.log(e)
      toast.error('Не удалось загрузить проекты')
    } finally {
      isLoading.value = false
    }
  }

  const createNewProject = async (data: TProjectCreateRequest) => {
    try {
      isLoading.value = true
      const res = await createProject(data)
      if (res) {
        toast.success('Проект создан')
        await loadProjects()
      }
      return res ?? null
    } catch (e) {
      console.log(e)
      toast.error('Не удалось создать проект')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const loadProject = async (id: string) => {
    try {
      isLoading.value = true
      project.value = null
      const res = await getProject(id)
      project.value = res ?? null
    } catch (e) {
      console.log(e)
      project.value = null
      toast.error('Не удалось загрузить проект')
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
