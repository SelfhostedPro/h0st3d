import { PluginRegistrySchema, PluginSchema } from "@h0st3d/types"

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => PluginRegistrySchema.parse(body))
    return await addRegistryProvider(body)
})