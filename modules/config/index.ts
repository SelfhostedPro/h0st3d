import { defineNuxtModule, addImportsDir, createResolver, addServerPlugin, addRouteMiddleware } from '@nuxt/kit'
import { defu } from 'defu'
import { addServerImportsDir, addServerScanDir } from 'nuxt/kit'
import { join } from 'path'


export interface ConfigOptions {
    /**
     * @default process.env.NODE_ENV === 'production' ? '../config' : './config'
     */
    configPath: string,
    /**
     * @default process.env.NODE_ENV === 'production' ? '../data' : './data'
     */
    dataPath: string
}

export const defaultConfigOptions: ConfigOptions =
{
    configPath: process.env.NODE_ENV === 'production' ? './config' : './config',
    dataPath: process.env.NODE_ENV === 'production' ? './data' : './data'
}

export default defineNuxtModule({
    meta: { name: 'config' },
    async setup(options, nuxt) {
        const resolver = createResolver(import.meta.url)

        // Get paths from environment variables or use our default options
        const configOptions = defu({
            configPath: process.env.CONFIG_PATH,
            dataPath: process.env.DATA_PATH
        }, {
            configPath: join(nuxt.options.rootDir, defaultConfigOptions.configPath),
            dataPath: join(nuxt.options.rootDir, defaultConfigOptions.dataPath)
        })

        // Add config options to runtime config
        nuxt.options.hosted = nuxt.options.hosted ||= {
            ...configOptions
        }

        nuxt.options.runtimeConfig.hosted = nuxt.options.runtimeConfig.hosted ||= {
            ...configOptions
        }
        addImportsDir(resolver.resolve('runtime/composables'))
        addRouteMiddleware({
            name: 'config',
            path: resolver.resolve('runtime/middleware/config.ts'),
            global: true
        })
        addServerScanDir(resolver.resolve('runtime/server'))

        addServerImportsDir(resolver.resolve('types'))
        addImportsDir(resolver.resolve('types'))
        addServerPlugin(resolver.resolve('plugin/01-server-config.ts'))
    }
})



declare module '@nuxt/schema' {
    interface NuxtOptions {
        hosted: ConfigOptions
    }
    interface RuntimeConfig {
        hosted: ConfigOptions
    }
}