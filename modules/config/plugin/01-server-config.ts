
import { checkConfig } from "../runtime/server/utils/config"
import fs from 'fs-extra'

export default defineNitroPlugin((nitroApp) => {
    console.log('initializing config module...')
    return checkConfig().then(() => {
        console.log('config module initialized.')
        return;
    })
})