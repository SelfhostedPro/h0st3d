
export default defineEventHandler(async (event) => {
    const name = getRouterParam(event, 'plugin')
    if (!name) {
        throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Plugin name is required' })
    }
    return await getPlugin(name)
})