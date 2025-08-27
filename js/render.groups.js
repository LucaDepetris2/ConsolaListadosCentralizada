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

    // ===== Header =====
    const header = document.createElement('div');
    header.className = 'group-header';
    header.draggable = true;

    header.addEventListener('dragstart', (e) => {
        const payload = { type: 'groupNode', groupId: group.id };
        e.dataTransfer.setData('text/plain', JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'move';
        header.classList.add('dragging');
    });
    header.addEventListener('dragend', () => header.classList.remove('dragging'));

    // Reordenar por DnD: soltar ANTES de este grupo (entre hermanos)
    header.addEventListener('dragover', (e) => {
        const data = safeGet(e);
        if (!data) return;
        if (data.type === 'groupNode' || data.type === 'groupItem' || data.type === 'option') {
            e.preventDefault();
            header.classList.add('drag-over');
        }
    });
    header.addEventListener('dragleave', () => header.classList.remove('drag-over'));
    header.addEventListener('drop', (e) => {
        header.classList.remove('drag-over');
        const data = safeGet(e);
        if (!data) return;

        if (data.type === 'groupNode') {
            const root = (userGroups[currentModule] ||= []);
            const src = findGroupAndParent(root, data.groupId);
            const dst = findGroupAndParent(root, group.id);
            if (!src || !dst) return;

            if (src.parent === dst.parent) {
                const arr = src.parent ? (src.parent.children ||= []) : root;
                const fromIdx = arr.findIndex(g => g.id === src.node.id);
                const toIdx = arr.findIndex(g => g.id === dst.node.id);
                if (fromIdx > -1 && toIdx > -1 && fromIdx !== toIdx) {
                    const [moved] = arr.splice(fromIdx, 1);
                    const insertIdx = (fromIdx < toIdx) ? toIdx - 1 : toIdx;
                    arr.splice(insertIdx, 0, moved);
                    renderGroups();
                }
            }
        } else if (data.type === 'option') {
            (group.items ||= []);
            if (currentModule === 'global') {
                if (!group.items.some(v => typeof v === 'object' && v.id === data.id && v.module === data.module)) {
                    group.items.push({ id: data.id, module: data.module });
                }
            } else {
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
                    group.items.unshift({ id: data.id, module: data.module });
                }
            } else {
                const idx = fromGroup.items.indexOf(data.id);
                if (idx > -1) fromGroup.items.splice(idx, 1);
                (group.items ||= []);
                if (!group.items.includes(data.id)) group.items.unshift(data.id);
            }
            renderGroups();
        }
    });

    // Toggle colapso
    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.textContent = group.collapsed ? '▸' : '▾';
    toggle.title = group.collapsed ? 'Expandir' : 'Contraer';
    toggle.onclick = (e) => { e.stopPropagation(); group.collapsed = !group.collapsed; renderGroups(); };

    // Título
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = group.name;

    // Acciones header (↑/↓ + CRUD)
    const actions = document.createElement('div');
    actions.className = 'actions';

    // NUEVO: mover grupo/subgrupo ↑/↓ entre hermanos
    const upBtn = document.createElement('button');
    upBtn.title = 'Subir grupo';
    upBtn.textContent = '↑';
    upBtn.onclick = (e) => { e.stopPropagation(); moveGroup(group.id, -1); };

    const downBtn = document.createElement('button');
    downBtn.title = 'Bajar grupo';
    downBtn.textContent = '↓';
    downBtn.onclick = (e) => { e.stopPropagation(); moveGroup(group.id, +1); };

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

    actions.append(upBtn, downBtn, addSubBtn, renameBtn, deleteBtn);
    header.append(toggle, title, actions);
    groupEl.appendChild(header);

    // ===== Contenido (items + dropzones) =====
    const content = document.createElement('div');
    content.className = 'group-content';
    content.dataset.groupId = group.id;
    if (group.collapsed) content.style.display = 'none';

    (group.items || []).forEach((entry, index) => {
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
        itemEl.dataset.index = String(index);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = opt.name + (currentModule === 'global' ? ` · (${itemModule})` : '');
        itemEl.appendChild(nameSpan);

        // Controles orden ítems (ya estaban)
        const ctrl = document.createElement('div');
        ctrl.className = 'reorder-controls';

        const upI = document.createElement('button');
        upI.className = 'move-up';
        upI.title = 'Subir';
        upI.textContent = '↑';
        upI.disabled = index === 0;
        upI.onclick = (e) => { e.stopPropagation(); moveItem(group, index, index - 1); };

        const downI = document.createElement('button');
        downI.className = 'move-down';
        downI.title = 'Bajar';
        downI.textContent = '↓';
        downI.disabled = index === (group.items?.length ?? 0) - 1;
        downI.onclick = (e) => { e.stopPropagation(); moveItem(group, index, index + 1); };

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

        ctrl.append(upI, downI, removeBtn);
        itemEl.appendChild(ctrl);

        itemEl.addEventListener('click', () => openFilterModal(opt.name));

        itemEl.addEventListener('dragstart', (e) => {
            const payload = (currentModule === 'global')
                ? { type: 'groupItem', id: itemId, module: itemModule, groupId: group.id, index }
                : { type: 'groupItem', id: itemId, groupId: group.id, index };
            e.dataTransfer.setData('text/plain', JSON.stringify(payload));
            e.dataTransfer.effectAllowed = 'move';
            itemEl.classList.add('dragging');
        });
        itemEl.addEventListener('dragend', () => itemEl.classList.remove('dragging'));

        // Insertar antes de este ítem
        itemEl.addEventListener('dragover', (e) => {
            const data = safeGet(e);
            if (!data) return;
            if (data.type === 'groupItem' || data.type === 'option') {
                e.preventDefault();
                itemEl.classList.add('drag-over');
            }
        });
        itemEl.addEventListener('dragleave', () => itemEl.classList.remove('drag-over'));
        itemEl.addEventListener('drop', (e) => {
            itemEl.classList.remove('drag-over');
            const data = safeGet(e);
            if (!data) return;
            const insertBeforeIndex = parseInt(itemEl.dataset.index, 10);

            if (data.type === 'option') {
                (group.items ||= []);
                if (currentModule === 'global') {
                    if (!group.items.some(v => typeof v === 'object' && v.id === data.id && v.module === data.module)) {
                        group.items.splice(insertBeforeIndex, 0, { id: data.id, module: data.module });
                    }
                } else {
                    if (!group.items.includes(data.id)) {
                        group.items.splice(insertBeforeIndex, 0, data.id);
                    }
                }
                renderGroups();
            } else if (data.type === 'groupItem') {
                const root = (userGroups[currentModule] ||= []);
                const found = findGroupAndParent(root, data.groupId);
                if (!found) return;
                const { node: fromGroup } = found;

                if (currentModule === 'global') {
                    const rmIdx = fromGroup.items.findIndex(v => typeof v === 'object' && v.id === data.id && v.module === data.module);
                    if (rmIdx > -1) fromGroup.items.splice(rmIdx, 1);
                    (group.items ||= []);
                    if (!group.items.some(v => typeof v === 'object' && v.id === data.id && v.module === data.module)) {
                        group.items.splice(insertBeforeIndex, 0, { id: data.id, module: data.module });
                    }
                } else {
                    const rmIdx = fromGroup.items.indexOf(data.id);
                    if (rmIdx > -1) fromGroup.items.splice(rmIdx, 1);
                    (group.items ||= []);
                    if (!group.items.includes(data.id)) {
                        group.items.splice(insertBeforeIndex, 0, data.id);
                    }
                }
                renderGroups();
            }
        });

        content.appendChild(itemEl);
    });

    // Dropzone al final
    content.addEventListener('dragover', (e) => { e.preventDefault(); content.classList.add('drag-over'); });
    content.addEventListener('dragleave', () => content.classList.remove('drag-over'));
    content.addEventListener('drop', (e) => {
        e.preventDefault(); content.classList.remove('drag-over');
        const data = safeGet(e);
        if (!data) return;

        if (data.type === 'option') {
            (group.items ||= []);
            if (currentModule === 'global') {
                if (!group.items.some(v => typeof v === 'object' && v.id === data.id && v.module === data.module)) {
                    group.items.push({ id: data.id, module: data.module });
                }
            } else {
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
    });

    groupEl.appendChild(content);

    // Render subgrupos
    (group.children || []).forEach(child => {
        groupEl.appendChild(renderGroupNode(child, depth + 1));
    });

    return groupEl;
}

/* === Utilidades de orden === */

// Mover un ítem dentro del mismo grupo
function moveItem(group, from, to) {
    if (!group.items) return;
    if (to < 0 || to >= group.items.length || from === to) return;
    const [m] = group.items.splice(from, 1);
    group.items.splice(to, 0, m);
    renderGroups();
}

// Mover grupo/subgrupo entre hermanos (dir = -1 arriba, +1 abajo)
function moveGroup(groupId, dir) {
    const root = (userGroups[currentModule] ||= []);
    const found = findGroupAndParent(root, groupId);
    if (!found) return;
    const { parent, node } = found;

    const arr = parent ? (parent.children ||= []) : root;
    const idx = arr.findIndex(g => g.id === node.id);
    if (idx === -1) return;

    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;

    const [m] = arr.splice(idx, 1);
    arr.splice(newIdx, 0, m);
    renderGroups();
}

// Buscar { parent, node } por id
function findGroupAndParent(groups, id, parent = null) {
    for (const g of groups) {
        if (g.id === id) return { parent, node: g };
        const out = findGroupAndParent(g.children || [], id, g);
        if (out) return out;
    }
    return null;
}

// Purgar marcados para borrar
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

// Parse seguro del payload de DnD
function safeGet(e) {
    try { return JSON.parse(e.dataTransfer.getData('text/plain')); }
    catch { return null; }
}
