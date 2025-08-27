// js/render.categories.js
import { modulesData } from './data.js';
import { currentModule, setDraggedItem } from './state.js';
import { openFilterModal } from './modal.js';

/**
 * Módulo normal: muestra sus categorías.
 * Módulo "global": muestra cada módulo real como raíz, con sus categorías adentro.
 */
export function renderCategories() {
    const container = document.getElementById('categories-list');
    container.innerHTML = '';

    if (currentModule === 'global') {
        Object.keys(modulesData).forEach(modKey => {
            const root = {
                id: `root-${modKey}`,
                name: modulesData[modKey].name,
                children: modulesData[modKey].categories
            };
            const el = createCategoryElement(root, modKey);
            container.appendChild(el);
            el.classList.add('open');
            const tog = el.querySelector('.toggle-icon');
            if (tog) tog.textContent = '▾';
        });
        return;
    }

    const mod = modulesData[currentModule];
    if (!mod) return;
    mod.categories.forEach(cat => {
        container.appendChild(createCategoryElement(cat, currentModule));
    });
}

/** Crea el nodo de categoría u opción final (originModule indica el módulo real de origen). */
function createCategoryElement(node, originModule) {
    if (node.type === 'final') {
        const optEl = document.createElement('div');
        optEl.className = 'final-option';
        optEl.textContent = node.name;
        optEl.draggable = true;
        optEl.dataset.id = node.id;
        optEl.dataset.module = originModule; // <- necesario para el menú contextual

        optEl.addEventListener('click', () => openFilterModal(node.name));
        optEl.addEventListener('dragstart', (e) => {
            const payload = { type: 'option', id: node.id, module: originModule };
            setDraggedItem(payload);
            e.dataTransfer.setData('text/plain', JSON.stringify(payload));
            e.dataTransfer.effectAllowed = 'copy';
            optEl.classList.add('dragging');
        });
        optEl.addEventListener('dragend', () => optEl.classList.remove('dragging'));
        return optEl;
    }

    const catDiv = document.createElement('div');
    catDiv.className = 'category-item';

    const header = document.createElement('div');
    header.className = 'category-header';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'title';
    titleSpan.textContent = node.name;

    const toggleIcon = document.createElement('span');
    toggleIcon.className = 'toggle-icon';
    toggleIcon.textContent = '▸';

    header.prepend(toggleIcon);
    header.appendChild(titleSpan);
    header.addEventListener('click', () => {
        catDiv.classList.toggle('open');
        toggleIcon.textContent = catDiv.classList.contains('open') ? '▾' : '▸';
    });

    catDiv.appendChild(header);

    const content = document.createElement('div');
    content.className = 'category-content';

    if (Array.isArray(node.children)) {
        node.children.forEach(child => {
            const childEl = createCategoryElement(child, originModule);
            if (child.type !== 'final') childEl.classList.add('subcategory-item');
            content.appendChild(childEl);
        });
    }

    catDiv.appendChild(content);
    return catDiv;
}
