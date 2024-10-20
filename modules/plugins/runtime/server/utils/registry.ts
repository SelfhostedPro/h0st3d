import type { GetPluginRegistry, PluginRegistry } from "@h0st3d/types"

const configPath = useRuntimeConfig().hosted.configPath

export const getRegistryProviders: () => Promise<GetPluginRegistry[]> = async () => {
    const config = await useConfig()
    const providers: GetPluginRegistry[] = config.plugins.providers.map(provider => ({ name: provider.name, url: provider.url, auth: provider.auth !== undefined }))
    return providers
}

export const addRegistryProvider = async (provider: PluginRegistry) => {
    const config = await useConfig()
    config.plugins.providers.push(provider)
    await updateConfig(config, configPath)
    return config.plugins.providers
}