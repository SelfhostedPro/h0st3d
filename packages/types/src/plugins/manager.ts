import { z } from 'zod'

const PluginRegistrySchema = z.object({
    name: z.string(),
    url: z.string(),
    auth: z.string().optional()
})

const GetPluginRegistrySchema = PluginRegistrySchema.extend({
    auth: z.boolean().optional()
})

type PluginRegistry = z.infer<typeof PluginRegistrySchema>
type GetPluginRegistry = z.infer<typeof GetPluginRegistrySchema>

const PluginSchema = z.object({
    name: z.string(),
    provider: z.string(),
})

const getPluginSchema = PluginSchema.extend({
    id: z.string(),
    path: z.string(),
    version: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    description: z.string().optional()
})

type Plugin = z.infer<typeof PluginSchema>
type GetPlugin = z.infer<typeof getPluginSchema>

export { PluginRegistrySchema, GetPluginRegistrySchema, PluginSchema, getPluginSchema, type PluginRegistry, type GetPluginRegistry, type Plugin, type GetPlugin }