import { PluginSchema } from "@h0st3d/types";

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, (body) => PluginSchema.parse(body))
    return await addPlugin(body)
})