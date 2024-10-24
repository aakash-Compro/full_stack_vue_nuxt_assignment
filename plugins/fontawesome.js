// plugins/fontawesome.js
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faPlusCircle, faInbox, faCalendarDay, faFilter, faTags } from '@fortawesome/free-solid-svg-icons';

import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

library.add(faPlusCircle, faInbox, faCalendarDay, faFilter, faTags);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});