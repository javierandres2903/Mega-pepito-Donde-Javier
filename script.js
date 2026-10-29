/* ============ CONFIGURACIÓN (edita aquí) ============ */
const WHATSAPP = "584126477809";            // 0412 647 7809 en formato internacional
const TIMEZONE = "America/Caracas";
const ALLOW_ORDERS_WHEN_CLOSED = true;      // true = permite enviar pedidos aunque esté cerrado

// Datos de Pago Móvil Interbancario
const PAGO = { banco: "BBVA Provincial", codigo: "0108", cedula: "V-15362100", telefono: "04127423310" };
const fmtPhone = (p) => `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}`;

// Delivery por sector (en $)
const ZONES = [
  { name: "Centro", price: 1 },
  { name: "Las Villas del Centro hasta Palos Grande", price: 2 },
  { name: "Ereigue, Panamericano, Polar, El Valle", price: 2 },
  { name: "Altamira y Pradera", price: 3 },
  { name: "Guacara", price: 5 },
];

// Horario: minutos desde las 00:00. Si cierra pasada la medianoche, suma 1440.
// 0 = domingo, 1 = lunes ... 6 = sábado
const MON_THU = { open: 16 * 60, close: 24 * 60 };          // 4:00 pm - 12:00 am
const WEEKEND = { open: 16 * 60 + 30, close: 25 * 60 };     // 4:30 pm - 1:00 am
const SCHEDULE = { 0: WEEKEND, 1: MON_THU, 2: MON_THU, 3: MON_THU, 4: MON_THU, 5: WEEKEND, 6: WEEKEND };
const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
/* ===================================================== */

const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toFixed(2);

