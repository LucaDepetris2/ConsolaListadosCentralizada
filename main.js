/*
 * Consola de listados por módulos (Compras, Ventas, Tesorería).
 * Permite agrupar opciones existentes en grupos personalizados y navegar las
 * categorías predefinidas de cada módulo. Los usuarios pueden crear
 * nuevos grupos y opciones, reorganizar elementos mediante arrastrar y
 * soltar, y abrir un formulario de filtros para las opciones finales.
 */

// ----- Datos de ejemplo ---------------------------------------------------

/**
 * Definición de los módulos disponibles con sus categorías y opciones. Cada
 * categoría puede contener subcategorías (children) u opciones finales
 * (type "final"). Las IDs deben ser únicas en todo el árbol para poder
 * identificarlas durante operaciones de drag & drop.
 */
const modulesData = {
  ventas: {
    name: 'Ventas',
    categories: [
      {
        id: 'vt-comprobantes',
        name: 'Comprobantes',
        children: [
          { id: 'vt-cons-camion', name: 'Consolidado por Camión', type: 'final' },
          { id: 'vt-comp-vendedor', name: 'Comprobantes por Vendedor', type: 'final' },
          { id: 'vt-comp-pend-desc', name: 'Comprobantes Pendientes a Descargar', type: 'final' },
          { id: 'vt-comp-pend-desc-stock', name: 'Comprobantes Pendientes a Descargar/Stock', type: 'final' },
          { id: 'vt-comp-pend-imputar', name: 'Comprobantes Pendientes a Imputar', type: 'final' },
          { id: 'vt-comp-pend-vendedor', name: 'Comprobantes Pendientes por Vendedor', type: 'final' },
          { id: 'vt-comp-por-camion', name: 'Comprobantes por Camión', type: 'final' },
          { id: 'vt-comp-det', name: 'Comprobantes Detallados', type: 'final' },
          { id: 'vt-cambio-estado', name: 'Cambio de Estados Detallado por Comprobante', type: 'final' }
        ]
      },
      {
        id: 'vt-descargas',
        name: 'Descargas',
        children: [
          { id: 'vt-desc-resumen', name: 'Resumen de descargas', type: 'final' },
          { id: 'vt-desc-historico', name: 'Histórico de descargas', type: 'final' }
        ]
      },
      {
        id: 'vt-cobranzas',
        name: 'Cobranzas',
        children: [
          { id: 'vt-cob-pendiente', name: 'Cobranzas Pendientes', type: 'final' },
          { id: 'vt-cob-detallada', name: 'Cobranzas Detalladas', type: 'final' }
        ]
      },
      {
        id: 'vt-iva-ventas',
        name: 'IVA Ventas',
        children: [
          { id: 'vt-iva-resumen', name: 'Resumen IVA Ventas', type: 'final' },
          { id: 'vt-iva-detallado', name: 'IVA Ventas Detallado', type: 'final' }
        ]
      },
      {
        id: 'vt-utilidad',
        name: 'Utilidad por Comprobantes',
        children: [
          { id: 'vt-util-resumen', name: 'Utilidad por Comprobante', type: 'final' },
          { id: 'vt-util-detalle', name: 'Utilidad Detallada', type: 'final' }
        ]
      },
      {
        id: 'vt-vencimientos',
        name: 'Vencimientos a Cobrar',
        children: [
          { id: 'vt-venc-resumen', name: 'Vencimientos a Cobrar', type: 'final' }
        ]
      },
      {
        id: 'vt-ventas',
        name: 'Ventas',
        children: [
          { id: 'vt-ventas-cliente', name: 'Ventas por Cliente', type: 'final' },
          { id: 'vt-ventas-fecha', name: 'Ventas por Fecha', type: 'final' },
          { id: 'vt-ventas-general', name: 'Resumen de Ventas', type: 'final' }
        ]
      },
      {
        id: 'vt-clientes',
        name: 'Clientes',
        children: [
          { id: 'vt-clientes-general', name: 'Clientes detallados', type: 'final' },
          { id: 'vt-clientes-deudores', name: 'Clientes deudores', type: 'final' }
        ]
      },
      {
        id: 'vt-tallecolor',
        name: 'Talle / Color',
        children: [
          { id: 'vt-talle-resumen', name: 'Ventas por Talle', type: 'final' },
          { id: 'vt-color-resumen', name: 'Ventas por Color', type: 'final' }
        ]
      },
      {
        id: 'vt-proyectos',
        name: 'Proyectos',
        children: [
          { id: 'vt-proyecto-general', name: 'Proyectos vendidos', type: 'final' },
          { id: 'vt-proyecto-fecha', name: 'Proyectos por Fecha', type: 'final' }
        ]
      },
      {
        id: 'vt-cuentas',
        name: 'Cuentas',
        children: [
          { id: 'vt-cuenta-general', name: 'Cuentas corrientes', type: 'final' },
          { id: 'vt-cuenta-mov', name: 'Movimientos de cuenta', type: 'final' }
        ]
      },
      {
        id: 'vt-otros',
        name: 'Otros',
        children: [
          { id: 'vt-otros-general', name: 'Listado general de ventas', type: 'final' }
        ]
      }
    ]
  },
  compras: {
    name: 'Compras',
    categories: [
      {
        id: 'cp-ordenes',
        name: 'Órdenes de compra',
        children: [
          { id: 'cp-ord-proveedor', name: 'Órdenes por Proveedor', type: 'final' },
          { id: 'cp-ord-pendientes', name: 'Órdenes Pendientes', type: 'final' },
          { id: 'cp-ord-fecha', name: 'Órdenes por Fecha', type: 'final' }
        ]
      },
      {
        id: 'cp-recepciones',
        name: 'Recepciones',
        children: [
          { id: 'cp-rec-proveedor', name: 'Recepciones por Proveedor', type: 'final' },
          { id: 'cp-rec-fecha', name: 'Recepciones por Fecha', type: 'final' }
        ]
      },
      {
        id: 'cp-pagos',
        name: 'Pagos',
        children: [
          { id: 'cp-pagos-pendientes', name: 'Pagos Pendientes', type: 'final' },
          { id: 'cp-pagos-fecha', name: 'Pagos por Fecha', type: 'final' }
        ]
      },
      {
        id: 'cp-iva-compras',
        name: 'IVA Compras',
        children: [
          { id: 'cp-iva-resumen', name: 'IVA Compras Resumen', type: 'final' },
          { id: 'cp-iva-detallado', name: 'IVA Compras Detallado', type: 'final' }
        ]
      },
      {
        id: 'cp-otros',
        name: 'Otros',
        children: [
          { id: 'cp-otros-general', name: 'Listado general de compras', type: 'final' }
        ]
      }
    ]
  },
  tesoreria: {
    name: 'Tesorería',
    categories: [
      {
        id: 'ts-cobranzas',
        name: 'Cobranzas',
        children: [
          { id: 'ts-cob-fecha', name: 'Cobranzas por Fecha', type: 'final' },
          { id: 'ts-cob-pendientes', name: 'Cobranzas Pendientes', type: 'final' }
        ]
      },
      {
        id: 'ts-pagos',
        name: 'Pagos',
        children: [
          { id: 'ts-pagos-proveedor', name: 'Pagos a Proveedores', type: 'final' },
          { id: 'ts-pagos-programados', name: 'Pagos Programados', type: 'final' }
        ]
      },
      {
        id: 'ts-bancos',
        name: 'Bancos',
        children: [
          { id: 'ts-bancos-mov', name: 'Movimientos Bancarios', type: 'final' },
          { id: 'ts-bancos-conciliaciones', name: 'Conciliaciones Bancarias', type: 'final' }
        ]
      },
      {
        id: 'ts-caja',
        name: 'Caja',
        children: [
          { id: 'ts-caja-mov', name: 'Movimientos de Caja', type: 'final' },
          { id: 'ts-caja-dia', name: 'Caja por Día', type: 'final' }
        ]
      },
      {
        id: 'ts-cheques',
        name: 'Cheques',
        children: [
          { id: 'ts-cheques-emitidos', name: 'Cheques Emitidos', type: 'final' },
          { id: 'ts-cheques-recibidos', name: 'Cheques Recibidos', type: 'final' }
        ]
      },
      {
        id: 'ts-otros',
        name: 'Otros',
        children: [
          { id: 'ts-otros-general', name: 'Listado general de tesorería', type: 'final' }
        ]
      }
    ]
  }
};

