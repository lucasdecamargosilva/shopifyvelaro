/* ── Velaro (22/10/2026, Lucas): no resultado, o preço da página com o riscado, o bloco
   "Compra 2, paga solo 1" e o "Completa tu selección". O carrossel é o NÓ REAL da página
   (movido, não clonado) pra manter as setas e o "+" funcionando; volta pro lugar quando o
   resultado some. O preço genérico (#pl-rl-price) só entende R$ — aqui é $, por isso o próprio. */
(function () {
    if (window.__plVelaroExtras) return; window.__plVelaroExtras = 1;
    function $(id) { return document.getElementById(id); }
    var moved = null, marker = null;
    function css() {
        if ($('pl-vel-css')) return;
        var s = document.createElement('style'); s.id = 'pl-vel-css';
        s.textContent =
            '#pl-rl-price { display: none !important; }' +
            '#pl-vel-price { margin-top: 4px; font-family: inherit; }' +
            '#pl-vel-price .pl-vel-old { font-size: 14px; color: var(--c-muted, #777); text-decoration: line-through; line-height: 1.2; }' +
            '#pl-vel-price .pl-vel-line { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }' +
            '#pl-vel-price .pl-vel-big { font-size: 26px; font-weight: 800; line-height: 1.1; color: var(--c-ink, #111); }' +
            '#pl-vel-price .pl-vel-tag { background: #16a34a; color: #fff; font-size: 12px; font-weight: 700; padding: 4px 9px; border-radius: 20px; line-height: 1; }' +
            '#pl-vel-bogo { margin: 14px 0 0 !important; width: 100% !important; box-sizing: border-box !important; }' +
            '#q-result-actions-col .velaro-crosssell { margin: 18px 0 4px !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }';
        document.head.appendChild(s);
    }
    function mainPriceBox() {
        var all = document.querySelectorAll('[id^="main-price"], .price.price--large');
        for (var i = 0; i < all.length; i++) if (!all[i].closest('#q-modal-ia, .velaro-crosssell')) return all[i];
        return null;
    }
    function num(t) { var m = String(t || '').replace(/[^\d.,]/g, '').match(/([\d.,]+)/); if (!m) return 0; var v = m[1]; if (/,\d{2}$/.test(v)) v = v.replace(/\./g, '').replace(',', '.'); else v = v.replace(/,/g, ''); return parseFloat(v) || 0; }
    function restore() {
        if (moved && marker && marker.parentNode) { marker.parentNode.insertBefore(moved, marker); marker.parentNode.removeChild(marker); }
        moved = null; marker = null;
    }
    function apply() {
        var step = $('q-step-result'), col = $('q-result-actions-col'), img = $('q-final-view-img');
        var shown = step && col && img && img.getAttribute('src') && step.offsetParent !== null;
        if (!shown) { restore(); return; }
        css();
        // preço com riscado
        var info = $('q-result-prodinfo'), box = mainPriceBox();
        if (info && box) {
            var sale = box.querySelector('.price__sale .price-item--sale') || box.querySelector('.price-item--regular');
            var cmp = box.querySelector('.price__compare-price s, s.price-item--regular');
            var s = sale ? sale.textContent.trim() : '', c = cmp ? cmp.textContent.trim() : '';
            if (s) {
                var pct = (c && num(c) > num(s)) ? Math.round((1 - num(s) / num(c)) * 100) : 0;
                var h = (pct > 0 ? '<div class="pl-vel-old">' + c + '</div>' : '') + '<div class="pl-vel-line"><div class="pl-vel-big">' + s + '</div>' + (pct > 0 ? '<span class="pl-vel-tag">-' + pct + '%</span>' : '') + '</div>';
                var pv = $('pl-vel-price');
                if (!pv) { pv = document.createElement('div'); pv.id = 'pl-vel-price'; info.appendChild(pv); }
                if (pv.innerHTML !== h) pv.innerHTML = h;
            }
        }
        // "Compra 2, paga solo 1" (cópia: é só texto)
        var bogo = document.querySelector('.velaro-bogo-offer:not(#pl-vel-bogo)');
        if (bogo && info && !$('pl-vel-bogo')) {
            var cl = bogo.cloneNode(true); cl.id = 'pl-vel-bogo';
            cl.querySelectorAll('[id]').forEach(function (e) { e.removeAttribute('id'); });
            info.parentNode.insertBefore(cl, info.nextSibling);
        }
        // "Completa tu selección" (nó real, volta pro lugar depois)
        if (!moved) {
            var cs = document.querySelector('.velaro-crosssell');
            if (cs && !cs.closest('#q-modal-ia')) {
                marker = document.createComment('pl-vel-crosssell'); cs.parentNode.insertBefore(marker, cs);
                col.appendChild(cs); moved = cs;
            }
        } else if (moved.parentNode !== col || col.lastElementChild !== moved) { col.appendChild(moved); }
    }
    function safe() { try { apply(); } catch (e) { try { console.warn('[PL velaro]', e); } catch (_) {} } }
    var t = null; function sched() { clearTimeout(t); t = setTimeout(safe, 80); }
    function watch() {
        try {
            new MutationObserver(function (ms) {
                for (var i = 0; i < ms.length; i++) {
                    var tg = ms[i].target;
                    if (tg && (tg.id === 'q-final-view-img' || tg.id === 'q-step-result' || tg.id === 'q-modal-ia' || tg.id === 'q-result-actions-col' || (tg.classList && tg.classList.contains('q-card-ia')))) { sched(); return; }
                }
            }).observe(document.documentElement, { subtree: true, attributes: true, childList: true, attributeFilter: ['src', 'style', 'class'] });
        } catch (e) {}
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch); else watch();
})();
