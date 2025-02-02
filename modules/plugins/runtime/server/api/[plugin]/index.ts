// import { readFile } from 'fs/promises'
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
    // const page = plugin.pages?.[0]
    return plugin
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

// import { readFile, stat, readdir } from 'fs/promises'
// import { join } from 'path'
// import { usePlugin } from '../../utils/runner'
// import type { GetPlugin } from '@h0st3d/types'

// export default defineEventHandler(async (event) => {
//     try {
//         const rest = event.context.params?.plugin?.split('/')
//         const name = rest?.shift()
//         if (!name) {
//             throw createError({ statusCode: 400, statusMessage: 'Invalid plugin name' })
//         }
//         const pluginInfo = await getPlugin(name) as GetPlugin
//         if (!pluginInfo) {
//             throw createError({ statusCode: 404, statusMessage: 'Plugin not found' })
//         }
//         const plugin = await usePlugin(pluginInfo, { ...rest })
        
//         if (!plugin.pages || plugin.pages.length === 0) {
//             throw createError({ statusCode: 404, statusMessage: 'No pages found for this plugin' })
//         }

//         const firstPage = plugin.pages[0]
//         if (!firstPage) {
//             throw createError({ statusCode: 404, statusMessage: 'No first page found for this plugin' })
//         }

//         const pagePath = join(plugin.path, 'app', 'pages', firstPage.name)

//         const stats = await stat(pagePath)
//         if (stats.isDirectory()) {
//             const files = await readdir(pagePath)
//             return {
//                 type: 'directory' as const,
//                 name: firstPage.name,
//                 path: pagePath,
//                 files: files
//             }
//         } else {
//             const pageContent = await readFile(pagePath, 'utf-8')
//             return {
//                 type: 'file' as const,
//                 name: firstPage.name,
//                 content: pageContent // Send the full content, including script and style tags
//             }
//         }
//     } catch (error) {
//         console.error(`Error in plugin API handler: ${error}`)
//         return {
//             type: 'error' as const,
//             message: (error as Error).message,
//             stack: (error as Error).stack
//         }
//     }
// })