// Objeto que almacena los grupos personalizados de cada módulo. Al inicio no
// existen grupos. Cada clave (ventas, compras, tesoreria) contiene un array
// de objetos { id, name, items } donde items es un array de IDs de
// opciones finales referenciadas en modulesData.
const userGroups = {
  ventas: [],
  compras: [],
  tesoreria: []
};

// Variables de estado para la interfaz
let currentModule = 'ventas';        // Módulo seleccionado por defecto
let draggedItem = null;              // Datos del elemento arrastrado (opción final o grupo)

// ------------------- Renderizado de la interfaz ---------------------------

/**
 * Genera la barra de módulos en la parte superior. Al hacer clic sobre un
 * módulo, se establece como activo y se renderizan sus categorías y grupos.
 */
function renderModulesBar() {
  const bar = document.getElementById('modules-bar');
  bar.innerHTML = '';
  Object.keys(modulesData).forEach(key => {
    const mod = modulesData[key];
    const div = document.createElement('div');
    div.className = 'module' + (key === currentModule ? ' active' : '');
    div.textContent = mod.name;
    div.tabIndex = 0;
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', 'Módulo ' + mod.name);
    div.addEventListener('click', () => {
      currentModule = key;
      renderModulesBar();
      renderCategories();
      renderGroups();
    });
    bar.appendChild(div);
  });
}

