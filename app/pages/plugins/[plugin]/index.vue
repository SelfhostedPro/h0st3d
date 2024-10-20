<template>
  <div>
    <component :is="dynamicComponent" v-if="dynamicComponent" />
    <div v-else>Loading plugin component...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted } from 'vue'
import type { H0st3dPlugin } from '~~/packages/plugin'

const route = useRoute()
const name = route.params.plugin as string
const pluginInfo = await usePluginInfo(name)
const { data: plugin, error: fetchError } = await useFetch<H0st3dPlugin>(`/api/${pluginInfo.name}`)

if (!plugin.value || fetchError.value) {
  console.error(fetchError.value)
}

const dynamicComponent = ref(null)

onMounted(async () => {
  if (plugin.value?.pages?.[0]) {
    const firstPage = plugin.value.pages[0]
    const componentPath = `/data/plugins/${name}/dist/app/pages/${firstPage.name}`
    
    dynamicComponent.value = defineAsyncComponent(() => 
      import(/* @vite-ignore */ componentPath)
        .catch(err => {
          console.error(`Failed to load plugin component: ${err}`)
          return { template: '<div>Error loading component</div>' }
        })
    )
  } else {
    console.error('No pages found for this plugin')
  }
})
</script>
