import { createJiti } from 'jiti'
import { readJSON } from "fs-extra/esm";
import type { PackageJson } from "type-fest";
import type { GetPlugin } from '@h0st3d/types';
import type { H0st3dPlugin} from '@h0st3d/plugin'

export const usePlugin = async (plugin: GetPlugin, params?: Record<string, unknown>) => {
    const meta = await readJSON(`${plugin.path}/package.json`) as PackageJson
    const entry = meta.module || meta.main
    const jiti = createJiti(import.meta.url, { debug: true })
    const pluginFile = await jiti.import(`${plugin.path}/${entry}`, { default: true }) as H0st3dPlugin
    await pluginFile._init(plugin.path)
    return await pluginFile.info()
}