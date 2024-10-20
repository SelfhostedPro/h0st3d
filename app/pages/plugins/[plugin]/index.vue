<template>
  <div>
    <div v-if="error">Error: {{ error }}</div>
    <component :is="dynamicComponent" v-else-if="dynamicComponent" />
    <div v-else>Loading plugin component...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue'
import type { H0st3dPlugin } from '~~/packages/plugin'

const route = useRoute()
const name = route.params.plugin as string
const pluginInfo = await usePluginInfo(name)
const { data: plugin, error: fetchError } = await useFetch<H0st3dPlugin>(`/api/${pluginInfo.name}`, {
  onResponseError({ response }) {
    error.value = `Failed to fetch plugin data: ${response.statusText}`
  }
})

const dynamicComponent = ref(null)
const error = ref(null)

onMounted(async () => {
  if (fetchError.value) {
    error.value = `Failed to fetch plugin data: ${fetchError.value.message}`
    return
  }

  if (!plugin.value?.pages?.length) {
    error.value = 'No pages found for this plugin'
    return
  }

  const firstPage = plugin.value.pages[0]
  const componentPath = `/data/plugins/${name}/dist/app/pages/${firstPage.name}`
  
  try {
    dynamicComponent.value = defineAsyncComponent(() => 
      import(/* @vite-ignore */ componentPath)
    )
  } catch (err) {
    error.value = `Failed to load plugin component: ${err.message}`
  }
})
</script>
