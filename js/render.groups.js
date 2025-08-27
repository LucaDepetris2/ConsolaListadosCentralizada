// js/render.groups.js
import { userGroups, currentModule } from './state.js';
import { findOptionById } from './findOption.js';
import { openFilterModal, appPrompt, appConfirm } from './modal.js';

export function renderGroups() {
    const container = document.getElementById('groups-list');
    container.innerHTML = '';

    const groups = userGroups[currentModule] || [];
    if (!groups.length) return;

    const tree = document.createElement('div');
    tree.className = 'group-tree';
    groups.forEach(g => tree.appendChild(renderGroupNode(g, 0)));
    container.appendChild(tree);
}

function renderGroupNode(group, depth) {
    const groupEl = document.createElement('div');
    groupEl.className = 'group-item';
    groupEl.dataset.groupId = group.id;
    groupEl.style.marginLeft = `${depth * 12}px`;

    // Header
    const header = document.createElement('div');
    header.className = 'group-header';

    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.textContent = group.collapsed ? '▸' : '▾';
    toggle.title = group.collapsed ? 'Expandir' : 'Contraer';
    toggle.onclick = (e) => { e.stopPropagation(); group.collapsed = !group.collapsed; renderGroups(); };

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = group.name;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const addSubBtn = document.createElement('button');
    addSubBtn.title = 'Nuevo subgrupo';
    addSubBtn.textContent = '+';
    addSubBtn.onclick = async (e) => {
        e.stopPropagation();
        const nombre = await appPrompt({ title: 'Nuevo subgrupo', label: 'Nombre del subgrupo:' });
        if (!nombre) return;
        (group.children ||= []).push({ id: 'grp-' + Date.now(), name: nombre, items: [], children: [], collapsed: false });
        renderGroups();
    };

    const renameBtn = document.createElement('button');
    renameBtn.title = 'Renombrar';
    renameBtn.textContent = 'R';
    renameBtn.onclick = async (e) => {
        e.stopPropagation();
        const nombre = await appPrompt({ title: 'Renombrar grupo', label: 'Nuevo nombre:', placeholder: group.name });
        if (nombre) { group.name = nombre; renderGroups(); }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.title = 'Eliminar';
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = async (e) => {
        e.stopPropagation();
        const ok = await appConfirm({ title: 'Eliminar grupo', message: `¿Eliminar el grupo "${group.name}" y todo su contenido?` });
        if (!ok) return;
        group.__deleteMe = true;
        pruneDeleted(currentModule);
        renderGroups();
    };

    actions.append(addSubBtn, renameBtn, deleteBtn);
    header.append(toggle, title, actions);
    groupEl.appendChild(header);

    // Contenido (drop zone + items)
    const content = document.createElement('div');
    content.className = 'group-content';
    content.dataset.groupId = group.id;
    if (group.collapsed) content.style.display = 'none';

    // Items
    (group.items || []).forEach(entry => {
        // En módulos normales: entry = string (id). En Global: entry = { id, module }.
        const isGlobal = typeof entry === 'object' && entry && 'id' in entry;
        const itemId = isGlobal ? entry.id : entry;
        const itemModule = isGlobal ? entry.module : currentModule;

        const opt = findOptionById(itemModule, itemId);
        if (!opt) return;

        const itemEl = document.createElement('div');
        itemEl.className = 'group-option';
        itemEl.draggable = true;
        itemEl.dataset.id = itemId;
        itemEl.dataset.groupId = group.id;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = opt.name + (currentModule === 'global' ? ` · (${itemModule})` : '');
        itemEl.appendChild(nameSpan);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.title = 'Quitar de este grupo';
        removeBtn.textContent = '×';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            const idx = (group.items || []).findIndex(v =>
                (typeof v === 'object') ? (v.id === itemId && v.module === itemModule) : (v === itemId)
            );
            if (idx > -1) group.items.splice(idx, 1);
            renderGroups();
        };
        itemEl.appendChild(removeBtn);

        itemEl.addEventListener('click', () => openFilterModal(opt.name));
        itemEl.addEventListener('dragstart', (e) => {
            const payload = (currentModule === 'global')
                ? { type: 'groupItem', id: itemId, module: itemModule, groupId: group.id }
                : { type: 'groupItem', id: itemId, groupId: group.id };
            e.dataTransfer.setData('text/plain', JSON.stringify(payload));
            e.dataTransfer.effectAllowed = 'move';
            itemEl.classList.add('dragging');
        });
        itemEl.addEventListener('dragend', () => itemEl.classList.remove('dragging'));

        content.appendChild(itemEl);
    });

    // DnD
    content.addEventListener('dragover', (e) => { e.preventDefault(); content.classList.add('drag-over'); });
    content.addEventListener('dragleave', () => content.classList.remove('drag-over'));
    content.addEventListener('drop', (e) => {
        e.preventDefault(); content.classList.remove('drag-over');
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (!data) return;

            if (data.type === 'option') {
                if (currentModule === 'global') {
                    (group.items ||= []);
                    if (!group.items.some(v => typeof v === 'object' && v.id === data.id && v.module === data.module)) {
                        group.items.push({ id: data.id, module: data.module });
                    }
                } else {
                    (group.items ||= []);
                    if (!group.items.includes(data.id)) group.items.push(data.id);
                }
                renderGroups();
            } else if (data.type === 'groupItem') {
                const root = (userGroups[currentModule] ||= []);
                const found = findGroupAndParent(root, data.groupId);
                if (!found) return;
                const { node: fromGroup } = found;

                if (currentModule === 'global') {
                    const idx = fromGroup.items.findIndex(v => typeof v === 'object' && v.id === data.id && v.module === data.module);
                    if (idx > -1) fromGroup.items.splice(idx, 1);
                    (group.items ||= []);
                    if (!group.items.some(v => typeof v === 'object' && v.id === data.id && v.module === data.module)) {
                        group.items.push({ id: data.id, module: data.module });
                    }
                } else {
                    const idx = fromGroup.items.indexOf(data.id);
                    if (idx > -1) fromGroup.items.splice(idx, 1);
                    (group.items ||= []);
                    if (!group.items.includes(data.id)) group.items.push(data.id);
                }
                renderGroups();
            }
        } catch (err) { console.error(err); }
    });

    groupEl.appendChild(content);

    // Subgrupos
    (group.children || []).forEach(child => {
        groupEl.appendChild(renderGroupNode(child, depth + 1));
    });

    return groupEl;
}

/** Busca { parent, node } por id de grupo */
function findGroupAndParent(groups, id, parent = null) {
    for (const g of groups) {
        if (g.id === id) return { parent, node: g };
        const out = findGroupAndParent(g.children || [], id, g);
        if (out) return out;
    }
    return null;
}

/** Limpia grupos marcados para borrar desde la raíz del módulo actual */
function pruneDeleted(moduleKey) {
    const list = userGroups[moduleKey] || [];
    userGroups[moduleKey] = prune(list);
    function prune(arr) {
        const out = [];
        for (const g of arr) {
            if (g.__deleteMe) continue;
            g.children = prune(g.children || []);
            out.push(g);
        }
        return out;
    }
}
