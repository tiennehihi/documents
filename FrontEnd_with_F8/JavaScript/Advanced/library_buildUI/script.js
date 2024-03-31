import { attach } from './store.js'
import App from './component/App.js'

// attach(() => '<h1>Hello World</h1>', document.getElementById('root'))
attach(App, document.getElementById('root'))