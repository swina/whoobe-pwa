const { createVuePlugin } = require('vite-plugin-vue2');
import { loadEnv } from 'vite';
import ViteComponents from 'vite-plugin-components'
import ViteFonts from 'vite-plugin-fonts'
//import { VitePWA } from 'vite-plugin-pwa'
import fetch from 'node-fetch'
import fs from 'fs-extra'

async function autoConfig(){ 
  //load configuration file from external resource (generate by CMS)
  var project = await fetch ( process.env.VITE_API_URL + '/config.json' ).then ( res => res.json() ).then ( pr => { return pr })
  if ( project ){
    //create local project file use by tailwind.config.js to purge
    fs.writeFileSync ( './project.json' , JSON.stringify(project) )
    //font families to load
    var fnts = project.fonts 
    //add Material Icons font
    fnts.push ( 'Material Icons' )
    project.fonts = fnts
    return project
  }
}

export default async ({ command, mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  //get the fonts array
  const config = await autoConfig()
  return {
    plugins: [
      createVuePlugin(),
      ViteComponents({ deep:true }),
      ViteFonts({
        google: {
          families: config.fonts
        }
      })
    ],
    server: {
      hmr : { overlay: false }
    }
  }
};