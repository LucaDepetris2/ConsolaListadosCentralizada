// js/state.js
export const userGroups = {
    global: [],   // módulo centralizador
    ventas: [],
    compras: [],
    tesoreria: []
};

export let currentModule = 'ventas';
export function setCurrentModule(key) { currentModule = key; }

export let draggedItem = null;
export function setDraggedItem(obj) { draggedItem = obj; }
