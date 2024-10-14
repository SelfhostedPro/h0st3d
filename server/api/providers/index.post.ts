import { PluginRegistrySchema, PluginSchema } from "~~/modules/types/types/PluginManager"

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => PluginRegistrySchema.parse(body))
    return await addRegistryProvider(body)
})