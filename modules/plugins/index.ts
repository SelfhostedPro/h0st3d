import { defineNuxtModule, addImportsDir, createResolver, addServerPlugin, installModule, useNitro } from '@nuxt/kit'
import { addServerScanDir } from 'nuxt/kit'
import configModule from '../config'
import { loadConfig } from 'c12'
import { join } from 'pathe'
import { defaultConfigOptions } from '../config'

export default defineNuxtModule({
    meta: {
        name: 'plugins',
    },
    async setup(resolvedOptions, nuxt) {
        console.log("initializing plugin module...")
        await installModule(configModule, null, nuxt)


        const resolver = createResolver(import.meta.url)

        const config = await loadConfig<BaseConfig>({
            cwd: nuxt.options.hosted.configPath,
            // configFile: 'config.yaml',
            name: 'config',
            rcFile: false,
            dotenv: false,
        })

        const pluginPath = join(defaultConfigOptions.dataPath, 'plugins/')
        nuxt.options.modules.push(pluginPath)


        console.log('nuxt modules:', nuxt.options.modules)


        addImportsDir(resolver.resolve('./runtime/composables'))

        addServerPlugin(resolver.resolve('./plugin/plugins.ts'))
        addServerScanDir(resolver.resolve('./runtime/server/'))
    },

})