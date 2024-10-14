import { z } from 'zod'

export const PluginRegistrySchema = z.object({
    name: z.string(),
    url: z.string(),
    auth: z.string().optional()
})

export const GetPluginRegistrySchema = PluginRegistrySchema.extend({
    auth: z.boolean().optional()
})

export type PluginRegistry = z.infer<typeof PluginRegistrySchema>
export type GetPluginRegistry = z.infer<typeof GetPluginRegistrySchema>

export const PluginSchema = z.object({
    name: z.string(),
    provider: z.string(),
})

export const getPluginSchema = PluginSchema.extend({
    id: z.string(),
    path: z.string(),
    version: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    description: z.string().optional()
})

export type Plugin = z.infer<typeof PluginSchema>
export type GetPlugin = z.infer<typeof getPluginSchema>