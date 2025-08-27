// js/contextMenu.js
import { userGroups } from './state.js';
import { renderGroups } from './render.groups.js';
import { appPrompt } from './modal.js';

/** Inicializa menú contextual para opciones finales en #categories-list */
export function initContextMenuForCategories() {
    const host = document.getElementById('categories-list');
    if (!host) return;

    let menu = document.getElementById('ctx-menu');
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'ctx-menu';
        menu.className = 'ctxmenu';
        menu.hidden = true;
        document.body.appendChild(menu);

        document.addEventListener('click', hide);
        document.addEventListener('scroll', hide, true);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
        document.addEventListener('contextmenu', e => {
            if (!e.target.closest('.final-option')) hide();
        });
    }

    host.addEventListener('contextmenu', async (e) => {
        const opt = e.target.closest('.final-option');
        if (!opt) return;
        e.preventDefault();

        const itemId = opt.dataset.id;
        const originModule = opt.dataset.module; // ahora lo setea render.categories.js

        // Construir menú
        menu.innerHTML = '';

        // 1) Crear grupo y agregar (lo crea en el módulo de origen)
        const create = row('➕ Crear grupo y agregar aquí…', 'strong');
        create.onclick = async () => {
            const nombre = await appPrompt({ title: 'Nuevo grupo', label: 'Nombre del nuevo grupo:' });
            if (!nombre) return hide();
            const id = 'grp-' + Date.now();
            (userGroups[originModule] ||= []).push({ id, name: nombre.trim(), items: [], children: [], collapsed: false });
            const g = userGroups[originModule].find(x => x.id === id);
            (g.items ||= []);
            if (!g.items.includes(itemId)) g.items.push(itemId);
            renderGroups();
            hide();
        };
        menu.appendChild(create);
        menu.appendChild(divider());

        // 2) Agregar a → Global + todos los módulos y subgrupos
        const modules = [
            { key: 'global', label: 'Global' },
            { key: 'ventas', label: 'Ventas' },
            { key: 'compras', label: 'Compras' },
            { key: 'tesoreria', label: 'Tesorería' }
        ];

        let printed = 0;
        for (const m of modules) {
            const groups = userGroups[m.key] || [];
            if (!groups.length) continue;

            menu.appendChild(section('Agregar a: ' + m.label));
            const list = collectGroups(groups); // [{ref, path, level}]
            list.forEach(g => {
                const r = row(g.path);
                r.style.paddingLeft = (10 + g.level * 14) + 'px'; // indent por nivel
                r.onclick = () => {
                    (g.ref.items ||= []);
                    if (m.key === 'global') {
                        // En Global guardamos {id,module}
                        const exists = g.ref.items.some(v => typeof v === 'object' && v.id === itemId && v.module === originModule);
                        if (!exists) g.ref.items.push({ id: itemId, module: originModule });
                    } else {
                        // En módulos normales guardamos el id plano
                        if (!g.ref.items.includes(itemId)) g.ref.items.push(itemId);
                    }
                    renderGroups();
                    hide();
                };
                menu.appendChild(r);
            });
            printed++;
            menu.appendChild(divider());
        }

        if (!printed) {
            menu.appendChild(row('No hay grupos creados', 'disabled'));
        }

        // Posición del menú (sin salir de la ventana)
        const x = Math.min(e.pageX, window.scrollX + window.innerWidth - 260);
        const y = Math.min(e.pageY, window.scrollY + window.innerHeight - 200);
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.hidden = false;
    });

    function collectGroups(groups, prefix = '', level = 0) {
        const out = [];
        for (const g of groups) {
            out.push({ ref: g, path: (prefix ? prefix + ' › ' : '') + g.name, level });
            if (g.children && g.children.length) {
                out.push(...collectGroups(g.children, (prefix ? prefix + ' › ' : '') + g.name, level + 1));
            }
        }
        return out;
    }

    function row(text, cls = '') {
        const d = document.createElement('div');
        d.className = 'ctxmenu-item' + (cls ? ' ' + cls : '');
        d.textContent = text;
        return d;
    }
    function section(text) {
        const d = document.createElement('div');
        d.className = 'ctxmenu-section';
        d.textContent = text;
        return d;
    }
    function divider() {
        const d = document.createElement('div');
        d.className = 'ctxmenu-divider';
        return d;
    }
    function hide() { menu.hidden = true; }
}
