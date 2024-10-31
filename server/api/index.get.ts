import { defineEventHandler, useNitroApp } from '#imports'
export default defineEventHandler(async () => {
    const nitro = useNitroApp()
    return nitro
})