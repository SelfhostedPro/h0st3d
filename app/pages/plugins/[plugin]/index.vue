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
// console.log('plugin value:', plugin.value)

if (!plugin.value!.pages![0]!.parentPath) {
    throw new Error('No pages found')
}
// console.log(`fetching plugin page: ${plugin.value!.pages![0]!.parentPath}/${plugin.value!.pages![0]!.name}`)

const dynamicComponent = defineAsyncComponent(() => {
    const firstPage = plugin.value?.pages?.[0]
    try {
        // return import(/* @vite-ignore */ `${firstPage?.parentPath}/${firstPage?.name}`)
        return import(/* @vite-ignore */ `/data/plugins/${name}/dist/app/pages/${firstPage?.name}`)
    } catch (err) {
        throw createError(`Failed to load plugin component: ${err}`)
    }
})

</script>