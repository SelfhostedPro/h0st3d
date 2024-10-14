import type { GetPlugin, GetPluginRegistry, Plugin, PluginRegistry } from "~~/modules/types/types/PluginManager"
import { registryProvider, downloadTemplate } from 'giget'
import { ensureDir } from 'fs-extra'
import { v4 as uuidv4 } from 'uuid';

const dataPath = useRuntimeConfig().hosted.dataPath
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


export const getPlugins = async (): Promise<GetPlugin[]> => {
    const config = await useConfig()
    return config.plugins.installed as GetPlugin[]
}

export const getPlugin = async (name: string): Promise<GetPlugin | undefined> => {
    const config = await useConfig()
    return config.plugins.installed.find(p => p.name === name)
}

export const addPlugin = async (plugin: Plugin) => {
    const config = await useConfig()
    const _registry = config.plugins.providers.find(r => r.name === plugin.provider)

    if (!_registry) {
        throw createError(`Registry provider ${plugin.provider} not found`)
    }
    const provider = registryProvider(_registry.url, { auth: _registry.auth })

    await ensureDir(`${dataPath}/plugins/${plugin.name}`)

    console.log(`Downloading plugin: ${_registry.name}:${plugin.name}`)
    const { source, dir } = await downloadTemplate(`provider:${plugin.name}`, {
        providers: { provider },
        cwd: `${dataPath}/plugins/`,
        dir: plugin.name,
        install: true
    })
    config.plugins.installed.push({
        id: uuidv4(),
        version: '0.0.1',
        path: `${dataPath}/plugins/${plugin.name}`,
        name: plugin.name,
        provider: plugin.provider,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })
    await updateConfig(config, configPath)

    return config.plugins.installed.find(p => p.name === plugin.name)
}

export const updatePlugin = async (name: string) => {
    // Get plugin from config
    const config = await useConfig()
    const _plugin = config.plugins.installed.findIndex(p => p.name === name)
    const plugin = config.plugins.installed[_plugin]
    if (!plugin) {
        throw createError(`Plugin ${name} not found`)
    }
    // Get registry provider from config
    const _registry = config.plugins.providers.find(r => r.name === plugin.provider)
    if (!_registry) {
        throw createError(`Registry provider ${plugin.provider} not found`)
    }
    const provider = registryProvider(_registry.url, { auth: _registry.auth })
    // Download latest version of plugin
    const { source, dir } = await downloadTemplate(`provider:${plugin.name}`, {
        providers: { provider },
        cwd: `${dataPath}/plugins/`,
        forceClean: true,
        dir: plugin.name,
        install: true
    })
    // Update plugin in config
    config.plugins.installed[_plugin]!.updatedAt = new Date().toISOString()
    await updateConfig(config, configPath)
    return config.plugins.installed[_plugin]
}