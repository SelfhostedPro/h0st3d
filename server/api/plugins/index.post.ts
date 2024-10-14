import { PluginSchema } from "~~/modules/types/types/PluginManager"

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => PluginSchema.parse(body))
    return await addPlugin(body)
})