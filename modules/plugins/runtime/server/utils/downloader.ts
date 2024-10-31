import { registryProvider, downloadTemplate } from "giget"
import { ensureDir } from "fs-extra"
import { v4 as uuidv4 } from "uuid"
import type { Plugin } from "@h0st3d/types"

const dataPath = useRuntimeConfig().hosted.dataPath
const configPath = useRuntimeConfig().hosted.configPath

export const addPlugin = async (plugin: Plugin) => {
    const config = await useConfig()
    const _registry = config.plugins.providers.find(r => r.name === plugin.provider)

    if (!_registry) {
        throw createError(`Registry provider ${plugin.provider} not found`)
    }
    const provider = registryProvider(_registry.url, { auth: _registry.auth })

    await ensureDir(`${dataPath}/plugins/${plugin.name}`)
    await ensureDir(`${dataPath}/downloads/plugins/${plugin.name}`)


    console.log(`Downloading plugin: ${_registry.name}:${plugin.name}`)
    const { _source, _dir } = await downloadTemplate(`provider:${plugin.name}`, {
        providers: { provider },
        cwd: `${dataPath}/downloads/plugins/`,
        dir: plugin.name,
        install: true
    })
    const pluginInfo = {
        id: uuidv4(),
        version: '0.0.1',
        path: `${dataPath}/plugins/${plugin.name}`,
        name: plugin.name,
        provider: plugin.provider,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
    config.plugins.installed.push(pluginInfo)
    await updateConfig(config, configPath)
    await installPlugin(pluginInfo)

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

    await ensureDir(`${dataPath}/plugins/${plugin.name}`)
    await ensureDir(`${dataPath}/downloads/plugins/${plugin.name}`)

    // Download latest version of plugin
    const { _source, _dir } = await downloadTemplate(`provider:${plugin.name}`, {
        providers: { provider },
        cwd: `${dataPath}/downloads/plugins/`,
        forceClean: true,
        dir: plugin.name,
        install: true
    })
    // Update plugin in config
    config.plugins.installed[_plugin]!.updatedAt = new Date().toISOString()
    await updateConfig(config, configPath)
    await installPlugin(config.plugins.installed.find(p => p.name === plugin.name)!)

    return config.plugins.installed[_plugin]
}
