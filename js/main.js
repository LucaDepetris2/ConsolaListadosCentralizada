// js/main.js
import { renderModulesBar } from './render.modulesBar.js';
import { renderCategories } from './render.categories.js';
import { renderGroups } from './render.groups.js';
import { setupActions } from './actions.js';

document.addEventListener('DOMContentLoaded', () => {
    renderModulesBar();
    renderCategories();
    renderGroups();
    setupActions();
});
