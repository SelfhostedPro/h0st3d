import { z } from 'zod'
import { SecretsSchema } from './secrets'
import { PluginRegistrySchema, getPluginSchema } from '@h0st3d/types'

export const BaseConfigSchema = z.object({
    name: z.string().optional(),
    auth: z.boolean(),
    plugins: z.object({
        providers: z.array(PluginRegistrySchema),
        installed: z.array(getPluginSchema),
    }),
    sessionTimeout: z.number().optional(),
    secrets: z.optional(SecretsSchema),
    extends: z.string().optional(),
})

export type BaseConfig = z.infer<typeof BaseConfigSchema>