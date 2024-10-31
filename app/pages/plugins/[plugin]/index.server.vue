<template>
    <div>
        <component :is="dynamicComponent" />
    </div>
</template>
<script setup lang="ts">
import type { H0st3dPlugin } from '~~/packages/plugin';
const route = useRoute()
const name = route.params.plugin as string
const pluginInfo = await usePluginInfo(name)
const { data: plugin, error: fetchError } = await useFetch<H0st3dPlugin>(`/api/${pluginInfo.name}`)
if (!plugin.value || fetchError.value) {
    console.error(fetchError.value)
}
console.log('plugin value:', plugin.value)

if (!plugin.value!.pages![0]!.parentPath) {
    throw new Error('No pages found')
}
// console.log(`fetching plugin page: ${plugin.value!.pages![0]!.parentPath}/${plugin.value!.pages![0]!.name}`)

const dynamicComponent = defineAsyncComponent(() => {
    const firstPage = plugin.value?.pages?.[0]
    try {
        return import(/* @vite-ignore */ `${firstPage?.parentPath}/${firstPage?.name}`)
        // return import(/* @vite-ignore */ `/data/plugins/${name}/dist/app/pages/${firstPage?.name}`)
    } catch (err) {
        throw createError(`Failed to load plugin component: ${err}`)
    }
})

</script>
<!-- 
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
  // import { compile } from 'vue/compiler-dom'
  
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
  </script> -->
  