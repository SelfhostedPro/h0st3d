import { readFile } from 'fs/promises'
import { usePlugin } from '../../utils/runner'
export default defineEventHandler(async (event) => {
    // console.log('event', event)
    const rest = event.context.params?.plugin?.split('/')
    const name = rest?.shift()
    if (!name) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid plugin name' })
    }
    const pluginInfo = await getPlugin(name)
    if (!pluginInfo) {
        throw createError({ statusCode: 404, statusMessage: 'Plugin not found' })
    }
    const plugin = await usePlugin(pluginInfo, { ...rest })
    const page = plugin.pages?.[0]
    return await readFile(`${page?.parentPath}`)
})

// import { usePlugin } from '../../utils/runner'
// export default defineEventHandler(async (event) => {
//     // console.log('event', event)
//     const rest = event.context.params?.plugin?.split('/')
//     const name = rest?.shift()
//     if (!name) {
//         throw createError({ statusCode: 400, statusMessage: 'Invalid plugin name' })
//     }
//     const plugin = await getPlugin(name)
//     if (!plugin) {
//         throw createError({ statusCode: 404, statusMessage: 'Plugin not found' })
//     }

//     return usePlugin(plugin, { ...rest })
// })