/**
 * Genera la lista de categorías y opciones para el módulo actual. Las
 * categorías pueden plegarse y desplegarse. Las opciones finales son
 * elementos arrastrables que abren un modal de filtros al hacer clic.
 */
function renderCategories() {
  const container = document.getElementById('categories-list');
  container.innerHTML = '';
  const module = modulesData[currentModule];
  if (!module) return;
  module.categories.forEach(cat => {
    const catEl = createCategoryElement(cat);
    container.appendChild(catEl);
  });
}

/**
 * Crea un elemento de categoría (y sus subcategorías) de forma recursiva.
 * @param {Object} node - Objeto de categoría u opción final
 */
function createCategoryElement(node) {
  if (node.type === 'final') {
    // Opción final: se renderiza como elemento simple
    const optEl = document.createElement('div');
    optEl.className = 'final-option';
    optEl.textContent = node.name;
    optEl.draggable = true;
    optEl.dataset.id = node.id;
    optEl.addEventListener('click', () => openFilterModal(node.name));
    // Drag start: registramos los datos de la opción arrastrada
    optEl.addEventListener('dragstart', (e) => {
      draggedItem = { type: 'option', id: node.id };
      e.dataTransfer.setData('text/plain', JSON.stringify(draggedItem));
      e.dataTransfer.effectAllowed = 'copy';
      optEl.classList.add('dragging');
    });
    // Drag end: limpiamos la clase
    optEl.addEventListener('dragend', () => {
      optEl.classList.remove('dragging');
    });
    return optEl;
  }
  // Categoría con hijos
  const catDiv = document.createElement('div');
  catDiv.className = 'category-item';
  // Cabecera con botón para desplegar
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
  // Contenedor de hijos
  const content = document.createElement('div');
  content.className = 'category-content';
  if (Array.isArray(node.children)) {
    node.children.forEach(child => {
      const childEl = createCategoryElement(child);
      if (child.type !== 'final') {
        childEl.classList.add('subcategory-item');
      }
      content.appendChild(childEl);
    });
  }
  catDiv.appendChild(content);
  return catDiv;
}

/**
 * Genera la lista de grupos personalizados para el módulo actual. Los grupos
 * admiten arrastrar opciones para añadirlas y reordenarlas internamente.
 */
