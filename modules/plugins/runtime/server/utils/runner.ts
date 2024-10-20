import { createJiti } from 'jiti'
import { readJSON } from "fs-extra/esm";
import type { PackageJson } from "type-fest";
import type { GetPlugin } from '@h0st3d/types';
import type { H0st3dPlugin } from '@h0st3d/plugin'

export const usePlugin = async (plugin: GetPlugin, params?: Record<string, unknown>): Promise<H0st3dPlugin> => {
    try {
        const meta = await readJSON(`${plugin.path}/package.json`) as PackageJson
        const entry = meta.module || meta.main

        if (!entry) {
            throw new Error('No entry point found in package.json')
        }

        const jiti = createJiti(import.meta.url, { debug: true })
        const pluginFile = await jiti.import(`${plugin.path}/${entry}`, { default: true }) as H0st3dPlugin

        if (!pluginFile || typeof pluginFile._init !== 'function') {
            throw new Error('Invalid plugin file structure')
        }

        await pluginFile._init(plugin.path)
        return pluginFile
    } catch (error) {
        console.error(`Error loading plugin ${plugin.name}:`, error)
        throw error
    }
}
