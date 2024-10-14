import { createJiti } from 'jiti'
import { readJSON } from "fs-extra/esm";
import type { PackageJson } from "type-fest";
import type { GetPlugin } from '~~/modules/types/types/PluginManager';

export const usePlugin = async (plugin: GetPlugin, params: any) => {
    console.log(plugin)
    const meta = await readJSON(`${plugin.path}/package.json`) as PackageJson
    console.log(meta)

    const entry = meta.type == 'module' ? meta.module : meta.main
    const jiti = createJiti(import.meta.url, { debug: true })
    const pluginFile = await jiti.import(`${plugin.path}/${entry}`, { default: true }) as (params: any) => Promise<any>
    return await pluginFile(params)
}