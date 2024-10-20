<template>
  <div>
    <div v-if="error">Error: {{ error }}</div>
    <component :is="dynamicComponent" v-else-if="dynamicComponent" />
    <div v-else-if="pluginData">
      <div v-if="pluginData.type === 'directory'">
        Directory: {{ pluginData.name }}
      </div>
      <div v-else-if="pluginData.type === 'file'">
        <pre>{{ pluginData.content }}</pre>
      </div>
    </div>
    <div v-else>Loading plugin component...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue'
import type { H0st3dPlugin } from '~~/packages/plugin'

const route = useRoute()
const name = route.params.plugin as string
const pluginInfo = await usePluginInfo(name)
const { data: pluginData, error: fetchError } = await useFetch<{
  type: 'directory' | 'file' | 'error';
  name?: string;
  content?: string;
  files?: string[];
  message?: string;
  stack?: string;
}>(`/api/${pluginInfo.name}`)

const dynamicComponent = ref<any>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  if (fetchError.value) {
    error.value = `Failed to fetch plugin data: ${fetchError.value.message}`
    return
  }

  if (!pluginData.value) {
    error.value = 'No data found for this plugin'
    return
  }

  if (pluginData.value.type === 'file' && pluginData.value.content) {
    try {
      const component = defineAsyncComponent(() => 
        Promise.resolve({
          template: pluginData.value?.content
        })
      )
      dynamicComponent.value = component
    } catch (err) {
      error.value = `Failed to load plugin component: ${(err as Error).message}`
    }
  }
})
</script>
