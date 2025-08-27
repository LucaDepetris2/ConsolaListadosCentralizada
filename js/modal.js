// js/modal.js

function $id(id) { return document.getElementById(id); }
function openModal() { $id('filter-modal').hidden = false; }
function closeModal() { $id('filter-modal').hidden = true; }

function setModal(title, bodyHTML) {
  $id('modal-title').textContent = title;
  $id('modal-body').innerHTML = bodyHTML;

  const closeBtn = $id('modal-close');
  const escFn = (e) => { if (e.key === 'Escape') { document.removeEventListener('keydown', escFn); closeModal(); } };
  closeBtn.onclick = () => { document.removeEventListener('keydown', escFn); closeModal(); };
  document.addEventListener('keydown', escFn);
}

/** Filtros de una opción final */
export function openFilterModal(title) {
  setModal(
    `${title} — filtros`,
    `
    <form>
      <div class="form-grid">
        <div class="form-field"><label>Fecha inicio</label><input type="date"></div>
        <div class="form-field"><label>Fecha fin</label><input type="date"></div>
        <div class="form-field"><label>Moneda</label>
          <select><option>ARS (Pesos)</option><option>USD (Dólar)</option></select></div>
        <div class="form-field"><label>Ordenar por</label>
          <select>
            <option>Fecha (reciente primero)</option>
            <option>Fecha (antiguo primero)</option>
            <option>Importe (mayor a menor)</option>
            <option>Importe (menor a mayor)</option>
          </select></div>
        <div class="form-field"><label>Sucursal</label>
          <select><option>Todas</option><option>00</option><option>SFB</option><option>RMX</option><option>REX</option></select></div>
        <div class="form-field"><label>Cliente (opcional)</label><input type="text" placeholder="ID / Razón social"></div>
        <div class="form-field"><label>Vendedor (opcional)</label><input type="text" placeholder="Código / Nombre"></div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn">Previsualizar</button>
        <button type="button" class="btn">Exportar Excel</button>
        <button type="button" class="btn">Generar PDF</button>
      </div>
    </form>`
  );
  openModal();
}

/** Prompt custom (Promise<string|null>) */
export function appPrompt({ title, label, placeholder = '' }) {
  return new Promise(resolve => {
    setModal(
      title,
      `
      <div class="form-field">
        <label>${label}</label>
        <input id="dlg-input" type="text" placeholder="${placeholder}">
      </div>
      <div class="dialog-actions">
        <button id="dlg-ok" class="btn primary">Aceptar</button>
        <button id="dlg-cancel" class="btn">Cancelar</button>
      </div>`
    );
    openModal();

    const input = $id('dlg-input');
    const ok = $id('dlg-ok');
    const cancel = $id('dlg-cancel');
    input.focus();

    const close = (val) => { closeModal(); resolve(val); };
    ok.onclick = () => close(input.value.trim() || null);
    cancel.onclick = () => close(null);
  });
}

/** Confirm custom (Promise<boolean>) */
export function appConfirm({ title, message }) {
  return new Promise(resolve => {
    setModal(
      title,
      `
      <p>${message}</p>
      <div class="dialog-actions">
        <button id="dlg-yes" class="btn primary">Sí</button>
        <button id="dlg-no" class="btn">No</button>
      </div>`
    );
    openModal();

    const yes = $id('dlg-yes');
    const no = $id('dlg-no');
    const close = (val) => { closeModal(); resolve(val); };
    yes.onclick = () => close(true);
    no.onclick = () => close(false);
  });
}
