export default defineEventHandler(async () => {
    const config = await useConfig()
    return config
})