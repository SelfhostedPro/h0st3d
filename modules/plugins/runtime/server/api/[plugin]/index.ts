import { readFile, stat } from 'fs/promises'
import { join } from 'path'
import { usePlugin } from '../../utils/runner'

export default defineEventHandler(async (event) => {
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
    
    if (!plugin.pages || plugin.pages.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'No pages found for this plugin' })
    }

    const firstPage = plugin.pages[0]
    const pagePath = join(plugin.path, 'app', 'pages', firstPage.name)

    try {
        const stats = await stat(pagePath)
        if (stats.isDirectory()) {
            // If it's a directory, return the directory structure
            return {
                type: 'directory',
                name: firstPage.name,
                path: pagePath
            }
        } else {
            // If it's a file, read and return its content
            const pageContent = await readFile(pagePath, 'utf-8')
            return {
                type: 'file',
                name: firstPage.name,
                content: pageContent
            }
        }
    } catch (error) {
        console.error(`Error reading plugin page: ${error}`)
        throw createError({ statusCode: 500, statusMessage: 'Error reading plugin page' })
    }
})
