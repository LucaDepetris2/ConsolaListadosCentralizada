// js/actions.js
import { userGroups, currentModule } from './state.js';
import { modulesData } from './data.js';
import { renderGroups } from './render.groups.js';
import { renderCategories } from './render.categories.js';
import { appPrompt } from './modal.js';

export function setupActions() {
    // Crear grupo (funciona en cualquier módulo, incluido "Global")
    document.getElementById('add-group-btn').addEventListener('click', async () => {
        const nombre = await appPrompt({ title: 'Nuevo grupo', label: 'Nombre del nuevo grupo:' });
        if (nombre) {
            const id = 'grp-' + Date.now();
            (userGroups[currentModule] ||= []).push({ id, name: nombre, items: [], children: [], collapsed: false });
            renderGroups();
        }
    });

    // Nueva opción final personalizada (si estás en Global, por defecto la crea en Ventas)
    document.getElementById('add-option-btn').addEventListener('click', async () => {
        const nombre = await appPrompt({ title: 'Nueva opción', label: 'Nombre de la nueva opción final:' });
        if (nombre) {
            const modKey = currentModule === 'global' ? 'ventas' : currentModule;
            let mod = modulesData[modKey];
            if (!mod) return;
            let personal = mod.categories.find(c => c.id === modKey + '-personalizadas');
            if (!personal) {
                personal = { id: modKey + '-personalizadas', name: 'Personalizadas', children: [] };
                mod.categories.push(personal);
            }
            const id = modKey + '-custom-' + Date.now();
            personal.children.push({ id, name: nombre, type: 'final' });
            renderCategories();
        }
    });
}