/* ---------- Horario / abierto-cerrado ---------- */
function fmtTime(mins) {
  const m = ((mins % 1440) + 1440) % 1440;
  let h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const ap = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${mm} ${ap}`;
}

function caracasNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE, weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get("weekday")];
  return { day, mins: parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10) };
}

function getStatus() {
  const { day, mins } = caracasNow();
  const today = SCHEDULE[day];
  const yest = SCHEDULE[(day + 6) % 7];

  if (mins >= today.open && mins < today.close) {
    return { open: true, detail: `cerramos a las ${fmtTime(today.close)}` };
  }
  // Horario de ayer que se extiende después de medianoche
  if (yest.close > 1440 && mins < yest.close - 1440) {
    return { open: true, detail: `cerramos a las ${fmtTime(yest.close)}` };
  }
  if (mins < today.open) {
    return { open: false, detail: `abrimos hoy ${DAY_NAMES[day].toLowerCase()} a las ${fmtTime(today.open)}` };
  }
  const nextDay = (day + 1) % 7;
  return { open: false, detail: `abrimos mañana (${DAY_NAMES[nextDay].toLowerCase()}) a las ${fmtTime(SCHEDULE[nextDay].open)}` };
}

let isOpen = false;
function renderStatus() {
  const s = getStatus();
  isOpen = s.open;
  $("#statusChip").className = "status-chip " + (s.open ? "open" : "closed");
  $("#statusText").textContent = (s.open ? "Abierto ahora" : "Cerrado ahora") + " · " + s.detail;
  updateSendState();
}

function renderHours() {
  const { day } = caracasNow();
  const order = [1, 2, 3, 4, 5, 6, 0];
  $("#hoursList").innerHTML = order.map((d) => {
    const s = SCHEDULE[d];
    return `<li class="${d === day ? "today" : ""}"><span>${DAY_NAMES[d]}</span><b>${fmtTime(s.open)} – ${fmtTime(s.close)}</b></li>`;
  }).join("");
}

/* ---------- Menú ---------- */
const cart = Object.create(null);
const itemIndex = Object.create(null);
const toCents = (price) => Math.round(price * 100);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function renderOption(option, optionIndex) {
  const label = escapeHtml(option.label);
  if (option.multi) {
    return `<fieldset class="item-option">
      <legend>${label}</legend>
      ${option.includedCount !== undefined && option.extraPrice !== undefined
        ? `<small class="option-note">Los primeros ${option.includedCount} están incluidos; cada ingrediente adicional suma ${money(option.extraPrice)}.</small>`
        : ""}
      <div class="option-values">${option.values.map((value, valueIndex) => {
        const unpriced = value.price === 0;
        const priceNote = unpriced ? "Precio por definir" : value.price > 0 ? `+ ${money(value.price)}` : "";
        return `<label class="option-value">
          <input type="checkbox" data-product-control data-option="${optionIndex}" data-value="${valueIndex}"${unpriced ? " disabled" : ""}>
          <span>${escapeHtml(value.label)}</span>${priceNote ? `<small>${priceNote}</small>` : ""}
        </label>`;
      }).join("")}</div>
    </fieldset>`;
  }

  const selectedIndex = Number.isInteger(option.def) ? option.def : 0;
  return `<label class="item-option">
    <span>${label}</span>
    <select data-product-control data-option="${optionIndex}">
      ${option.values.map((value, valueIndex) => {
        const priceNote = value.price > 0 ? ` (+ ${money(value.price)})` : "";
        return `<option value="${valueIndex}"${valueIndex === selectedIndex ? " selected" : ""}>${escapeHtml(value.label)}${priceNote}</option>`;
      }).join("")}
    </select>
  </label>`;
}

function readProductConfiguration(id, card) {
  const item = itemIndex[id];
  const hasVariants = Array.isArray(item.variants);
  const variantIndex = hasVariants ? Number(card.querySelector("[data-variant]").value) : -1;
  const variant = hasVariants ? item.variants[variantIndex] : null;
  const basePrice = hasVariants ? variant && variant.price : item.price;
  if (typeof basePrice !== "number" || !Number.isFinite(basePrice)) return null;

  const details = [];
  const selectionKey = [];
  if (variant) details.push(variant.label);

  let priceCents = toCents(basePrice);
  (item.options || []).forEach((option, optionIndex) => {
    const selectedValues = option.multi
      ? [...card.querySelectorAll(`[data-option="${optionIndex}"]:checked`)].map((input) => Number(input.dataset.value))
      : [Number(card.querySelector(`[data-option="${optionIndex}"]`).value)];
    selectionKey.push(selectedValues);
    const labels = selectedValues.map((valueIndex) => {
      const value = option.values[valueIndex];
      if (option.includedCount !== undefined && option.extraPrice !== undefined) {
        return value.label;
      }
      priceCents += toCents(value.price || 0);
      return value.label;
    });
    if (option.includedCount !== undefined && option.extraPrice !== undefined) {
      priceCents += Math.max(0, selectedValues.length - option.includedCount) * toCents(option.extraPrice);
    }
    if (labels.length) {
      details.push(option.bare ? labels.join(", ") : `${option.label}: ${labels.join(", ")}`);
    }
  });

  const label = details.length ? `${item.name} (${details.join("; ")})` : item.name;
  return {
    key: JSON.stringify([id, variantIndex, selectionKey]),
    label,
    priceCents,
  };
}

function updateProductPrice(card) {
  const config = readProductConfiguration(card.dataset.productId, card);
  const price = card.querySelector(".item-price");
  const button = card.querySelector("[data-add]");
  price.textContent = config ? money(config.priceCents / 100) : "Precio por definir";
  button.disabled = !config;
}

function renderMenu() {
  $("#cats").innerHTML = MENU.map((c, i) =>
    `<a class="chip${i === 0 ? " active" : ""}" href="#cat-${c.id}" data-cat="${c.id}">${c.emoji} ${c.label}</a>`).join("");

  $("#menu").innerHTML = MENU.map((c) => `
    <section class="cat" id="cat-${c.id}">
      <h2><span>${c.emoji}</span> ${c.label}</h2>
      ${c.note ? `<p class="category-note">${escapeHtml(c.note)}</p>` : ""}
      <ul class="items">
        ${c.items.map((it, i) => {
          const id = `${c.id}:${i}`;
          itemIndex[id] = it;
          return `<li class="item" data-product-id="${id}">
            <div class="item-name">${escapeHtml(it.name)}</div>
            ${it.desc ? `<p class="item-description">${escapeHtml(it.desc)}</p>` : ""}
            ${it.kcal ? `<p class="item-kcal">${escapeHtml(it.kcal)}</p>` : ""}
            ${it.variants ? `<label class="item-option">
              <span>${escapeHtml(it.variantLabel || "Presentación")}</span>
              <select data-product-control data-variant>
                ${it.variants.map((variant, variantIndex) =>
                  `<option value="${variantIndex}"${variant.price === null ? " disabled" : ""}${variant.price !== null && it.variants.slice(0, variantIndex).every((v) => v.price === null) ? " selected" : ""}>${escapeHtml(variant.label)}${variant.price === null ? " — precio por definir" : ""}</option>`
                ).join("")}
              </select>
            </label>` : ""}
            ${(it.options || []).map(renderOption).join("")}
            <div class="item-foot"><span class="item-price"></span><button type="button" class="add" data-add="${id}" aria-label="Agregar ${escapeHtml(it.name)}">+</button></div>
          </li>`;
        }).join("")}
      </ul>
    </section>`).join("");

  document.querySelectorAll(".item[data-product-id]").forEach(updateProductPrice);
}

document.addEventListener("click", (e) => {
  const addButton = e.target.closest("[data-add]");
  if (addButton) {
    const id = addButton.dataset.add;
    const config = readProductConfiguration(id, addButton.closest(".item"));
    if (!config) return;
    if (cart[config.key]) cart[config.key].quantity += 1;
    else cart[config.key] = { ...config, quantity: 1 };
    renderCart();
    return;
  }

  const cartButton = e.target.closest("[data-cart-act]");
  if (!cartButton) return;
  const id = decodeURIComponent(cartButton.dataset.id);
  if (!cart[id]) return;
  if (cartButton.dataset.cartAct === "remove") {
    delete cart[id];
    renderCart();
    return;
  }
  cart[id].quantity += cartButton.dataset.cartAct === "inc" ? 1 : -1;
  if (cart[id].quantity <= 0) delete cart[id];
  renderCart();
});

document.addEventListener("change", (e) => {
  const control = e.target.closest("[data-product-control]");
  if (control) updateProductPrice(control.closest(".item"));
});

/* Categorías: scroll directo al tocar + chip activo al desplazarse */
let manualScroll = false, manualTimer;

function centerChip(chip) {
  const nav = $("#cats");
  nav.scrollTo({ left: chip.offsetLeft - nav.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
}

function setActiveChip(id) {
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === id));
}

function watchCategories() {
  const nav = $("#cats");
  const prev = $("#catsPrev"), next = $("#catsNext");

  // Flechas ‹ › para mover la barra
  const step = () => Math.max(160, nav.clientWidth * 0.7);
  prev.addEventListener("click", () => nav.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => nav.scrollBy({ left: step(), behavior: "smooth" }));
  const updateArrows = () => {
    prev.disabled = nav.scrollLeft <= 2;
    next.disabled = nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 2;
  };
  nav.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows);
  updateArrows();

  // Arrastrar con el mouse (en el celular se desliza con el dedo)
  let down = false, startX = 0, startLeft = 0, dragged = false;
  nav.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true; dragged = false; startX = e.clientX; startLeft = nav.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) { dragged = true; nav.classList.add("dragging"); }
    if (dragged) nav.scrollLeft = startLeft - dx;
  });
  window.addEventListener("pointerup", () => { down = false; nav.classList.remove("dragging"); });

  // Al tocar una categoría: bajar exactamente a esa sección
  $("#cats").addEventListener("click", (e) => {
    if (dragged) { dragged = false; e.preventDefault(); return; }
    const chip = e.target.closest(".chip");
    if (!chip) return;
    e.preventDefault();
    const target = document.getElementById("cat-" + chip.dataset.cat);
    if (!target) return;

    manualScroll = true; // pausa el observador mientras dura el desplazamiento
    setActiveChip(chip.dataset.cat);
    centerChip(chip);

    const offset = $("#catsWrap").offsetHeight + 12;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });

    clearTimeout(manualTimer);
    manualTimer = setTimeout(() => { manualScroll = false; }, 1200);
  });

  // Al desplazarse a mano: resaltar la categoría visible
  const obs = new IntersectionObserver((entries) => {
    if (manualScroll) return;
    entries.forEach((en) => {
      if (en.isIntersecting) {
        const id = en.target.id.replace("cat-", "");
        setActiveChip(id);
        const chip = document.querySelector(`.chip[data-cat="${id}"]`);
        if (chip) centerChip(chip);
      }
    });
  }, { rootMargin: "-90px 0px -70% 0px" });
  document.querySelectorAll(".cat").forEach((s) => obs.observe(s));
}

/* ---------- Carrito ---------- */
function cartTotals() {
  let count = 0, subCents = 0;
  Object.values(cart).forEach((line) => {
    count += line.quantity;
    subCents += line.quantity * line.priceCents;
  });
  const zone = ZONES.find((z) => z.name === $("#sector").value);
  const delCents = zone ? toCents(zone.price) : 0;
  return { count, subCents, delCents, totalCents: subCents + delCents, zone };
}

function renderCart() {
  const t = cartTotals();
  $("#cartFab").hidden = t.count === 0;
  $("#fabCount").textContent = t.count;
  $("#fabTotal").textContent = money(t.subCents / 100);

  const ids = Object.keys(cart);
  $("#cartList").innerHTML = ids.length
    ? ids.map((id) => `
      <li class="cart-row">
        <div class="cart-item-info"><div class="n">${escapeHtml(cart[id].label)}</div><div class="p">${money(cart[id].priceCents * cart[id].quantity / 100)}</div></div>
        <div class="cart-actions">
          <div class="stepper"><button type="button" data-cart-act="dec" data-id="${encodeURIComponent(id)}" aria-label="Quitar uno">−</button><span>${cart[id].quantity}</span><button type="button" data-cart-act="inc" data-id="${encodeURIComponent(id)}" aria-label="Agregar uno">+</button></div>
          <button type="button" class="cart-remove" data-cart-act="remove" data-id="${encodeURIComponent(id)}" aria-label="Quitar ${escapeHtml(cart[id].label)} del pedido" title="Quitar del pedido">×</button>
        </div>
      </li>`).join("")
    : `<li class="empty">Tu pedido está vacío</li>`;

  $("#tSub").textContent = money(t.subCents / 100);
  $("#tDel").textContent = t.zone ? money(t.delCents / 100) : "—";
  $("#tZone").textContent = t.zone ? "" : "(elige tu sector)";
  $("#tTotal").textContent = money(t.totalCents / 100);
  updateSendState();
}

function openDrawer() {
  $("#drawer").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
  $("#overlay").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  $("#drawer").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  $("#overlay").hidden = true;
  document.body.style.overflow = "";
}
$("#cartFab").addEventListener("click", openDrawer);
$("#closeDrawer").addEventListener("click", closeDrawer);
$("#overlay").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

/* ---------- Ubicación ---------- */
let coords = null;
$("#gpsBtn").addEventListener("click", () => {
  const status = $("#gpsStatus");
  if (!navigator.geolocation) {
    status.className = "gps-status err";
    status.textContent = "Tu navegador no permite compartir ubicación. Escribe tu dirección abajo.";
    return;
  }
  status.className = "gps-status";
  status.textContent = "Obteniendo ubicación…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      status.className = "gps-status ok";
      status.textContent = "✅ Ubicación guardada";
      $("#formError").textContent = "";
    },
    () => {
      coords = null;
      status.className = "gps-status err";
      status.textContent = "No pudimos obtener tu ubicación. Activa el GPS o escribe tu dirección abajo.";
    },
    { enableHighAccuracy: true, timeout: 15000 }
  );
});

/* ---------- Envío del pedido ---------- */
function updateSendState() {
  const btn = $("#sendBtn");
  if (!btn) return;
  const empty = Object.keys(cart).length === 0;
  const blocked = !isOpen && !ALLOW_ORDERS_WHEN_CLOSED;
  btn.disabled = empty || blocked;
  $("#closedNote").textContent = blocked ? "Estamos cerrados, " + getStatus().detail + "." : "";
}

$("#sector").innerHTML =
  `<option value="">Selecciona tu sector…</option>` +
  ZONES.map((z) => `<option value="${z.name}">${z.name} — ${money(z.price)}</option>`).join("");
$("#sector").addEventListener("change", renderCart);

$("#orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const err = $("#formError");
  const name = $("#name").value.trim();
  const address = $("#address").value.trim();
  const notes = $("#notes").value.trim();
  const t = cartTotals();

  if (!t.count) { err.textContent = "Agrega al menos un producto."; return; }
  if (!name) { err.textContent = "Escribe tu nombre."; $("#name").focus(); return; }
  if (!t.zone) { err.textContent = "Selecciona tu sector para calcular el delivery."; $("#sector").focus(); return; }
  if (!coords && address.length < 8) {
    err.textContent = "La ubicación es obligatoria: comparte tu ubicación o escribe tu dirección con un punto de referencia.";
    return;
  }
  if (!isOpen && !ALLOW_ORDERS_WHEN_CLOSED) { err.textContent = "Estamos cerrados en este momento."; return; }
  err.textContent = "";

  const lines = Object.values(cart).map((line) =>
    `• ${line.quantity} x ${line.label} — ${money(line.priceCents * line.quantity / 100)}`);
  const msg = [
    "*Nuevo pedido · Mega Pepito Donde Javier*",
    "",
    `*Cliente:* ${name}`,
    "",
    ...lines,
    "",
    `Subtotal: ${money(t.subCents / 100)}`,
    `Delivery (${t.zone.name}): ${money(t.delCents / 100)}`,
    `*Total: ${money(t.totalCents / 100)}*`,
    "",
    coords ? `📍 Ubicación: https://www.google.com/maps?q=${coords.lat},${coords.lng}` : "📍 Ubicación: (sin GPS)",
    address ? `Referencia: ${address}` : "",
    notes ? `\n📝 *Notas:* ${notes}` : "",
    "",
    "💳 *Datos para pagar por Pago Móvil*",
    `Banco: ${PAGO.banco} (${PAGO.codigo})`,
    `Cédula: ${PAGO.cedula}`,
    `Teléfono: ${fmtPhone(PAGO.telefono)}`,
    `Monto: ${money(t.totalCents / 100)} (al cambio del día en Bs)`,
    "Enviaré el comprobante de pago por este chat. ¡Gracias!",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});