function renderGroups() {
  const container = document.getElementById('groups-list');
  container.innerHTML = '';
  const groups = userGroups[currentModule] || [];
  groups.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'group-item';
    groupEl.dataset.groupId = group.id;
    // Encabezado del grupo
    const header = document.createElement('div');
    header.className = 'group-header';
    header.textContent = group.name;
    // Acciones: renombrar y eliminar
    const actions = document.createElement('div');
    actions.className = 'actions';
    const renameBtn = document.createElement('button');
    renameBtn.title = 'Renombrar grupo';
    renameBtn.textContent = 'R';
    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nuevo = prompt('Nuevo nombre del grupo:', group.name);
      if (nuevo && nuevo.trim()) {
        group.name = nuevo.trim();
        renderGroups();
      }
    });
    const deleteBtn = document.createElement('button');
    deleteBtn.title = 'Eliminar grupo';
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('¿Eliminar el grupo "' + group.name + '"?')) {
        const idx = userGroups[currentModule].findIndex(g => g.id === group.id);
        if (idx > -1) userGroups[currentModule].splice(idx, 1);
        renderGroups();
      }
    });
    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);
    header.appendChild(actions);
    groupEl.appendChild(header);
    // Contenido: lista de opciones dentro del grupo
    const content = document.createElement('div');
    content.className = 'group-content';
    content.dataset.groupId = group.id;
    // Recorrer items y crear elementos
    group.items.forEach((id, idx) => {
      const opt = findOptionById(currentModule, id);
      if (!opt) return;
      const itemEl = document.createElement('div');
      itemEl.className = 'group-option';
      itemEl.draggable = true;
      itemEl.dataset.id = id;
      itemEl.dataset.groupId = group.id;
      // Nombre de la opción
      const nameSpan = document.createElement('span');
      nameSpan.textContent = opt.name;
      itemEl.appendChild(nameSpan);
      // Botón para quitar la opción del grupo
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.title = 'Quitar de este grupo';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = group.items.indexOf(id);
        if (index > -1) group.items.splice(index, 1);
        renderGroups();
      });
      itemEl.appendChild(removeBtn);
      // Clic para abrir filtros
      itemEl.addEventListener('click', () => openFilterModal(opt.name));
      // Drag
      itemEl.addEventListener('dragstart', (e) => {
        draggedItem = { type: 'groupItem', id: id, groupId: group.id };
        e.dataTransfer.setData('text/plain', JSON.stringify(draggedItem));
        e.dataTransfer.effectAllowed = 'move';
        itemEl.classList.add('dragging');
      });
      itemEl.addEventListener('dragend', () => itemEl.classList.remove('dragging'));
      content.appendChild(itemEl);
    });
    // Habilitar área de dropeo para aceptar nuevas opciones o reordenar
    content.addEventListener('dragover', (e) => {
      e.preventDefault();
      content.classList.add('drag-over');
    });
    content.addEventListener('dragleave', () => {
      content.classList.remove('drag-over');
    });
    content.addEventListener('drop', (e) => {
      e.preventDefault();
      content.classList.remove('drag-over');
      try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (!data) return;
        // Arrastrar opción final desde categorías
        if (data.type === 'option') {
          // Evitar duplicados
          if (!group.items.includes(data.id)) {
            group.items.push(data.id);
            renderGroups();
          }
        }
        // Arrastrar opción desde otro grupo o mismo grupo para reordenar
        else if (data.type === 'groupItem') {
          const fromGroup = userGroups[currentModule].find(g => g.id === data.groupId);
          if (!fromGroup) return;
          const itemIndex = fromGroup.items.indexOf(data.id);
          if (itemIndex === -1) return;
          // Si misma área, mover a la posición final del array
          if (group.id === fromGroup.id) {
            // Mover dentro de mismo grupo: lo quitamos y lo agregamos al final
            fromGroup.items.splice(itemIndex, 1);
            group.items.push(data.id);
          } else {
            // Quitar del grupo origen y añadir al destino
            fromGroup.items.splice(itemIndex, 1);
            if (!group.items.includes(data.id)) {
              group.items.push(data.id);
            }
          }
          renderGroups();
        }
      } catch (err) {
        console.error(err);
      }
    });
    groupEl.appendChild(content);
    container.appendChild(groupEl);
  });
}

/**
 * Localiza una opción final en la estructura del módulo por su ID. Se utiliza
 * para obtener el nombre de la opción al renderizarla dentro de un grupo.
 * @param {string} moduleKey - Clave del módulo
 * @param {string} id - ID de la opción final
 * @returns {Object|null} Opción encontrada o null
 */
