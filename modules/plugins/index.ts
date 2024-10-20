import { defineNuxtModule, addImportsDir, createResolver, addServerPlugin } from '@nuxt/kit'
import { addServerScanDir, installModule } from 'nuxt/kit'
import configModule from '../config'
import { loadConfig } from 'c12'
import type { NuxtConfigLayer } from 'nuxt/schema'

export default defineNuxtModule({
    meta: {
        name: 'plugins',
    },
    async setup(resolvedOptions, nuxt) {
        await installModule(configModule, null, nuxt)
        const resolver = createResolver(import.meta.url)

        const config = await loadConfig<BaseConfig>({
            cwd: nuxt.options.hosted.configPath,
            // configFile: 'config.yaml',
            name: 'config',
            rcFile: false,
            dotenv: false,
        })

        const plugins = config.config.plugins.installed

        plugins.map(async plugin => {
            console.log(`Installing plugin: ${plugin.name}`)
            const pluginResolver = createResolver(plugin.path)
            nuxt.options._layers.push(
                {
                    config: {
                        srcDir: pluginResolver.resolve('.'),
                        rootDir: pluginResolver.resolve('.'),
                        ...nuxt.options.config
                    },
                    cwd: pluginResolver.resolve('.'),
                } as NuxtConfigLayer
            )
        })

        addImportsDir(resolver.resolve('./runtime/composables'))

        addServerPlugin(resolver.resolve('./plugin/plugins.ts'))
        addServerScanDir(resolver.resolve('./runtime/server/'))
    },

})