/* ---------- Inicio ---------- */
function renderZones() {
  $("#zoneList").innerHTML = ZONES.map((z) => `<li><span>${z.name}</span><b>${money(z.price)}</b></li>`).join("");
}
function renderPago() {
  const rows = [
    { label: "Banco", text: `${PAGO.banco} (código ${PAGO.codigo})`, copy: PAGO.codigo },
    { label: "Cédula", text: PAGO.cedula, copy: PAGO.cedula },
    { label: "Teléfono afiliado", text: fmtPhone(PAGO.telefono), copy: PAGO.telefono },
  ];
  $("#payData").innerHTML = rows.map((r) => `
    <li><div><span>${r.label}</span><b>${r.text}</b></div>
    <button type="button" class="copy-btn" data-copy="${r.copy}">Copiar</button></li>`).join("");
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;
  const value = btn.dataset.copy;
  const done = () => {
    btn.textContent = "¡Copiado!";
    btn.classList.add("done");
    setTimeout(() => { btn.textContent = "Copiar"; btn.classList.remove("done"); }, 1500);
  };
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = value; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (_) {}
    ta.remove();
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(value).then(done, fallback);
  else fallback();
});

const waLink = `https://wa.me/${WHATSAPP}`;
$("#waHero").href = waLink;
$("#waFooter").href = waLink;

renderMenu();
renderZones();
renderPago();
renderHours();
renderStatus();
renderCart();
watchCategories();
setInterval(renderStatus, 30000);