function findOptionById(moduleKey, id) {
  const mod = modulesData[moduleKey];
  if (!mod) return null;
  let result = null;
  function recurse(list) {
    for (const item of list) {
      if (item.type === 'final' && item.id === id) {
        result = item;
        return;
      }
      if (item.children) {
        recurse(item.children);
        if (result) return;
      }
    }
  }
  recurse(mod.categories);
  return result;
}

/**
 * Abre el modal de filtros para una opción final. Se genera un formulario
 * genérico con campos de fecha, moneda, orden, sucursal, estados y campos
 * opcionales de cliente y vendedor. Estos valores no se procesan; el
 * objetivo es simular una interfaz de filtros similar al sistema.
 * @param {string} title - Nombre de la opción que abrirá el filtro
 */
function openFilterModal(title) {
  const modal = document.getElementById('filter-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  modalTitle.textContent = title + ' — filtros';
  modalBody.innerHTML = `
    <form>
      <div class="form-grid">
        <div class="form-field">
          <label>Fecha inicio</label>
          <input type="date" />
        </div>
        <div class="form-field">
          <label>Fecha fin</label>
          <input type="date" />
        </div>
        <div class="form-field">
          <label>Moneda</label>
          <select>
            <option>ARS (Pesos)</option>
            <option>USD (Dólar)</option>
          </select>
        </div>
        <div class="form-field">
          <label>Ordenar por</label>
          <select>
            <option>Fecha (reciente primero)</option>
            <option>Fecha (antiguo primero)</option>
            <option>Importe (mayor a menor)</option>
            <option>Importe (menor a mayor)</option>
          </select>
        </div>
        <div class="form-field">
          <label>Sucursal</label>
          <select>
            <option>Todas</option>
            <option>00</option>
            <option>SFB</option>
            <option>RMX</option>
            <option>REX</option>
          </select>
        </div>
        <div class="form-field">
          <label>Cliente (opcional)</label>
          <input type="text" placeholder="ID / Razón social" />
        </div>
        <div class="form-field">
          <label>Vendedor (opcional)</label>
          <input type="text" placeholder="Código / Nombre" />
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn">Previsualizar</button>
        <button type="button" class="btn">Exportar Excel</button>
        <button type="button" class="btn">Generar PDF</button>
      </div>
    </form>
  `;
  modal.hidden = false;
  // Cerrar modal al hacer clic en la X o presionar Esc
  const closeBtn = document.getElementById('modal-close');
  const closeFn = () => {
    modal.hidden = true;
    document.removeEventListener('keydown', escFn);
  };
  const escFn = (e) => {
    if (e.key === 'Escape') closeFn();
  };
  closeBtn.onclick = closeFn;
  document.addEventListener('keydown', escFn);
}

/**
 * Inicializa los eventos para los botones de añadir grupos y opciones.
 */
function setupActions() {
  // Añadir nuevo grupo
  document.getElementById('add-group-btn').addEventListener('click', () => {
    const nombre = prompt('Nombre del nuevo grupo:');
    if (nombre && nombre.trim()) {
      const groups = userGroups[currentModule];
      const id = 'grp-' + Date.now();
      groups.push({ id, name: nombre.trim(), items: [] });
      renderGroups();
    }
  });
  // Añadir nueva opción: se añadirá como opción final en una categoría
  document.getElementById('add-option-btn').addEventListener('click', () => {
    const nombre = prompt('Nombre de la nueva opción final:');
    if (nombre && nombre.trim()) {
      // Añadimos dentro de una categoría genérica "Personalizadas" o creamos si no existe
      let mod = modulesData[currentModule];
      if (!mod) return;
      let personal = mod.categories.find(c => c.id === currentModule + '-personalizadas');
      if (!personal) {
        personal = { id: currentModule + '-personalizadas', name: 'Personalizadas', children: [] };
        mod.categories.push(personal);
      }
      const id = currentModule + '-custom-' + Date.now();
      personal.children.push({ id, name: nombre.trim(), type: 'final' });
      renderCategories();
    }
  });
}

// --------------------- Inicialización principal ---------------------------

document.addEventListener('DOMContentLoaded', () => {
  renderModulesBar();
  renderCategories();
  renderGroups();
  setupActions();
});