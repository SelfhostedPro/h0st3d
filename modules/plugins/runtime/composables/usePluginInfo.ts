import { useClientConfig } from '~~/modules/config/runtime/composables/client-config.js'
export const usePluginInfo = async (name: string) => {
    const config = useClientConfig()
    const plugin = config.value?.plugins.installed.find(plugin => plugin.name == name)
    if (!plugin) {
        console.error(`Plugin ${name} not found`)
        console.error(plugin)
        console.log('config:',config.value)
        throw new Error(`Plugin ${name} not found`)
    }
    return plugin
}