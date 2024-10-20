import { usePlugin } from '../../../utils/runner'
export default defineEventHandler(async (event) => {
    const rest = event.context.params?.plugin?.split('/')
    const name = rest?.shift()
    if (!name) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid plugin name' })
    }
    const plugin = await getPlugin(name)
    if (!plugin) {
        throw createError({ statusCode: 404, statusMessage: 'Plugin not found' })
    }

    return usePlugin(plugin, { ...rest })
})