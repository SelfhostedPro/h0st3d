import { type BaseConfig } from "~~/modules/config/types/config";


export const defaultConfig: BaseConfig = {
    name: 'Hosted',
    auth: true,
    plugins: {
        providers: [],
        installed: [],
    },
    sessionTimeout: 60 * 60 * 24,
}