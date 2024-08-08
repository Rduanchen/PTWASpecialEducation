import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueKonva from 'vue-konva';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
// Import all of Bootstrap's JS
// import * as bootstrap from 'bootstrap'

// import "./assets/MyVariable.scss";

const app = createApp(App)

app.use(router)
app.use(VueKonva)

app.mount('#app')
