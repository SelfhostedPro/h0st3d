<template>
  <div>
    <div v-if="error">Error: {{ error }}</div>
    <div v-else-if="pluginData">
      <div v-if="pluginData.type === 'directory'">
        Directory: {{ pluginData.name }}
      </div>
      <div v-else-if="pluginData.type === 'file'">
        <div v-html="compiledTemplate"></div>
      </div>
    </div>
    <div v-else>Loading plugin component...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { compile } from 'vue/compiler-dom'

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

const error = ref<string | null>(null)
const compiledTemplate = ref<string>('')

onMounted(() => {
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
      const { code } = compile(pluginData.value.content, {
        mode: 'module'
      })
      compiledTemplate.value = code
    } catch (err) {
      error.value = `Failed to compile plugin component: ${(err as Error).message}`
    }
  }
})
</script>
