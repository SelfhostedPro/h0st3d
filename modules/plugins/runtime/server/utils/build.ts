import { existsSync } from "fs"
import { createJiti } from "jiti"
import { build, type BuildConfig } from "unbuild"
import type { GetPlugin } from "@h0st3d/types"

const dataPath = useRuntimeConfig().hosted.dataPath

export async function buildPlugin(plugin: GetPlugin): Promise<void> {
    const jiti = createJiti(`${dataPath}/plugins/${plugin.name}/`, { debug: true, })

    const defaultBuildConfig: BuildConfig = {
        entries: [
            "./src/index.ts",
            {
                builder: "mkdist",
                input: "./src/app/",
                pattern: "**/*.vue",
                loaders: ['vue'],
                outDir: "./dist/app",
            },
            {
                builder: "mkdist",
                input: "./src/app/",
                pattern: "**/*.ts",
                format: 'cjs',
                loaders: ['js'],
                outDir: "./dist/app",
            },
            {
                builder: "mkdist",
                input: "./src/app/",
                pattern: "**/*.ts",
                format: 'esm',
                loaders: ['js'],
                outDir: "./dist/app",
            },
            {
                builder: "mkdist",
                input: "./src/api",
                outDir: "./dist/api",
            }
        ],
        outDir: 'dist',
        declaration: true,
        rollup: {
            emitCJS: true,
        }
    }

    const buildConfig = existsSync(`${plugin.path}/build.config.ts`) ?
        await jiti.import(`${plugin.path}/build.config.ts`, { default: true }) as BuildConfig
        : defaultBuildConfig

    await build(
        `${plugin.path}`, true, buildConfig
    )
    return
}