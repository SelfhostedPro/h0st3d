import type { Component } from '@nuxt/schema'
import type { Dirent } from 'fs-extra';
import { readdirSync, pathExistsSync, readFileSync } from 'fs-extra';
import type { H0st3dPluginOptions } from '@h0st3d/types'
import type { RouteRecordRaw } from 'vue-router';
import { compileTemplate, compileScript, parse } from '@vue/compiler-sfc'
import type { EventHandler, EventHandlerRequest } from 'h3';
import { join } from 'pathe'
import { defineComponent } from 'vue';

interface ApiPlugin {
    path: string
    name: string
    handler: Promise<EventHandler<EventHandlerRequest, any>>
}

export class H0st3dPlugin {
    public readonly name: string;
    public path: string;
    public pages: Dirent[] | undefined;
    public components: Dirent[] | undefined;
    public apis: ApiPlugin[] | undefined;
    public init: (path: string) => void;
    constructor(options: H0st3dPluginOptions) {
        this.name = options.name;
        console.log(`cwd: ${process.cwd()}`, readdirSync("."))
        this.path = "";
        this.init = options.init || this._init;
        this.pages = pathExistsSync(`${this.path}/app/pages`) ? readdirSync(`${this.path}/app/pages`, { recursive: true, withFileTypes: true }) : undefined
        this.components = pathExistsSync(`${this.path}/app/components`) ? readdirSync(`${this.path}/app/components`, { recursive: true, withFileTypes: true }) : undefined
        this.apis = pathExistsSync(`${this.path}/api`) ? this.loadApis(readdirSync(`${this.path}/api`, { recursive: true, withFileTypes: true })) : undefined
        // this.apis = pathExistsSync(`${options.path}/api`) ? readdirSync(`${options.path}/api`, { recursive: true, withFileTypes: true }) : undefined
    }
    private loadPages(pages: Dirent[]) {
        return pages.map(page => {
            // const relativePath = page.parentPath.replace(`${this.path}`, '')
            // const component = import(`${this.path}/app/pages/${page.name}`) as Promise<Component>
            // return { name: page.name, parentPath: relativePath } as Dirent
            return page
        })
    }
    private loadComponents(components: Dirent[]) {
        return components.map(_component => {
            // const relativePath = _component.parentPath.replace(this.path, '')
            // // const component = import(`${this.path}/app/components/${_component.name}`) as Promise<Component>
            // return { name: _component.name, parentPath: relativePath } as Dirent
            return _component
        })
    }
    private loadApis(apis: Dirent[]) {
        return apis.map(_api => {
            const api = import(`${this.path}/api/${_api.name}`) as Promise<EventHandler>
            return { path: `${_api.name}`, name: _api.name, handler: api } as ApiPlugin
        })
    }
    public async info() {
        return {
            name: this.name,
            pages: this.pages,
            components: this.components,
            apis: this.apis
        }
    }
    public async _init(path: string) {
        console.log(`${this.name} plugin initialized`)
        this.path = join(process.cwd(), 'data/plugins', this.name, 'dist')
        const pagesExist = pathExistsSync(`${this.path}/app/pages`)
        const componentsExist = pathExistsSync(`${this.path}/app/components`)
        const apisExist = pathExistsSync(`${this.path}/api`)

        console.log(this.path)
        console.log(`pages exist: ${pagesExist}`)
        console.log(`components exist: ${componentsExist}`)
        console.log(`apis exist: ${apisExist}`)

        this.pages = pagesExist ? this.loadPages(readdirSync(`${this.path}/app/pages`, { recursive: true, withFileTypes: true })) : undefined
        this.components = componentsExist ? this.loadComponents(readdirSync(`${this.path}/app/components`, { recursive: true, withFileTypes: true })) : undefined
        this.apis = apisExist ? this.loadApis(readdirSync(`${this.path}/api`, { recursive: true, withFileTypes: true })) : undefined
    }
    // private async loadPages(pages: Dirent[]) {
    //     return pages.map(({name, parentPath}) => {
    //         const relativePath = parentPath.replace(this.path,'')
    //         return {name, path: relativePath}
    //     })
    // }
    public async getPage(path: string, params: any) {
        const page = this.pages?.find(async page => (await page).path === path)
        if (!page) return undefined
        return page
    }
    public async getApi(path: string, params: any) {
        const api = this.apis?.find(async api => (await api).name === path)
        if (!api) return undefined
        return api
    }
    private compileVueComponent(filePath: string): Promise<Component> {
        return new Promise((resolve, reject) => {
            const source = readFileSync(filePath, 'utf-8')
            const { descriptor } = parse(source)

            let script = ''
            if (descriptor.script || descriptor.scriptSetup) {
                const compiledScript = compileScript(descriptor, {
                    id: filePath,
                    inlineTemplate: true,
                })
                script = compiledScript.content
            }

            const template = compileTemplate({
                source: descriptor.template!.content,
                filename: filePath,
                id: filePath,
            })

            const componentCode = `
                ${script}
                ${template.code}
                export default { ...component, render }
            `

            const component = new Function('Vue', `return (${componentCode})`)(defineComponent)
            resolve(component)
        })
    }
}

export function createPluginSync(options: H0st3dPluginOptions) {
    return new H0st3dPlugin(options)
}

export async function createPlugin(options: H0st3dPluginOptions) {
    return new H0st3dPlugin(options)
}