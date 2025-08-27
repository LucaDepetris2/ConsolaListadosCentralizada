// js/main.js
import { renderModulesBar } from './render.modulesBar.js';
import { renderCategories } from './render.categories.js';
import { renderGroups } from './render.groups.js';
import { setupActions } from './actions.js';
import { initContextMenuForCategories } from './contextMenu.js';

document.addEventListener('DOMContentLoaded', () => {
    renderModulesBar();
    renderCategories();
    renderGroups();
    setupActions();
    // Inicializamos el menú contextual una única vez (escucha en #categories-list)
    initContextMenuForCategories();
});
