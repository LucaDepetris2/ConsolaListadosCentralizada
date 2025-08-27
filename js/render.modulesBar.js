// js/render.modulesBar.js
import { modulesData } from './data.js';
import { currentModule, setCurrentModule } from './state.js';
import { renderCategories } from './render.categories.js';
import { renderGroups } from './render.groups.js';

export function renderModulesBar() {
    const bar = document.getElementById('modules-bar');
    bar.innerHTML = '';

    // “Global” primero, luego los módulos definidos en data.js
    const keys = ['global', ...Object.keys(modulesData)];

    keys.forEach(key => {
        const name = key === 'global' ? 'Global' : modulesData[key].name;
        const div = document.createElement('div');
        div.className = 'module' + (key === currentModule ? ' active' : '');
        div.textContent = name;
        div.addEventListener('click', () => {
            setCurrentModule(key);
            renderModulesBar();
            renderCategories();
            renderGroups();
        });
        bar.appendChild(div);
    });
}
