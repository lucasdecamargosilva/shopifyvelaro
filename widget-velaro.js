(function () {
    // ─── KILL SWITCH ─────────────────────────────────────────────────────────────
    // Backend segue ativo independente desta flag.
    // Para desligar o provador no front: mudar para true (e dar deploy no github.io/shopifycand).
    var PROVADOR_OFF = false;

    function toJpeg(file){return new Promise(function(res){try{var img=new Image();var u=URL.createObjectURL(file);img.onload=function(){URL.revokeObjectURL(u);var w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;if(!w||!h){res(file);return;}var sc=Math.min(1,1280/Math.max(w,h));var cw=Math.round(w*sc),ch=Math.round(h*sc);var c=document.createElement('canvas');c.width=cw;c.height=ch;c.getContext('2d').drawImage(img,0,0,cw,ch);c.toBlob(function(b){res(b||file);},'image/jpeg',0.92);};img.onerror=function(){URL.revokeObjectURL(u);res(file);};img.src=u;}catch(e){res(file);}});}

    // Repurposado para Velaro: valida E-MAIL (le o campo direto; o arg é ignorado
    // para nao mexer nos ~4 pontos que chamam isValidBRPhone(nums)).
    function isValidBRPhone() {
        var v = ((document.getElementById('q-phone') || {}).value || '').trim();
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        var el = document.getElementById('q-phone-error');
        if (el && !ok && v.length > 0) el.textContent = 'Correo electrónico inválido';
        return ok;
    }


    // ─── SEO BACKLINK BADGE (mini logo discreto pro crawler do Google) ───
    (function() {
        function injectPLBadge() {
            try {
                if (PROVADOR_OFF) return;
                if (document.querySelector('.pl-seo-badge')) return;
                var path = window.location.pathname;
                var isProduct = (document.querySelector('meta[property="og:type"][content="product"]') && /\/products\/[^\/?#]+/.test(path));
                if (!isProduct) return;
                var b = document.createElement('div');
                b.className = 'pl-seo-badge';
                b.style.cssText = 'text-align:center;padding:4px 0;margin:0;opacity:0.5;line-height:1;';
                var a = document.createElement('a');
                a.href = 'https://provoulevou.com.br?utm_source=widget&utm_medium=lojista&utm_campaign=cand';
                a.target = '_blank';
                a.rel = 'noopener';
                a.title = 'Prueba Gafas Online — Provou Levou';
                a.style.cssText = 'display:inline-block;text-decoration:none;border:0;outline:0;';
                var img = document.createElement('img');
                img.src = 'data:image/png;base64,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';
                img.alt = 'Prueba Gafas Online — Provou Levou';
                img.style.cssText = 'height:12px;width:auto;border:0;display:block;';
                a.appendChild(img);
                b.appendChild(a);
                document.body.appendChild(b);
            } catch(e) {}
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectPLBadge);
        else injectPLBadge();
        setTimeout(injectPLBadge, 2500);
    })();


    // ===============================================
    // 0. CHUMBAR A API KEY AQUI DIRETO NO CÓDIGO
    // ===============================================
    const apiKey = "69426e028cd12980499bf2717452591604d5540a7415497f61e3efb1232bae3b";
    window.PROVOU_LEVOU_API_KEY = apiKey;

    const WEBHOOK_PROVA = 'https://n8n.segredosdodrop.com/webhook/gerador-oculos';
    const WEBHOOK_PIX = 'https://n8n.segredosdodrop.com/webhook/cacife-pix';
    const WEBHOOK_PIX_STATUS = 'https://n8n.segredosdodrop.com/webhook/cacife-pix-status';
    const WEBHOOK_CHECK_LIMIT = 'https://n8n.segredosdodrop.com/webhook/velaro-check-limit';
    const SIZES_TOP = ['XXP', 'XP', 'P', 'M', 'G', 'XG', 'XXG', '3XG', '4XG', '5XG'];
    const SIZES_BOTTOM = ['36/XXP', '38/XP', '40/P', '42/M', '44/G', '46/XG', '48/XXG', '50/3XG', '52/4XG', '54/5XG'];
    const SIZES_BOTTOM_SW = ['XXP', 'XP', 'P', 'M', 'G', 'XG', 'XXG', '3XG', '4XG', '5XG'];


    const GRADE = {
        regular: [49, 51, 54, 57, 61, 62, 64, 66, 70, 73],
        oversized: [58, 60, 62, 64, 66, 70, 73, 76, 79, 83],
        oversizedSS: [58, 61, 63, 67, 70, 74, 78, 82, 87, 92],
        hoodie: [50, 53, 55, 58, 62, 65, 69, 74, 79, 83],
        boxyHoodie: [61, 77, 78, 79, 80, 81, 82, 83, 84, 85],
        puffer: [53, 56, 59, 61, 70, 74, 78, 82, 86, 90],
        vest: [52, 55, 57, 59, 63, 66, 70, 72, 76, 82],
        boxyHenley: [54, 56, 58, 64, 66, 68, 70, 76, 78, 84],
        bottomTailoring: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54],
        bottomSweat: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54],
        underwear: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54],
        quadrilTailoring: [48, 50, 52, 56, 58, 60, 62, 64, 66, 68],
        quadrilSweat: [48, 50, 52, 54, 56, 58, 60, 62, 64, 66],
        quadrilUnderwear: [50, 52, 54, 56, 58, 60, 62, 64, 66, 68],
    };


    function detectProduct(name) {
        const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (/tailoring/.test(n) || /\d\/\d\s*short/.test(n) || /\b(1\/5|2\/5|3\/5|4\/5)\b/.test(n)) return { category: 'bottom', fit: 'tailoring' };
        if (/underwear|cueca/.test(n)) return { category: 'bottom', fit: 'underwear' };
        if (/sweatpant|sweatshort|sweat pant|sweat short|calca|bermuda/.test(n)) return { category: 'bottom', fit: 'sweat' };
        if (/henley/.test(n)) return { category: 'top', fit: 'boxyHenley' };
        if (/boxy.*(hoodie|crewneck|crew)/.test(n) || /(hoodie|crewneck|crew).*boxy/.test(n)) return { category: 'top', fit: 'boxyHoodie' };
        if (/puffer|jacket/.test(n)) return { category: 'top', fit: 'puffer' };
        if (/vest/.test(n)) return { category: 'top', fit: 'vest' };
        if (/(hoodie|hoodie zip|half zip|crewneck|crew neck)/.test(n) && !/oversized|boxy|short sleeve/.test(n)) return { category: 'top', fit: 'hoodie' };
        if (/oversized.*(hoodie|crewneck|crew|short sleeve)/.test(n) || /short sleeve.*(hoodie|crewneck)/.test(n)) return { category: 'top', fit: 'oversizedSS' };
        if (/oversized|boxy tee|2\/4/.test(n)) return { category: 'top', fit: 'oversized' };
        return { category: 'top', fit: 'regular' };
    }


    function estimarTorax(altura, peso) {
        if (altura < 3) altura *= 100;
        let circ = 0.65 * peso + 56;
        const imc = peso / Math.pow(altura / 100, 2);
        if (imc > 30) circ += 4; else if (imc > 25) circ += 2;
        return circ;
    }


    function findClosest(arr, val) {
        let idx = 0, minDiff = Infinity;
        arr.forEach((v, i) => { const d = Math.abs(v - val); if (d < minDiff) { minDiff = d; idx = i; } });
        return idx;
    }


    let recommendedSize = 'M';
    let currentProduct = { category: 'top', fit: 'regular' };

    function calculateFinalSize() {
        // Feature desativada: não faz mais cálculos de tamanho
        return;
    }


    // ─── LOCK / UNLOCK SCROLL DA PÁGINA ──────────────────────────────────────────


    let scrollY = 0;


    function lockBodyScroll() {
        scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflowY = 'scroll';
    }


    function unlockBodyScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, scrollY);
    }


    // ─── ESTILOS ──────────────────────────────────────────────────────────────────


    const styles = `
/* PL: borda arredondada do modal */@media(min-width:768px){.q-card-ia,.q-card,#q-card-ia,#q-card,.q-modal-card{border-radius:16px !important;overflow:hidden;}}
        /* ── Fontes ── */

        :root {
            --c-bg: #ffffff;
            --c-surface: #f7f6f4;
            --c-ink: #111111;
            --c-muted: #999;
            --c-line: #e8e8e8;
            --c-accent: #111111;
            --c-danger: #cc3333;
            --font-display: inherit;
            --font-body: inherit;
        }

        /* ── Trigger (selo sobre foto) ── */
        @keyframes q-shake { 0%,50%,100%{transform:rotate(0deg)} 10%,30%{transform:rotate(-10deg)} 20%,40%{transform:rotate(10deg)} }
        .q-btn-trigger-ia {
            position: absolute !important; top: 14px !important; right: 14px !important; left: auto !important; bottom: auto !important; z-index: 100;
            background: none; border: none; padding: 0 !important; cursor: pointer;
            width: 64px !important; height: 64px !important;
            min-width: 0 !important; max-width: 64px !important; max-height: 64px !important;
            flex: 0 0 auto !important;
            display: flex; align-items: center; justify-content: center;
            filter: drop-shadow(0 3px 10px rgba(0,0,0,0.22));
            animation: q-shake 3s infinite;
            transition: filter 0.2s;
        }
        .q-btn-trigger-ia:hover { filter: drop-shadow(0 6px 18px rgba(0,0,0,0.32)); }
        .q-btn-trigger-ia img { width: 100%; height: 100%; object-fit: contain; opacity: 1 !important; }
        @media (min-width: 768px) { .q-btn-trigger-ia { width: 64px !important; height: 64px !important; } }

        /* ── Inline button ── */
        .q-btn-inline-provador {
            display: flex; align-items: center; justify-content: center; gap: 7px;
            width: 100%; padding: 13px 16px;
            background: transparent; color: var(--c-ink);
            border: 1.5px solid var(--c-ink); border-radius: 25px;
            font-family: 'Work Sans', var(--font-body), sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
            cursor: pointer; transition: background 0.25s, color 0.25s;
            margin-bottom: 10px; box-sizing: border-box;
        }
        .q-btn-inline-provador:hover { background: var(--c-ink); color: #fff; }
        .q-btn-inline-provador svg { width: 14px; height: 14px; flex-shrink: 0; }

        /* ── Modal overlay ── */
        @keyframes q-modal-in { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        #q-modal-ia {
            display: none; position: fixed; inset: 0; z-index: 999999;
            background: rgba(240,238,235,0.96);
            font-family: var(--font-body);
            overflow-y: auto; box-sizing: border-box;
        }
        #q-modal-ia * { box-sizing: border-box; }

        /* ── Card ── */
        .q-card-ia {
            width: 100%; min-height: 100vh;
            background: var(--c-bg); color: var(--c-ink);
            display: flex; flex-direction: column; position: relative;
            animation: q-modal-in 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        @media (min-width: 768px) {
            #q-modal-ia { display: none; align-items: center; justify-content: center; }
            .q-card-ia {
                width: 440px; max-width: 92vw; min-height: auto;
                max-height: 96vh; border: none;
                box-shadow: 0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);
                overflow: hidden;
            }
        }

        /* ── Close ── */
        .q-close-ia {
            position: absolute; top: 18px; right: 18px;
            background: none; border: none;
            font-size: 20px; font-weight: 300; color: var(--c-muted);
            cursor: pointer; z-index: 10; line-height: 1; padding: 4px 6px;
            transition: color 0.2s;
        }
        .q-close-ia:hover { color: var(--c-ink); }

        /* ── Content scroll ── */
        .q-content-scroll {
            flex: 1; padding: 0; overflow-y: auto;
            text-align: left; display: flex; flex-direction: column;
        }
        .q-content-scroll::-webkit-scrollbar { width: 3px; }
        .q-content-scroll::-webkit-scrollbar-thumb { background: var(--c-line); }

        @media (max-width: 767px) {
            #q-modal-ia { display:none; overflow-y:auto; align-items:flex-start; justify-content:center; }
            #q-modal-ia[style*="flex"] { display:flex !important; }
            .q-card-ia { width:100%; border:none; margin:0; min-height:100svh; }
            .q-content-scroll { flex: 1; }
        }

        /* ── Header strip ── */
        #q-header-provador {
            padding: 28px 28px 0;
            display: flex; flex-direction: column; align-items: center;
            text-align: center; gap: 10px;
            border-bottom: 1px solid var(--c-line);
            padding-bottom: 22px; margin-bottom: 0;
        }
        #q-header-provador h1 {
            margin: 0;
            font-family: var(--font-display);
            font-size: 22px; letter-spacing: 4px;
            color: var(--c-ink); text-transform: uppercase;
            font-weight: 400; line-height: 1;
        }

        /* ── Main step ── */
        #q-step-photo {
            display: flex; flex-direction: column; padding: 28px 28px 32px;
            gap: 0; align-items: stretch;
        }

        /* ── Labels & inputs ── */
        .q-field-label {
            display: block; font-size: 10px; font-weight: 600;
            letter-spacing: 2px; text-transform: uppercase;
            color: var(--c-muted); margin-bottom: 8px;
        }
        .q-phone-wrap { margin-bottom: 28px; }
        .q-input {
            display: block; width: 100%; height: 52px;
            padding: 0 16px; margin: 0;
            background: var(--c-surface); border: 1.5px solid transparent;
            border: 1.5px solid var(--c-line); border-radius: 14px;
            font-size: 16px; font-family: var(--font-body); font-weight: 400;
            color: var(--c-ink); outline: none;
            -webkit-appearance: none; appearance: none; transition: border-color 0.2s;
        }
        .q-input:focus { border-color: var(--c-ink); background: #fff; }
        .q-input::placeholder { color: #bbb; }

        .q-provas-msg:empty { display: none; }
        .q-provas-msg {
            font-size: 13px; margin-top: 10px; letter-spacing: 0.3px;
            color: var(--c-ink); font-weight: 500;
            background: var(--c-surface);
            border: 1px solid var(--c-line);
            border-radius: 6px;
            padding: 10px 14px;
            text-align: center;
            transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .q-provas-msg.is-warn {
            color: var(--c-danger);
            background: rgba(204,51,51,0.08);
            border-color: rgba(204,51,51,0.3);
            font-weight: 600;
        }

        .q-status-msg {
            display: none; font-size: 11px; color: var(--c-danger);
            font-weight: 500; margin-top: 6px; letter-spacing: 0.3px;
        }

        /* ── Section label ── */
        .q-section-label {
            font-family: var(--font-display);
            font-size: 16px; letter-spacing: 3px; text-transform: uppercase;
            color: var(--c-ink); margin: 0 0 14px; font-weight: 400;
            text-align: center;
        }

        /* ── Tip ── */
        .q-tip-box {
            display: flex; align-items: center; gap: 9px;
            background: var(--c-surface);
            padding: 11px 14px; margin-bottom: 20px;
            font-size: 11.5px; color: var(--c-muted); line-height: 1.45;
            border-radius: 6px;
        }
        .q-tip-box i { color: var(--c-ink); font-size: 15px; flex-shrink: 0; }
        /* ── Required field marker + shake feedback ── */
        .q-required-mark { color: var(--c-danger); font-weight: 700; margin-left: 4px; }
        @keyframes q-shake-x {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
            20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .q-shake { animation: q-shake-x 0.5s cubic-bezier(.36,.07,.19,.97); }
        .q-input.is-error {
            border-color: var(--c-danger) !important;
            background: rgba(204,51,51,0.06) !important;
            box-shadow: 0 0 0 3px rgba(204,51,51,0.15);
        }
        .q-face-frame.is-error {
            outline: 3px solid var(--c-danger);
            outline-offset: 2px;
            background: rgba(204,51,51,0.06);
        }
        .q-validation-hint {
            display: none;
            background: var(--c-danger);
            color: #fff;
            font-size: 13px; font-weight: 600;
            letter-spacing: 0.3px;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            text-align: center;
            box-shadow: 0 3px 10px rgba(204,51,51,0.25);
            animation: q-pop-in 0.25s ease;
        }
        .q-validation-hint.is-visible { display: block; }
        @keyframes q-pop-in {
            0% { opacity: 0; transform: translateY(-6px); }
            100% { opacity: 1; transform: translateY(0); }
        }


        /* ── Face frame ── */
        @keyframes q-frame-pulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }
        .q-face-frame {
            position: relative; width: 200px; height: 260px;
            margin: 0 auto 24px; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden; background: var(--c-surface);
            border-radius: 4px;
            transition: transform 0.2s;
        }
        .q-face-frame:hover { transform: scale(1.015); }
        .q-face-frame img { width: 100%; height: 100%; object-fit: cover; display: none; }
        /* Câmera ao vivo (getUserMedia) */
        .q-cam-overlay { position: fixed; inset: 0; z-index: 2147483646; background: #000; display: none; align-items: center; justify-content: center; }
        .q-cam-overlay.is-open { display: flex; }
        .q-cam-video { width: 100%; height: 100%; object-fit: cover; }
        .q-cam-overlay.is-front .q-cam-video { transform: scaleX(-1); }
        .q-cam-controls { position: absolute; bottom: 24px; left: 0; right: 0; display: flex; align-items: center; justify-content: center; gap: 28px; }
        .q-cam-shutter { width: 68px; height: 68px; border-radius: 50%; background: #fff; border: 4px solid rgba(255,255,255,.55); cursor: pointer; box-shadow: 0 2px 12px rgba(0,0,0,.45); padding: 0; }
        .q-cam-shutter:active { transform: scale(.93); }
        .q-cam-mini { width: 46px; height: 46px; border-radius: 50%; background: rgba(0,0,0,.5); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 22px; line-height: 1; }
        .q-cam-close { position: absolute; top: 14px; right: 14px; }
        .q-face-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .q-face-placeholder i { font-size: 72px; color: #d0d0d0; }
        /* Corner marks — clean editorial style */
        .q-face-corner {
            position: absolute; width: 20px; height: 20px;
            border-color: var(--c-ink); border-style: solid;
            transition: border-color 0.2s;
        }
        .q-face-corner-tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
        .q-face-corner-tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
        .q-face-corner-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
        .q-face-corner-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

        /* ── Upload buttons ── */
        .q-upload-btns {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 8px; width: 100%; margin-bottom: 24px;
        }
        .q-upload-btn {
            display: flex; align-items: center; justify-content: center; gap: 7px;
            padding: 12px 8px;
            border: 1.5px solid var(--c-line);
            background: transparent; color: var(--c-ink);
            font-family: var(--font-body); font-size: 12px; font-weight: 500;
            cursor: pointer; transition: border-color 0.2s, background 0.2s; border-radius: 14px;
        }
        .q-upload-btn:hover { border-color: var(--c-ink); background: var(--c-surface); }
        .q-upload-btn i { font-size: 16px; }

        /* ── Terms ── */
        .q-terms-row {
            display: flex; align-items: center; gap: 8px;
            font-size: 10px !important; color: var(--c-muted); cursor: pointer;
            line-height: 1.35 !important; margin-bottom: 14px;
            justify-content: center; text-align: center;
        }
        .q-terms-row span { font-size: 10px !important; line-height: 1.35 !important; }
        .q-terms-row input { width: 13px; height: 13px; margin-top: 0; cursor: pointer; accent-color: var(--c-ink); flex-shrink: 0; }
        .q-terms-row a { color: var(--c-ink); text-decoration: underline; text-underline-offset: 2px; font-size: 10px !important; }

        /* ── CTA buttons ── */
        .q-btn-black {
            width: 100%; height: 52px;
            background: var(--c-ink); color: #fff;
            border: none; border-radius: 14px;
            font-family: var(--font-display); font-size: 14px;
            letter-spacing: 3px; text-transform: uppercase;
            cursor: pointer; transition: opacity 0.2s; box-sizing: border-box;
        }
        .q-btn-black:hover:not(:disabled) { opacity: 0.82; }
        .q-btn-black:disabled { background: #ccc; cursor: not-allowed; }
        .q-btn-outline {
            width: 100%; height: 52px;
            background: transparent; color: var(--c-ink);
            border: 1.5px solid var(--c-line); border-radius: 14px;
            font-family: var(--font-display); font-size: 14px;
            letter-spacing: 3px; text-transform: uppercase;
            cursor: pointer; transition: border-color 0.2s, background 0.2s; box-sizing: border-box;
        }
        .q-btn-outline:hover { border-color: var(--c-ink); background: var(--c-surface); }

        /* ── PIX screen ── */
        #q-step-pix {
            display: none; text-align: center;
            padding: 36px 28px; flex-direction: column; gap: 16px; align-items: center;
        }
        #q-step-pix h2 {
            font-family: var(--font-display); font-size: 19px;
            letter-spacing: 3px; text-transform: uppercase; margin: 0; font-weight: 400;
        }
        .q-pix-subtitle { font-size: 13px; color: var(--c-muted); margin: 0; line-height: 1.6; }
        .q-pix-qr { width: 180px; height: 180px; border: 1px solid var(--c-line); padding: 6px; margin: 0 auto; }
        .q-pix-qr img { width: 100%; height: 100%; }
        .q-pix-copiacola { display: flex; gap: 8px; width: 100%; max-width: 320px; margin: 0 auto; }
        .q-pix-copiacola input {
            flex: 1; height: 40px; padding: 0 12px; border: 1px solid var(--c-line);
            background: var(--c-surface); font-size: 11px; font-family: var(--font-body);
            outline: none; min-width: 0;
        }
        .q-pix-copiacola button {
            height: 40px; padding: 0 14px; background: var(--c-ink); color: #fff;
            border: none; font-size: 10px; font-weight: 600; letter-spacing: 1px;
            text-transform: uppercase; cursor: pointer;
        }
        .q-pix-status { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--c-muted); }
        @keyframes q-pix-pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        .q-pix-waiting { animation: q-pix-pulse 1.5s infinite ease-in-out; color: #d97706; }
        .q-pix-approved { color: #16a34a; }
        .q-pix-cancel { font-size: 11px; color: var(--c-muted); text-decoration: underline; cursor: pointer; margin-top: 4px; }

        /* ── Loading ── */
        @keyframes q-slide { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        @keyframes q-alt-show { 0%,5%{opacity:0;transform:translateY(6px)} 15%,45%{opacity:1;transform:translateY(0)} 55%,100%{opacity:0;transform:translateY(-6px)} }
        @keyframes q-alt-hide { 0%,55%{opacity:0;transform:translateY(6px)} 65%,95%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-6px)} }
        #q-loading-box {
            display: none; padding: 28px;
            text-align: center; flex: 1; flex-direction: column;
            align-items: center; justify-content: center; min-height: 60vh;
        }
        .q-loading-texts {
            position: relative; height: 36px; width: 100%;
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 24px;
        }
        .q-loading-t1, .q-loading-t2 {
            position: absolute; width: 100%;
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .q-loading-t1 {
            font-family: var(--font-display); font-size: 15px; letter-spacing: 4px;
            text-transform: uppercase; color: var(--c-ink);
            animation: q-alt-show 3.6s ease-in-out infinite;
        }
        .q-loading-t2 {
            animation: q-alt-hide 3.6s ease-in-out infinite;
            text-decoration: none; opacity: 0;
        }
        .q-loading-t2 span {
            font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
            color: var(--c-muted); font-family: var(--font-body);
        }
        .q-loading-t2 img { height: 16px; width: auto; opacity: 0.7; }
        .q-loading-bar { height: 3px; background: var(--c-line); width: 100%; position: relative; overflow: hidden; border-radius: 2px; }
        .q-loading-bar > div {
            position: absolute; top: 0; left: 0; height: 100%; width: 100%;
            background: var(--c-ink); border-radius: 2px;
            transform: scaleX(0); transform-origin: left;
            transition: transform 0.3s ease-out;
        }

        /* ── Result ── */
        #q-step-result { display: none; flex-direction: column; gap: 0; align-items: stretch; }

        .q-res-title {
            display: block;
            font-family: var(--font-display); font-size: 15px;
            letter-spacing: 3px; text-transform: uppercase;
            color: var(--c-ink); padding: 20px 28px 16px; margin: 0;
            border-bottom: 1px solid var(--c-line);
            text-align: center;
        }
        .q-res-subtitle, .q-res-note { display: none; }

        #q-result-img-col {
            width: 100%; max-height: 56vh; background: var(--c-surface);
            overflow: hidden; display: flex; align-items: center; justify-content: center;
        }
        #q-result-img-col img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }

        #q-result-actions-col {
            display: flex; flex-direction: column; gap: 8px;
            padding: 20px 28px 26px;
        }
        .q-res-mobile-only { margin: 0; }

        /* CTA de compra na tela de resultado */
        .q-result-prodinfo { text-align: left; margin-bottom: 6px; }
        .q-result-prodname {
            font-family: var(--font-body); font-size: 20px; font-weight: 700;
            color: var(--c-ink); line-height: 1.25; margin-bottom: 6px;
        }
        .q-result-prodprice {
            font-family: var(--font-display); font-size: 28px; letter-spacing: .5px; font-weight: 700;
            color: var(--c-ink); line-height: 1;
        }
        .q-result-installment {
            font-family: var(--font-body); font-size: 12px; color: var(--c-muted);
            margin-top: 4px; letter-spacing: .2px;
        }
        .q-scarcity {
            margin-top: 12px; font-family: var(--font-body); font-size: 13px; font-weight: 700;
            color: var(--c-danger); letter-spacing: 1.5px; text-transform: uppercase;
            display: flex; align-items: center; justify-content: flex-start; gap: 6px;
        }
        .q-scarcity i { font-size: 15px; }
        /* Selos de segurança */
        .q-seals {
            display: flex; justify-content: flex-start; gap: 30px;
            margin: 8px 0; padding: 12px 0;
            border-top: 1px solid var(--c-line); border-bottom: 1px solid var(--c-line);
        }
        .q-seal { display: flex; align-items: center; gap: 9px; }
        .q-seal > i { font-size: 24px; color: var(--c-ink); flex-shrink: 0; }
        .q-seal span {
            font-family: var(--font-body); font-size: 12px; font-weight: 700;
            text-transform: uppercase; letter-spacing: .6px; line-height: 1.25;
            color: var(--c-ink); text-align: left;
        }
        .q-fakebuy {
            position: fixed; left: 18px; bottom: 18px; z-index: 2147483000;
            background: var(--c-bg, #fff); color: var(--c-ink); border: 1px solid var(--c-line); border-radius: 10px;
            box-shadow: 0 8px 28px -6px rgba(0,0,0,.28); padding: 11px 14px;
            display: flex; align-items: center; gap: 10px; max-width: 290px;
            font-family: var(--font-body); opacity: 0; transform: translateY(14px);
            pointer-events: none; transition: opacity .35s ease, transform .35s ease;
        }
        .q-fakebuy.show { opacity: 1; transform: translateY(0); }
        .q-fakebuy > i { font-size: 22px; color: var(--c-ink); flex-shrink: 0; }
        .q-fakebuy strong { font-size: 12.5px; font-weight: 700; }
        .q-fakebuy > div { display: flex; flex-direction: column; line-height: 1.35; }
        .q-fakebuy span { font-size: 10.5px; color: var(--c-muted); }
        @media (max-width:560px){ .q-fakebuy{ left:12px; right:12px; bottom:12px; max-width:none; } }
        .q-btn-buy-now {
            background: var(--c-ink); color: #fff; border: 1px solid var(--c-ink);
            width: 100%; padding: 17px 18px; font-family: var(--font-body);
            font-weight: 700; font-size: 15px; letter-spacing: .2px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            border-radius: 14px; transition: .2s; line-height: 1.2;
        }
        .q-btn-buy-now:hover { opacity: .88; }
        .q-btn-buy-now .q-buy-price { font-weight: 800; white-space: nowrap; }
        .q-buy-trust {
            text-align: center; font-size: 11px; color: var(--c-muted);
            margin-top: 2px; letter-spacing: .2px;
        }

        /* ── Related products ── */
        #q-related-products { padding: 0 28px 28px; }
        #q-related-products h4 {
            font-family: var(--font-display); font-size: 13px;
            letter-spacing: 3px; text-transform: uppercase;
            color: var(--c-muted); margin: 20px 0 12px; font-weight: 400;
        }
        .q-related-grid {
            display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
        }
        .q-related-grid::-webkit-scrollbar { display: none; }
        .q-related-card {
            flex: 0 0 calc(33.333% - 7px); min-width: 88px;
            text-decoration: none; color: var(--c-ink);
            display: flex; flex-direction: column; gap: 6px;
        }
        .q-related-card img {
            width: 100%; aspect-ratio: 1/1; object-fit: cover;
            border: 1px solid var(--c-line); display: block; border-radius: 3px;
        }
        .q-related-card-name {
            font-size: 10px; font-weight: 500; line-height: 1.4; color: var(--c-ink);
            overflow: hidden; display: -webkit-box;
            -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }

        /* Desktop result split */
        @media (min-width: 768px) {
            .q-card-ia.is-result { width: 780px !important; max-width: 90vw !important; max-height: 92vh !important; }
                /* .q-powered-footer always visible */
            .q-card-ia.is-result .q-content-scroll {
                padding: 0 !important; overflow-y: auto !important;
                display: flex !important; flex-direction: column !important;
            }
            .q-card-ia.is-result #q-step-result {
                display: flex !important; flex-direction: row !important;
                flex-wrap: wrap !important; width: 100%; align-items: stretch; gap: 0;
            }
            .q-card-ia.is-result .q-res-title {
                flex-basis: 100%; order: -1;
                font-size: 16px; letter-spacing: 3px;
                padding: 16px 24px; border-bottom: 1px solid var(--c-line);
            }
            .q-card-ia.is-result #q-result-img-col {
                width: 44% !important; min-height: 360px !important;
                border-right: 1px solid var(--c-line); flex-shrink: 0;
            }
            .q-card-ia.is-result #q-result-img-col img {
                width: 100% !important; height: 100% !important;
                object-fit: cover !important; object-position: top center !important;
            }
            .q-card-ia.is-result #q-result-actions-col {
                width: 56% !important; padding: 28px 24px !important;
                display: flex !important; flex-direction: column !important;
                justify-content: flex-start; gap: 10px;
                overflow-y: auto;
            }
            .q-card-ia.is-result #q-related-products { padding: 0; margin-top: 4px; }
            .q-card-ia.is-result .q-res-mobile-only { display: flex !important; }
        }

        /* ── Error screen ── */
        #q-step-error {
            display: none; flex-direction: column; gap: 20px;
            align-items: center; text-align: center;
            padding: 52px 28px;
        }
        #q-step-error h2 {
            font-family: var(--font-display); font-size: 18px;
            letter-spacing: 3px; text-transform: uppercase; margin: 0; font-weight: 400;
        }
        #q-step-error p { font-size: 13px; color: var(--c-muted); margin: 0; line-height: 1.6; }

        /* ── Footer ── */
        .q-powered-footer {
            background: var(--c-surface); padding: 14px 20px;
            display: flex; align-items: center; justify-content: center; gap: 9px;
            flex-shrink: 0; border-top: 1px solid var(--c-line); text-decoration: none;
        }
        .q-powered-footer span { font-size: 9.5px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--c-muted); }
        .q-quantic-logo { height: 20px; opacity: 0.7; }
    `;


    // ─── IMAGEM DO BOTÃO (trigger) ─────────────────────────────────────────────
    // Selo do provador embutido como data URI (independente de CDN externa).
    const stampImageURL = 'data:image/png;base64,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';
    const stampImageHTML = `<img src="${stampImageURL}" alt="Probador Virtual" style="width:100%;height:100%;object-fit:contain;opacity:1;">`;



    // ─── HTML ─────────────────────────────────────────────────────────────────────


    const html = `
        <div id="q-modal-ia">
            <div class="q-card-ia">
                <button type="button" class="q-close-ia" id="q-close-btn">&times;</button>
                <div class="q-content-scroll">

                    <!-- Persistent header (all steps) -->
                    <div id="q-header-provador">
                        <h1>Probador Virtual</h1>
                        <img src="https://usevelaro.shop/cdn/shop/files/ChatGPT_Image_23_de_jul._de_2026__01_16_18-removebg-preview.png?v=1784780324&width=300" alt="VELARO" style="height:44px;width:auto;"/>
                    </div>

                    <!-- Main step -->
                    <div id="q-step-photo">
                        <!-- WhatsApp -->
                        <div class="q-phone-wrap">
                            <span class="q-field-label">Tu correo electrónico<span class="q-required-mark">*</span></span>
                            <input type="email" id="q-phone" class="q-input" placeholder="tu@correo.com" maxlength="80" autocomplete="email">
                            <div id="q-phone-error" class="q-status-msg">Correo electrónico inválido</div>
                            <div id="q-provas-restantes" class="q-provas-msg"></div>
                        </div>

                        <!-- Photo section -->
                        <p class="q-section-label">Sube tu foto</p>
                        <div class="q-tip-box">
                            <i class="ph ph-lightbulb"></i>
                            <span>Usa una foto nítida, de frente y con buena iluminación.</span>
                        </div>

                        <!-- Face frame -->
                        <div class="q-face-frame" id="q-face-frame">
                            <div class="q-face-corner q-face-corner-tl"></div>
                            <div class="q-face-corner q-face-corner-tr"></div>
                            <div class="q-face-corner q-face-corner-bl"></div>
                            <div class="q-face-corner q-face-corner-br"></div>
                            <img id="q-pre-img" alt="Tu foto">
                            <div class="q-face-placeholder" id="q-face-placeholder">
                                <i class="ph ph-user-circle" style="font-size:80px;color:#d4d4d4;"></i>
                            </div>
                        </div>

                        <!-- Upload buttons -->
                        <div class="q-upload-btns">
                            <button class="q-upload-btn" id="q-btn-camera">
                                <i class="ph ph-camera"></i> Tomar foto
                            </button>
                            <button class="q-upload-btn" id="q-btn-gallery">
                                <i class="ph ph-image"></i> Desde la galería
                            </button>
                            <input type="file" id="q-camera-input" accept="image/*" capture="user" style="display:none">
                            <input type="file" id="q-gallery-input" accept="image/*" style="display:none">
                        </div>

                        <!-- Terms -->
                        <label class="q-terms-row">
                            <input type="checkbox" id="q-accept-terms">
                            <span>Acepto los <a href="http://provoulevou.com.br/termos.html" target="_blank">Términos y Condiciones</a></span>
                        </label>

                        <div id="q-validation-hint" class="q-validation-hint"></div>
                        <button class="q-btn-black" id="q-btn-generate">Probar gafas</button>
                    </div>

                    <!-- PIX -->
                    <div id="q-step-pix">
                        <h2>Prueba Extra</h2>
                        <p class="q-pix-subtitle">Límite de 3 pruebas alcanzado.<br>Pague R$1 via PIX para mais uma:</p>
                        <p style="font-size: 11px; color: var(--c-muted); margin: 8px 0 0; line-height: 1.5; text-align: center;">&#8505;&#65039; Cobran&#231;a feita pela Provou Levou, n&#227;o pela loja</p>
                        <div class="q-pix-qr"><img id="q-pix-qr-img" alt="QR Code PIX"></div>
                        <div class="q-pix-copiacola">
                            <input type="text" id="q-pix-code" readonly placeholder="C&#243;digo PIX...">
                            <button id="q-pix-copy-btn">Copiar</button>
                        </div>
                        <div id="q-pix-status-msg" class="q-pix-status q-pix-waiting">Esperando el pago...</div>
                        <p class="q-pix-cancel" id="q-pix-cancel">Cancelar</p>
                    </div>

                    <!-- Loading -->
                    <div id="q-loading-box">
                        <div class="q-loading-texts">
                            <div class="q-loading-t1">Generando tu prueba...</div>
                            <a href="https://provoulevou.com.br?utm_source=widget&utm_medium=lojista&utm_campaign=cand" target="_blank" class="q-loading-t2">
                                <span>Powered by</span>
                                <img src="data:image/png;base64,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" alt="Provou Levou">
                            </a>
                        </div>
                        <div class="q-loading-bar"><div></div></div>
                    </div>

                    <!-- Resultado -->
                    <div id="q-step-result">
                        <span class="q-res-title">Mira cómo te queda</span>
                        <div id="q-result-img-col">
                            <img id="q-final-view-img">
                        </div>
                        <div id="q-result-actions-col">
                            <div class="q-fakebuy" id="q-fakebuy"></div>
                            <div class="q-result-prodinfo" id="q-result-prodinfo" style="display:none;">
                                <div class="q-result-prodname" id="q-result-prodname"></div>
                                <div class="q-result-prodprice" id="q-result-prodprice"></div>
                                <div class="q-result-installment" id="q-result-installment"></div>
                                <div class="q-scarcity" id="q-scarcity" style="display:none;"><i class="ph-bold ph-fire"></i> ¡SOLO QUEDAN <strong id="q-scarcity-n"></strong>&nbsp;UNIDADES!</div>
                            </div>
                            <div class="q-seals" id="q-seals" style="display:none;">
                                <div class="q-seal"><i class="ph-fill ph-shield-check"></i><span>Compra<br>Segura</span></div>
                                <div class="q-seal"><i class="ph-fill ph-lock-key"></i><span>Pago<br>Seguro</span></div>
                            </div>
                            <button class="q-btn-buy-now" id="q-btn-buy-now" style="display:none;">Comprar ahora</button>
                            <div id="q-related-products" style="display:none;">
                                <h4>Míralo también</h4>
                                <div class="q-related-grid" id="q-related-grid"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Erro -->
                    <div id="q-step-error">
                        <h2>ALTA DEMANDA</h2>
                        <p>Espera unos segundos e intenta de nuevo.</p>
                        <button class="q-btn-outline" id="q-error-back">Volver al producto</button>
                        <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,.08);"><p style="font-size:12px;color:var(--c-muted);margin:0 0 8px;">¿Sigue el problema? Habla directo con Provou Levou:</p><a href="https://wa.me/5511938034714?text=%C2%A1Hola!%20Tuve%20un%20problema%20al%20usar%20el%20probador." target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:7px;background:#25D366;color:#fff;border-radius:10px;padding:10px 18px;font-family:inherit;font-weight:700;font-size:13px;text-decoration:none;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 2.1.55 4.06 1.6 5.8L2 22l4.44-1.65a9.9 9.9 0 0 0 5.6 1.72h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2zm5.8 14.15c-.24.68-1.4 1.3-1.94 1.34-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.15-.19-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.77-.36l.55.01c.18.01.42-.07.66.5.24.59.83 2.04.9 2.18.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.15.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.66-.14.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.71-.17 1.39z"/></svg> Hablar con Provou Levou</a></div>
                    </div>

                </div>
                <a href="https://provoulevou.com.br?utm_source=widget&utm_medium=lojista&utm_campaign=cand" target="_blank" class="q-powered-footer">
                    <span>Powered by</span>
                    <img src="data:image/png;base64,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" class="q-quantic-logo" alt="Provou Levou">
                </a>
            </div>
        </div>
    `;


    // ─── CTA DE COMPRA NO RESULTADO ───────────────────────────────────────────────

    // Caminho do checkout da Nuvemshop. Se na loja o checkout direto não abrir,
    // troque para '/comprar/' por '/carrinho' (1 linha) — é o único ponto a validar ao vivo.
    var Q_CHECKOUT_URL = '/cart';

    function getMainPrice() {
        // 0) Shopify (tema usecand etc.): pega o preço COM DESCONTO (on-sale), não o compare-at/cheio.
        //    Sem isso, querySelector('.product__price') pegava o 1º (preço riscado) e mostrava o dobro.
        var saleEl = document.querySelector('.product__price.on-sale, .product-price.on-sale, .product-price--sale, .price-item--sale, .price__sale .price-item--sale');
        if (saleEl) {
            var st = (saleEl.textContent || '').replace(/\s+/g, ' ').trim();
            if (st && /\d/.test(st)) return st;
        }
        // 1) preço exibido na página (vários temas Nuvemshop)
        var sel = '.js-price-display, [data-product-price], .product__price .price, .product__price, .price-item--regular, .js-product-price, .price-display';
        var el = document.querySelector(sel);
        if (el) {
            var t = (el.getAttribute('data-product-price') || el.textContent || '').trim();
            if (t && /\d/.test(t)) {
                // normaliza "R$ 289,00" / "28900" -> "R$ 289,00"
                if (/^\d+$/.test(t)) { var n = (parseInt(t,10)/100).toFixed(2).replace('.',','); return 'R$ ' + n; }
                return t.replace(/\s+/g,' ');
            }
        }
        // 2) fallback: data-variants do produto principal (mesmo formato dos "Veja também")
        var dv = document.querySelector('[data-variants]');
        if (dv) {
            try { var v = JSON.parse(dv.getAttribute('data-variants'))[0]; if (v && v.price_short) return v.price_short; } catch (e) {}
        }
        return '';
    }

    function findStoreBuyBtn() {
        return document.querySelector('.js-addtocart, .btn-add-to-cart, .add-to-cart, button[name="add"], [data-component="product.add-to-cart"], button[type="submit"].js-addtocart');
    }

    // Acha o form de produto real (o que tem o input add_to_cart = product_id)
    function getProductForm() {
        var f = document.getElementById('product_form');
        if (f && f.querySelector('input[name="add_to_cart"]')) return f;
        var inp = document.querySelector('input[name="add_to_cart"]');
        if (inp && inp.closest('form')) return inp.closest('form');
        return document.querySelector('form.js-product-form, form.product-single__form, form[action*="/cart/add"]');
    }

    // Compra de verdade: submete uma CÓPIA do form do produto (POST real).
    // A Nuvemshop só adiciona ao carrinho via POST — o GET antigo abria o
    // carrinho vazio. O clone não tem o AJAX do tema, então faz POST nativo:
    // servidor adiciona o item e redireciona pro carrinho JÁ com o produto.
    function buyNow() {
        // Tracking: registra o clique em "Comprar ahora" (marca carrinho_adicionado na prova)
        try {
            var _tp = '';   // Velaro: sem telefone
            var _td = (document.querySelector('h1.product__title,.product-single__title,h1') || {}).innerText || document.title || '';
            fetch('https://n8n.segredosdodrop.com/webhook/pl-provador-buy-click', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: _tp, origin: location.origin, produto: _td }) }).catch(function () {});
        } catch (e) {}
        var src = getProductForm();
        if (src) {
            var clone = document.createElement('form');
            clone.method = 'post';
            clone.action = src.getAttribute('action') || '/comprar/';
            clone.style.display = 'none';
            src.querySelectorAll('input, select, textarea').forEach(function (el) {
                if (!el.name) return;
                if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
                var h = document.createElement('input');
                h.type = 'hidden'; h.name = el.name; h.value = el.value;
                clone.appendChild(h);
            });
            if (!clone.querySelector('[name="quantity"]')) {
                var q = document.createElement('input');
                q.type = 'hidden'; q.name = 'quantity'; q.value = '1';
                clone.appendChild(q);
            }
            document.body.appendChild(clone);
            clone.submit();
            return;
        }
        // Fallback: botão nativo da loja
        var sb = findStoreBuyBtn();
        if (sb) { try { sb.click(); } catch (e) {} }
    }

    // Escassez — número estável por produto (não muda a cada refresh)
    function scarcityCount(name) {
        var h = 5381, s = String(name || '');
        for (var i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
        var FLOOR = 8, _st = 10 + (h % 4);   // estoque inicial por produto (10..13)
            var _dn = new Date(), _df = (_dn.getHours() * 60 + _dn.getMinutes()) / 1440;
            var _q = _st - Math.floor(_df * 5);   // cai ao longo do dia
            return _q < FLOOR ? FLOOR : _q;        // piso 8
    }
    // Notificações de compra (prova social)
    var Q_FAKE_NAMES = ['Ana C.','Carlos M.','Mariana S.','João P.','Beatriz R.','Pedro A.','Juliana F.','Lucas T.','Fernanda L.','Rafael O.','Camila N.','Bruno G.','Larissa D.','Gabriel V.','Patrícia H.','Thiago B.','Aline M.','Rodrigo S.','Vanessa P.','Felipe C.','Letícia M.','Marcos A.'];
    var Q_FAKE_WHEN = ['agora mesmo','há 1 minuto','há 2 minutos','há 4 minutos','há 6 minutos','há 9 minutos','há 12 minutos'];
    var _fakeBuyTimer = null;
    function _showFakeBuy() {
        var step = document.getElementById('q-step-result');
        var el = document.getElementById('q-fakebuy');
        if (!el || !step || step.style.display === 'none') return;
        var nm = Q_FAKE_NAMES[Math.floor(Math.random() * Q_FAKE_NAMES.length)];
        var wh = Q_FAKE_WHEN[Math.floor(Math.random() * Q_FAKE_WHEN.length)];
        el.innerHTML = '<i class="ph-fill ph-shopping-bag"></i><div><span style="font-size:12.5px;color:var(--c-ink);"><strong>' + nm + '</strong> compró este producto</span><span>' + wh + ' &middot; compra verificada</span></div>';
        el.classList.add('show');
        clearTimeout(el._hideT);
        el._hideT = setTimeout(function () { el.classList.remove('show'); }, 4500);
    }
    function startFakeBuy() {
        stopFakeBuy();
        setTimeout(_showFakeBuy, 3000);
        _fakeBuyTimer = setInterval(_showFakeBuy, 12000);
    }
    function stopFakeBuy() {
        if (_fakeBuyTimer) { clearInterval(_fakeBuyTimer); _fakeBuyTimer = null; }
        var el = document.getElementById('q-fakebuy'); if (el) el.classList.remove('show');
    }

    // Parcelamento — o MESMO da pagina: pega a MAIOR parcela do produto ("em ate Nx de R$ X").
    // Le do data-variants (mesma fonte do preco). installments_data vem como STRING JSON aninhada.
    function getInstallment() {
        // Shopify (tema usecand): o tema já renderiza "Em até 10x de R$ X" no .precoParcela.
        var pp = document.querySelector('.precoParcela, .textoContSemValor');
        if (pp) {
            var pt = (pp.textContent || '').replace(/\s+/g, ' ').trim();
            if (/\dx\s*de\s*R\$/i.test(pt)) return pt;
        }
        // Nuvemshop: le do data-variants (mesma fonte do preco). installments_data = STRING JSON aninhada.
        var dv = document.querySelector('[data-variants]');
        if (!dv) return '';
        try {
            var v = JSON.parse(dv.getAttribute('data-variants'))[0];
            var idata = v.installments_data;
            if (!idata) return '';
            if (typeof idata === 'string') idata = JSON.parse(idata);
            var plans = idata[Object.keys(idata)[0]];
            if (!plans) return '';
            var best = null;
            Object.keys(plans).forEach(function (k) {
                var n = parseInt(k, 10);
                var p = plans[k];
                if (n >= 2 && p.installment_value > 0) {
                    var free = p.without_interests === true;
                    if (!best || (free && !best.free) || (free === best.free && n > best.n)) best = { n: n, val: p.installment_value, free: free };
                }
            });
            if (best) return best.n + 'x de R$ ' + Number(best.val).toFixed(2).replace('.', ',');
        } catch (e) {}
        return '';
    }

    function populateBuyCta() {
        var btn = document.getElementById('q-btn-buy-now');
        var trust = document.getElementById('q-seals');
        if (!btn) return;
        // Nome + valor do produto acima do botão
        var price = getMainPrice();
        var prodName = (document.querySelector('h1.product__title,.product-single__title,h1') || {}).innerText || document.title || '';
        var info = document.getElementById('q-result-prodinfo');
        var nameEl = document.getElementById('q-result-prodname');
        var priceEl = document.getElementById('q-result-prodprice');
        if (nameEl) nameEl.textContent = (prodName || '').trim();
        if (priceEl) priceEl.textContent = price || '';
        var instEl = document.getElementById('q-result-installment');
        if (instEl) { var _inst = getInstallment(); instEl.textContent = _inst; instEl.style.display = _inst ? 'block' : 'none'; }
        if (info && ((prodName || '').trim() || price)) info.style.display = 'block';
        // Escassez
        var sc = document.getElementById('q-scarcity');
        var scn = document.getElementById('q-scarcity-n');
        if (sc && scn && (prodName || '').trim()) { scn.textContent = scarcityCount(prodName); sc.style.display = 'flex'; }
        // Notificações de compra: desativadas em todos os provadores
        btn.style.display = 'flex';
        if (trust) trust.style.display = 'flex';
        btn.onclick = buyNow;
    }


    // ─── INIT ─────────────────────────────────────────────────────────────────────


    function init() {
        // --- FILTRO DE CATEGORIA (HAT) ---
        const productNameNormalized = (document.querySelector('h1.product__title,.product-single__title,h1')?.innerText || document.title).toUpperCase();
        if (productNameNormalized.includes('HAT')) {
            return;
        }

        // Phosphor Icons — carregado lazily na primeira abertura do modal
        // (não carrega na init para não impactar o tempo de carregamento da página)

        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = html;
        document.body.appendChild(modalContainer);

        // Usa a MESMA FONTE da loja no provador (em vez de Bebas Neue / DM Sans)
        try {
            var _bodyF = getComputedStyle(document.body).fontFamily;
            var _h = document.querySelector('h1.product__title,.product-single__title,h1,h2');
            var _headF = _h ? getComputedStyle(_h).fontFamily : _bodyF;
            var _root = document.documentElement;
            if (_bodyF) _root.style.setProperty('--font-body', _bodyF);
            if (_headF) _root.style.setProperty('--font-display', _headF);
        } catch (e) {}


        // ── Botão imagem PNG ──
        const openBtn = document.createElement('button');
        openBtn.className = 'q-btn-trigger-ia';
        openBtn.id = 'q-open-ia';
        openBtn.setAttribute('aria-label', 'Abrir Probador Virtual');
        // Selo como BACKGROUND do botão (não <img>): imune às regras do tema que escondem
        // imagens da galeria (display:none / opacity:0 do lazyload). Antes, ancorado no
        // frame da galeria, a <img> do selo herdava display:none do tema e sumia.
        openBtn.style.backgroundImage = "url('" + stampImageURL + "')";
        openBtn.style.backgroundSize = 'contain';
        openBtn.style.backgroundPosition = 'center';
        openBtn.style.backgroundRepeat = 'no-repeat';


        const imgContainers = ['.product__main-photos', '.product__photos', '.product__photo-container', '.product__photo', '.js-product-slide', '.product-image-column', '.js-swiper-product', '[data-store^="product-image-"]', '.product__media-wrapper', '.product-gallery__media', '.product__media', '.product-image-main', '.product-media-container', '[data-media-id]', '.product__media-item', '.product-gallery', '.product-single__media', '.media-gallery'];

        // Quadro FIXO da galeria (Velaro/Dawn slider): o <slider-component> nao desliza,
        // so as fotos dentro dele. Ancorar o selo AQUI o mantem no canto mesmo quando a
        // troca de cor faz o carrossel deslizar pra foto da variacao nova.
        function _stableFrame() {
            return document.querySelector('slider-component.product-media-slider, slider-component, .product-media-slider');
        }

        function tryPlaceTriggerBtn() {
            // Velaro: preferimos o quadro fixo do slider (imune a troca de variacao).
            var frame = _stableFrame();
            if (frame && frame.offsetWidth > 180) {
                if (window.getComputedStyle(frame).position === 'static') frame.style.position = 'relative';
                if (window.getComputedStyle(frame).overflow === 'hidden') frame.style.overflow = 'visible';
                frame.appendChild(openBtn);
                return true;
            }
            // Acha a imagem de PRODUTO (dentro de container de galeria, quadrada, fora de banner/hero).
            const BAD = '[class*="background-media"],[class*="banner"],[class*="hero"],[class*="newsletter"],[class*="slideshow__"],header,footer,[class*="logo"],[class*="rte"]';
            const GOOD = '.product-image-main, .image-wrap, .product__main-photos, .product__photos, .product__photo, .product__media, .product-single__media, [class*="product"][class*="photo"], [class*="product"][class*="media"], [class*="product"][class*="image"]';
            // Containers de slide ativo (carrossel): Flickity/Swiper/genérico. O selo TEM que ir no slide
            // que aparece primeiro, não no maior — senão fica preso num slide oculto e some na 1ª foto.
            const ACTIVE = '.is-selected, .is-active, .swiper-slide-active, [class*="starting-slide"], [class*="active-slide"]';
            // Container ESTÁVEL da galeria (não troca quando o usuário passa as fotos): ancoramos o selo aqui.
            const STABLE = '.flickity-viewport, .swiper-container, .swiper, .swiper-wrapper, [class*="slideshow"]';
            let best = null, bestScore = -Infinity, bestHost = null;
            for (const img of document.querySelectorAll('img')) {
                const r = img.getBoundingClientRect();
                if (r.width < 180 || r.height < 180) continue;          // ignora thumbs/ícones
                const ar = r.width / r.height;
                if (ar > 2.1 || ar < 0.45) continue;                    // descarta banners (largos/altos demais)
                const src = (img.currentSrc || img.src || '').toLowerCase();
                if (/logo|icon|sprite|payment|selo|badge|provador/.test(src)) continue;
                if (img.closest(BAD)) continue;                         // descarta banner/hero/header
                const host = img.closest(GOOD);
                if (!host) continue;                                    // só imagem dentro de container de PRODUTO
                const area = r.width * r.height;
                // pontuação: slide ATIVO domina; depois mais à ESQUERDA (1ª foto do carrossel); depois maior área.
                const inActive = img.closest(ACTIVE) ? 1 : 0;
                const score = inActive * 1e13 - r.left * 1e6 + area;
                if (score > bestScore) { bestScore = score; best = img; bestHost = host; }
            }
            if (best && bestHost) {
                // Ancora no frame ESTÁVEL da galeria se existir (carrossel), senão no container da imagem.
                const anchor = bestHost;   // canto da FOTO visivel (STABLE largo jogava o selo pra fora)
                if (window.getComputedStyle(anchor).position === 'static') anchor.style.position = 'relative';
                anchor.appendChild(openBtn);
                return true;
            }
            // Fallback (temas Dawn/Shopify novos): a foto pode nao ser um <img> grande
            // detectavel. Ancora direto no 1o container de media do produto.
            var _mc = document.querySelector('.product__media-item, .product__media-wrapper, .product__media, .product-gallery__media, [class*="product__media"], .product-single__media');
            if (_mc && _mc.offsetWidth > 180 && !_mc.querySelector('#q-open-ia')) {
                if (window.getComputedStyle(_mc).position === 'static') _mc.style.position = 'relative';
                if (window.getComputedStyle(_mc).overflow === 'hidden') _mc.style.overflow = 'visible';
                _mc.appendChild(openBtn);
                return true;
            }
            return false;
        }

        // O selo tem que PERSISTIR: ao trocar a variacao, o tema (Dawn) redesenha a
        // galeria e apaga o selo. Aqui garantimos que ele volte sempre — reancorando
        // na foto NOVA da variacao. tryPlaceTriggerBtn faz appendChild do MESMO botao,
        // entao ele so se MOVE pra galeria atual (sem duplicar).
        function _ensureSelo() {
            var b = document.getElementById('q-open-ia');
            var frame = _stableFrame();
            // Recoloca se: sumiu, ficou 0px, desconectou, OU escapou do quadro fixo
            // (ao trocar de cor o selo ficava preso numa foto que desliza pra fora da tela).
            var fora = frame && b && b.parentElement !== frame;
            if (!b || b.offsetWidth === 0 || !b.isConnected || fora) tryPlaceTriggerBtn();
        }
        _ensureSelo();
        setInterval(_ensureSelo, 700);   // recoloca no lazyload e apos troca de variacao
        // Observa a area de midia do produto: troca de cor redesenha as fotos.
        try {
            var _galRoot = document.querySelector('.product__media-list, .product__media-wrapper, .product-gallery, .product__media-gallery, .product, main') || document.body;
            new MutationObserver(function () { _ensureSelo(); }).observe(_galRoot, { childList: true, subtree: true });
        } catch (e) { }


        const modal = document.getElementById('q-modal-ia');

        // ── Botão inline acima do botão de compra ──
        const inlineBtn = document.createElement('button');
        inlineBtn.className = 'q-btn-inline-provador';
        inlineBtn.type = 'button';

        const inlineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        inlineSvg.setAttribute('viewBox', '0 0 24 24');
        inlineSvg.setAttribute('width', '18');
        inlineSvg.setAttribute('height', '18');
        inlineSvg.setAttribute('fill', 'none');
        inlineSvg.setAttribute('stroke', 'currentColor');
        inlineSvg.setAttribute('stroke-width', '1.5');
        inlineSvg.setAttribute('stroke-linecap', 'round');
        inlineSvg.setAttribute('stroke-linejoin', 'round');
        // oculos: duas lentes, ponte no meio e as hastes
        var _lenteE = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        _lenteE.setAttribute('cx', '6.5'); _lenteE.setAttribute('cy', '14'); _lenteE.setAttribute('r', '3.6');
        var _lenteD = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        _lenteD.setAttribute('cx', '17.5'); _lenteD.setAttribute('cy', '14'); _lenteD.setAttribute('r', '3.6');
        var _ponte = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        _ponte.setAttribute('d', 'M10.1 13.4c.7-.9 3.1-.9 3.8 0');
        var _hasteE = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        _hasteE.setAttribute('d', 'M2.9 13.1 1.6 9.4');
        var _hasteD = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        _hasteD.setAttribute('d', 'M21.1 13.1 22.4 9.4');
        inlineSvg.appendChild(_lenteE);
        inlineSvg.appendChild(_lenteD);
        inlineSvg.appendChild(_ponte);
        inlineSvg.appendChild(_hasteE);
        inlineSvg.appendChild(_hasteD);
        inlineBtn.appendChild(inlineSvg);

        const inlineBtnText = document.createTextNode('PRUÉBALO EN TU ROSTRO');
        inlineBtn.appendChild(inlineBtnText);

        inlineBtn.addEventListener('click', (e) => {
            window.__plBtnSrc = 'carrinho';
            e.preventDefault();
            e.stopPropagation();
            const prodName = document.querySelector('h1.product__title,.product-single__title,h1')?.innerText || document.title;
            applyProduct(detectProduct(prodName));
            populateImageSelector();
            openModal();
        });

        // Posiciona ABAIXO do botão de compra (pedido do Lucas em 31/08/2026), herdando
        // o MESMO design/tamanho do tema — mas sem contorno, pra não competir com o comprar.
        const buyBtn = document.querySelector('.js-addtocart, .btn-add-to-cart, [data-component="product.add-to-cart"], button[name="add"], .product-form__submit');
        if (buyBtn) {
            // Herda as classes do tema (MESMO TAMANHO do botão de compra).
            inlineBtn.className = (buyBtn.className ? buyBtn.className + ' ' : '') + 'q-provador-trigger';
            // Inline + !important: maior prioridade do CSS -> vence qualquer regra do tema no elemento.
            inlineBtn.style.setProperty('background', '#fff', 'important');
            inlineBtn.style.setProperty('background-color', '#fff', 'important');
            inlineBtn.style.setProperty('background-image', 'none', 'important');
            inlineBtn.style.setProperty('color', '#000', 'important');
            inlineBtn.style.setProperty('border', '1px solid #111', 'important');   // mesma cor do Agregar al carrito
            inlineBtn.style.setProperty('box-shadow', 'none', 'important');
            inlineBtn.style.setProperty('display', 'flex', 'important');
            inlineBtn.style.setProperty('align-items', 'center', 'important');
            inlineBtn.style.setProperty('justify-content', 'center', 'important');
            inlineBtn.style.setProperty('gap', '8px', 'important');
            inlineBtn.style.marginTop = '10px';   // fica ABAIXO do comprar: o respiro vai em cima
            // pseudo-elementos do tema (não dá inline) -> <style> com especificidade dobrada
            if (!document.getElementById('q-provador-btn-style')) {
                var _st = document.createElement('style');
                _st.id = 'q-provador-btn-style';
                _st.textContent = '.q-provador-trigger.q-provador-trigger::before,.q-provador-trigger.q-provador-trigger::after{background:none !important;background-color:transparent !important;background-image:none !important;box-shadow:none !important;border:0 !important;opacity:0 !important;content:none !important;}.q-provador-trigger svg{width:18px !important;height:18px !important;flex:0 0 auto;}.q-provador-trigger.q-provador-trigger{border:1px solid #111 !important;background:#fff !important;color:#111 !important;}';
                document.head.appendChild(_st);
            }
            // O buyBtn costuma estar num flex row (quantidade + comprar) -> inserir como
            // irmao dele fica AO LADO. Sobe pro container de botoes e insere depois dele,
            // pra cair numa linha propria ABAIXO. width 100% pra ocupar a linha toda.
            inlineBtn.style.setProperty('width', '100%', 'important');
            inlineBtn.style.setProperty('flex', '1 0 100%', 'important');
            var _host = buyBtn.closest('.product-form__quantity-and-btn, .product-form__buttons, product-form, form') || buyBtn.parentNode;
            _host.parentNode.insertBefore(inlineBtn, _host.nextSibling);   // linha propria, abaixo do comprar
            try {
                var _sync = function () {
                    var _bw = buyBtn.getBoundingClientRect().width;
                    if (_bw > 140) inlineBtn.style.setProperty('width', Math.round(_bw) + 'px', 'important');
                    try {
                        var _br = getComputedStyle(buyBtn).borderRadius;
                        if (_br) inlineBtn.style.setProperty('border-radius', _br, 'important');
                    } catch (e) {}
                };
                _sync(); setTimeout(_sync, 800); window.addEventListener('resize', _sync);
            } catch (e) {}
        } else {
            const variantsContainer = document.querySelector('.js-product-variants, .product-form__buttons, product-form');
            if (variantsContainer) {
                variantsContainer.parentNode.insertBefore(inlineBtn, variantsContainer.nextSibling);
            }
        }
        const genBtn      = document.getElementById('q-btn-generate');
        const nextBtn     = null; // single-step flow — no next button
        const phoneStep   = null;
        const photoStep   = document.getElementById('q-step-photo');
        const uploadStep  = photoStep; // alias for PIX/error refs

        const closeBtn    = document.getElementById('q-close-btn');
        const backBtn     = document.getElementById('q-btn-back');
        const retryBtn    = document.getElementById('q-retry-btn');
        const cameraInput = document.getElementById('q-camera-input');
        const galleryInput= document.getElementById('q-gallery-input');
        const phoneInput  = document.getElementById('q-phone');
        const preImg      = document.getElementById('q-pre-img');
        const facePlaceholder = document.getElementById('q-face-placeholder');

        // keep realInput alias so PIX code still works
        const realInput   = galleryInput;

        let userPhoto = null;
        let pixPaymentId = null;
        let selectedProductImgUrl = '';

        // Upgrade Nuvemshop CDN URLs to 1024px version
        function upgradeImgUrl(url) {
            // (1) http:// numa página https = mixed-content bloqueado; força https.
            // (2) {width} = placeholder do lazyload do Shopify (data-srcset) que às vezes vem
            //     antes do lazysizes reescrever -> a URL 404 e a prova sai SEM imagem de produto.
            //     Substitui por um tamanho real pra a imagem resolver.
            url = String(url || '').replace(/^http:\/\//i, 'https://').replace(/\{width\}/g, '1200');
            if (url.includes('mitiendanube.com') || url.includes('nuvemshop.com')) {
                return url.replace(/-\d+-\d+\.webp/, '-1024-1024.webp');
            }
            // Shopify CDN: o tema serve variantes pequenas/placeholder. Pega a foto grande:
            // tira o sufixo de tamanho (_400x400) -> master, preserva ?v= e força width=1200.
            if (url.indexOf('cdn.shopify.com') !== -1 || url.indexOf('/cdn/shop/') !== -1) {
                var parts = url.split('?');
                var base = parts[0].replace(/_(\d+)x(\d+)?(\.[a-z]{3,4})$/i, '$3');
                var vm = (parts[1] || '').match(/(?:^|&)(v=\d+)/);
                return base + '?width=1200' + (vm ? '&' + vm[1] : '');
            }
            return url;
        }

        // ─── SHOPIFY: imagem da VARIANTE (COR) selecionada ──────────────────────────
        // BUG corrigido: no Shopify a galeria carrega as fotos de TODAS as cores em ordem
        // fixa no DOM, então pegar imgs[1]/face-detect mandava SEMPRE a 1ª cor, mesmo
        // quando o cliente trocava a variante. Aqui lemos a variante realmente selecionada
        // (?variant= na URL / [name="id"]) e usamos o featured_image DELA via o endpoint
        // /products/{handle}.js (cacheado). Se falhar, cai no comportamento antigo.
        var _plProductJsonCache = null;
        function _plSelectedVariantId() {
            try { var u = new URLSearchParams(location.search).get('variant'); if (u) return u; } catch (e) {}
            var el = document.querySelector('form[action*="/cart/add"] [name="id"]:checked')
                  || document.querySelector('form[action*="/cart/add"] select[name="id"]')
                  || document.querySelector('[name="id"]:checked')
                  || document.querySelector('select[name="id"]')
                  || document.querySelector('form[action*="/cart/add"] [name="id"]')
                  || document.querySelector('[name="id"]');
            return (el && el.value) ? el.value : '';
        }
        async function selectedVariantImgUrl() {
            try {
                var vid = _plSelectedVariantId();
                if (!vid) return '';
                if (!_plProductJsonCache) {
                    var path = location.pathname.split('?')[0].replace(/\/$/, '');
                    var res = await fetch(path + '.js', { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' });
                    if (res.ok) _plProductJsonCache = await res.json();
                }
                var prod = _plProductJsonCache;
                if (!prod || !prod.variants) return '';
                var v = prod.variants.filter(function (x) { return String(x.id) === String(vid); })[0];
                var src = v && v.featured_image && v.featured_image.src;
                if (!src) return '';
                if (src.indexOf('//') === 0) src = 'https:' + src;
                return upgradeImgUrl(String(src).replace(/^http:\/\//i, 'https://'));
            } catch (e) { return ''; }
        }

        // Temas Shopify põem a foto real no srcset (o src é placeholder/lazy-load). Pega a maior.
        function largestSrc(img) {
            var ss = img.getAttribute('srcset') || img.getAttribute('data-srcset') || '';
            if (!ss) return '';
            var best = '', bestW = -1;
            ss.split(',').forEach(function (p) {
                var seg = p.trim().split(/\s+/);
                var u = seg[0], w = parseInt((seg[1] || '').replace(/\D/g, '')) || 0;
                if (u && w >= bestW) { bestW = w; best = u; }
            });
            return best;
        }

        function extractImages() {
            const containersSelectors = '.product__main-photos, .product__photos, .js-product-slide, .product-image-column, .js-swiper-product, [data-store^="product-image-"], .product__media-wrapper, .product-gallery__media, .product__media, .product-image-main, .product-media-container, [data-media-id], .product__media-item, .product-gallery, .product-single__media, .media-gallery, [data-component="product.gallery"], .swiper-slide:not(.swiper-slide-duplicate), .slider-wrapper';
            const possibleContainers = Array.from(document.querySelectorAll(containersSelectors));
            let imgEls = [];
            possibleContainers.forEach(c => {
                if (!c.closest('#q-modal-ia')) {
                    const foundImgs = c.querySelectorAll('img');
                    imgEls.push(...Array.from(foundImgs));
                }
            });
            let uniqueImgs = [];
            imgEls.forEach(img => {
                let src = largestSrc(img) || img.dataset?.src || img.getAttribute('data-src') || img.src;

                if (src && src.includes('data:image')) {
                    // NÃO cair pro href da <a> às cegas: em muitos temas o link é a PÁGINA
                    // do produto (HTML), não a foto — isso ia pro gerador como "image/jpeg",
                    // o Gemini rejeitava com 400 "Unable to process input image" e a prova
                    // virava "ALTA DEMANDA". Só aceita o href se ele for mesmo uma imagem.
                    const parentA = img.closest('a');
                    const ah = (parentA && parentA.href && !parentA.href.includes('javascript:')) ? parentA.href : '';
                    if (ah && /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(ah)) {
                        src = ah;
                    } else if (img.getAttribute('data-srcset')) {
                        src = img.getAttribute('data-srcset').split(',')[0].trim().split(' ')[0];
                    }
                }

                if (!src || src.includes('data:image')) return;

                const lowerSrc = src.toLowerCase();
                const invalidKeywords = ['provador', 'logo', 'provoulevou', 'icon', 'play', 'video', 'transparent', 'placeholder', 'blank', 'spacer'];
                if (invalidKeywords.some(kw => lowerSrc.includes(kw))) return;

                // Filter out tiny images (1x1 pixels, spacers, etc.)
                if (img.naturalWidth > 0 && img.naturalWidth < 50) return;
                if (img.naturalHeight > 0 && img.naturalHeight < 50) return;

                let cleanSrc = src.split('?')[0].replace(/-\d+-\d+\.webp|_\d+x\d+/, '');

                // Upgrade to 1024px version
                src = upgradeImgUrl(src);

                if (!uniqueImgs.some(u => u.split('?')[0].replace(/-\d+-\d+\.webp|_\d+x\d+/, '') === cleanSrc)) {
                    uniqueImgs.push(src);
                }
            });
            if (uniqueImgs.length === 0) {
                const og = document.querySelector('meta[property="og:image"]')?.content;
                if (og) uniqueImgs.push(upgradeImgUrl(og));
            }
            return uniqueImgs.slice(0, 4);
        }

        function populateImageSelector() {
            const imgs = extractImages();
            const group = document.getElementById('q-photo-selector-group');
            if (group) group.style.display = 'none';
            // Cand: a foto principal de referência é a 2ª da página (a 1ª costuma ser
            // banner/lifestyle, não o óculos limpo). Fallback pra 1ª se só houver uma.
            // OBS: isso é só o DEFAULT — a detecção de rosto (startFaceDetect) sobrescreve
            // selectedProductImgUrl pela foto do óculos NO ROSTO quando encontra uma.
            selectedProductImgUrl = imgs[1] || imgs[0] || '';
        }

        // ── Detecção de rosto ──────────────────────────────────────────────
        // O óculos no rosto de uma modelo é a melhor referência, mas vem em posição
        // variável (2ª, 3ª...). Aqui varremos as primeiras fotos da galeria do produto
        // e escolhemos a 1ª que tem rosto como foto PRINCIPAL. Roda no navegador:
        // FaceDetector nativo (Chromium) e, se não houver, MediaPipe via CDN (cross-browser).
        // Se nada detectar (ou o detector falhar), mantém o default acima — sem regressão.
        var faceDetectPromise = null, _faceUrl = null;
        var _faceDet = null, _faceDetTried = false;
        async function getFaceDetector() {
            if (_faceDetTried) return _faceDet;
            _faceDetTried = true;
            try {
                if ('FaceDetector' in window) { _faceDet = { native: new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 }) }; return _faceDet; }
            } catch (e) {}
            try {
                // Servido do nosso Pages: na Menina Flor o jsdelivr caiu fora da CSP e a
                // deteccao morria em silencio por meses. Aqui a CSP nao bloqueia, mas nao ha
                // motivo pra depender de terceiro.
                var _MP = 'https://lucasdecamargosilva.github.io/fbitsmeninaflor/mediapipe';
                var vision = await import(_MP + '/vision_bundle.mjs');
                var fileset = await vision.FilesetResolver.forVisionTasks(_MP + '/wasm');
                var det = await vision.FaceDetector.createFromOptions(fileset, {
                    baseOptions: { modelAssetPath: _MP + '/blaze_face_short_range.tflite' },
                    runningMode: 'IMAGE'
                });
                _faceDet = { mp: det };
            } catch (e) { _faceDet = null; }
            return _faceDet;
        }
        function _loadCorsImg(url) {
            return new Promise(function (resolve) {
                var img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function () { resolve(img); };
                img.onerror = function () { resolve(null); };
                img.src = url;
            });
        }
        async function _imgHasFace(det, img) {
            try {
                if (det.native) { var f = await det.native.detect(img); return !!(f && f.length); }
                if (det.mp) { var r = det.mp.detect(img); return !!(r && r.detections && r.detections.length); }
            } catch (e) {}
            return false;
        }
        // Fotos SÓ da galeria principal do produto (não "Veja também"), em ordem, capadas.
        function productGalleryUrls(limit) {
            var main = document.querySelector('.product__main-photos, .product-slideshow, .product-image-main, .product__photos');
            var urls = [], seen = {};
            if (main) {
                [].slice.call(main.querySelectorAll('img')).forEach(function (im) {
                    var src = largestSrc(im) || im.getAttribute('data-src') || im.src || '';
                    if (!src || src.indexOf('data:image') !== -1) return;
                    var low = src.toLowerCase();
                    if (/logo|icon|sprite|provador|placeholder|spacer/.test(low)) return;
                    var key = src.split('?')[0].replace(/_(\d+)x(\d+)?\./, '.');
                    if (seen[key]) return; seen[key] = 1;
                    urls.push(upgradeImgUrl(src));
                });
            }
            return urls.slice(0, limit || 8);
        }
        async function detectFacePhoto(urls) {
            if (!urls || !urls.length) return null;
            var det = await getFaceDetector();
            if (!det) return null;
            var comRosto = [];
            for (var i = 0; i < urls.length; i++) {
                var img = await _loadCorsImg(urls[i]);
                if (!img) continue;
                if (await _imgHasFace(det, img)) comRosto.push(urls[i]);
            }
            if (!comRosto.length) return null;
            // A galeria costuma ter foto de rosto de MAIS DE UMA cor (ex.: San Marino tem
            // "Preto_055" e "Cinza_leopardo_123"). Pegar a 1a mandaria a cor errada quando o
            // cliente escolhe outra variante — por isso casamos pelo nome da cor selecionada.
            try {
                var cor = _plCorSelecionada();
                if (cor) {
                    for (var j = 0; j < comRosto.length; j++) {
                        if (_plNorm(comRosto[j]).indexOf(cor) !== -1) return comRosto[j];
                    }
                }
            } catch (e) {}
            return comRosto[0];
        }
        // Nome da cor escolhida, normalizado (sem acento, minusculo, _ no lugar de espaco),
        // pra casar com o nome do arquivo da foto ("Cinza_leopardo_123.png").
        function _plNorm(t) {
            return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
                .toLowerCase().replace(/[^a-z0-9]+/g, '_');
        }
        function _plCorSelecionada() {
            try {
                var vid = _plSelectedVariantId();
                var prod = _plProductJsonCache;
                if (vid && prod && prod.variants) {
                    var v = prod.variants.filter(function (x) { return String(x.id) === String(vid); })[0];
                    if (v) {
                        var vals = (v.options && v.options.length) ? v.options : String(v.title || '').split(' / ');
                        for (var i = 0; i < vals.length; i++) {
                            var c = _plNorm(vals[i]);
                            if (c && c !== 'default_title') return c;
                        }
                    }
                }
            } catch (e) {}
            return '';
        }
        function startFaceDetect() {
            if (faceDetectPromise) return faceDetectPromise;
            faceDetectPromise = detectFacePhoto(productGalleryUrls(8)).then(function (u) {
                if (u) { _faceUrl = u; selectedProductImgUrl = u; try { console.log('[PL Cand] foto no rosto detectada como principal'); } catch (e) {} }
                return u;
            }).catch(function () { return null; });
            return faceDetectPromise;
        }

        function openModal() {
            // Lazy-load Phosphor Icons na primeira abertura
            if (!window.phosphorIconsLoaded) {
                var ph = document.createElement('script');
                ph.src = 'https://unpkg.com/@phosphor-icons/web';
                document.head.appendChild(ph);
                window.phosphorIconsLoaded = true;
            }
            modal.style.display = 'flex';
            lockBodyScroll();
            // Dispara a detecção de rosto em background — termina enquanto o cliente
            // digita telefone e tira a foto, então o gerar já tem a foto certa.
            try { startFaceDetect(); } catch (e) {}
            // Mostra contador imediatamente (só por IP) ao abrir o modal
            if (typeof _checkProvasRestantes === 'function') _checkProvasRestantes();
            try { pixResume(); } catch (e) {}
        }


        function closeModal() {
            modal.style.display = 'none';
            unlockBodyScroll();
            try { stopFakeBuy(); } catch (e) {}
        
            // --- volta pra tela inicial ao fechar (pos-prova) + limpa input p/ 2a foto enviar ---
            try {
                var _qsr = document.getElementById('q-step-result'); if (_qsr) _qsr.style.display = 'none';
                var _qsp = (typeof photoStep !== 'undefined' && photoStep) ? photoStep : document.getElementById('q-step-photo');
                if (_qsp) _qsp.style.display = 'flex';
                var _qcard = document.querySelector('.q-card-ia'); if (_qcard) _qcard.classList.remove('is-result');
                if (typeof userPhoto !== 'undefined') userPhoto = null;
                if (typeof pixPaymentId !== 'undefined') pixPaymentId = null;
                if (typeof preImg !== 'undefined' && preImg) preImg.style.display = 'none';
                if (typeof facePlaceholder !== 'undefined' && facePlaceholder) facePlaceholder.style.display = 'flex';
                try { if (typeof cameraInput !== 'undefined' && cameraInput) cameraInput.value = ''; if (typeof galleryInput !== 'undefined' && galleryInput) galleryInput.value = ''; } catch (e) {}
                if (typeof checkFields === 'function') checkFields();
            } catch (e) {}
        }

        /* ── Fechar sem perder a foto ──────────────────────────────────────
           Fechar o provador depois de provar resetava tudo e a foto gerada
           sumia. Agora o resultado fica guardado: ao reabrir pelo selo ou
           pelo botao, o cliente volta direto na foto dele.
           Como a tela de resultado nao tinha saida (o #q-retry-btn e lido no
           JS mas nunca existiu no HTML), adicionamos "Probar otra foto" --
           sem isso o cliente ficaria preso no resultado. */
        function _plTemResultado() {
            var i = document.getElementById('q-final-view-img');
            return !!(i && i.getAttribute('src'));
        }

        function _plNovaProva() {
            var img = document.getElementById('q-final-view-img');
            if (img) img.removeAttribute('src');
            var s = document.getElementById('q-step-result');
            if (s) s.style.display = 'none';
            var p = document.getElementById('q-step-photo');
            if (p) p.style.display = 'flex';
            var c = document.querySelector('.q-card-ia');
            if (c) c.classList.remove('is-result');
            try { if (typeof userPhoto !== 'undefined') userPhoto = null; } catch (e) {}
            try { if (typeof pixPaymentId !== 'undefined') pixPaymentId = null; } catch (e) {}
            try { if (typeof preImg !== 'undefined' && preImg) preImg.style.display = 'none'; } catch (e) {}
            try { if (typeof facePlaceholder !== 'undefined' && facePlaceholder) facePlaceholder.style.display = 'flex'; } catch (e) {}
            try { if (typeof cameraInput !== 'undefined' && cameraInput) cameraInput.value = ''; } catch (e) {}
            try { if (typeof galleryInput !== 'undefined' && galleryInput) galleryInput.value = ''; } catch (e) {}
            try { if (typeof checkFields === 'function') checkFields(); } catch (e) {}
        }

        function _plMontaBotaoNovaProva() {
            var col = document.getElementById('q-result-actions-col');
            if (!col || document.getElementById('q-btn-nova-prova')) return;
            var b = document.createElement('button');
            b.type = 'button';
            b.id = 'q-btn-nova-prova';
            b.className = 'q-btn-outline';
            b.textContent = 'Probar otra foto';
            b.style.marginTop = '10px';
            b.onclick = _plNovaProva;
            col.appendChild(b);
        }

        var _plCloseOriginal = closeModal;
        closeModal = function () {
            if (_plTemResultado()) {
                try { modal.style.display = 'none'; } catch (e) {}
                try { unlockBodyScroll(); } catch (e) {}
                try { stopFakeBuy(); } catch (e) {}
                return;
            }
            return _plCloseOriginal.apply(this, arguments);
        };

        var _plOpenOriginal = openModal;
        openModal = function () {
            var _r = _plOpenOriginal.apply(this, arguments);
            try {
                _plMontaBotaoNovaProva();
                if (_plTemResultado()) {
                    ['q-step-photo', 'q-loading-box', 'q-step-error'].forEach(function (id) {
                        var el = document.getElementById(id);
                        if (el) el.style.display = 'none';
                    });
                    var s = document.getElementById('q-step-result');
                    if (s) s.style.display = 'flex';
                    var c = document.querySelector('.q-card-ia');
                    if (c) c.classList.add('is-result');
                }
            } catch (e) {}
            return _r;
        };



        function applyProduct(product) {
            currentProduct = product;
        }


        openBtn.onclick = (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            const prodName = document.querySelector('h1.product__title,.product-single__title,h1')?.innerText || document.title;
            applyProduct(detectProduct(prodName));
            populateImageSelector();
            openModal();
        };


        closeBtn.onclick = () => closeModal();
        if (backBtn) backBtn.onclick = () => closeModal();


        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });


        if (retryBtn) retryBtn.onclick = () => {
            try { if (typeof cameraInput !== 'undefined' && cameraInput) cameraInput.value = ''; if (typeof galleryInput !== 'undefined' && galleryInput) galleryInput.value = ''; } catch (e) {}
            document.getElementById('q-step-result').style.display = 'none';
            photoStep.style.display = 'flex';
            document.querySelector('.q-card-ia').classList.remove('is-result');
            userPhoto = null;
            pixPaymentId = null;
            preImg.style.display = 'none';
            if (facePlaceholder) facePlaceholder.style.display = 'flex';
            checkFields();
        };

        // Camera / gallery buttons
        document.getElementById('q-btn-gallery').onclick = function() { galleryInput.click(); };
        document.getElementById('q-face-frame').onclick = function() { galleryInput.click(); };

        // ── Câmera ao vivo (getUserMedia) — abre a câmera de verdade dentro do provador.
        //    Fallback p/ <input capture> só quando getUserMedia não existe / é negado
        //    (ex.: contexto inseguro ou webview que bloqueia a câmera). ──
        let camStream = null, camFacing = 'user', camOverlay = null;
        function buildCamOverlay() {
            if (camOverlay) return camOverlay;
            camOverlay = document.createElement('div');
            camOverlay.className = 'q-cam-overlay';
            camOverlay.innerHTML =
                '<video class="q-cam-video" autoplay playsinline muted></video>' +
                '<button class="q-cam-mini q-cam-close" type="button" aria-label="Fechar">&#10005;</button>' +
                '<div class="q-cam-controls">' +
                  '<button class="q-cam-mini q-cam-flip" type="button" aria-label="Virar câmera">&#8635;</button>' +
                  '<button class="q-cam-shutter" type="button" aria-label="Tomar foto"></button>' +
                  '<span style="width:46px"></span>' +
                '</div>';
            document.body.appendChild(camOverlay);
            camOverlay.querySelector('.q-cam-close').onclick = closeLiveCamera;
            camOverlay.querySelector('.q-cam-flip').onclick = flipCamera;
            camOverlay.querySelector('.q-cam-shutter').onclick = snapPhoto;
            return camOverlay;
        }
        async function startStream() {
            const v = camOverlay.querySelector('.q-cam-video');
            if (camStream) camStream.getTracks().forEach(t => t.stop());
            camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: camFacing }, audio: false });
            v.srcObject = camStream;
            camOverlay.classList.toggle('is-front', camFacing === 'user');
        }
        async function openLiveCamera() {
            if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || !window.isSecureContext) {
                cameraInput.click(); return;
            }
            buildCamOverlay();
            camOverlay.classList.add('is-open');
            try { await startStream(); }
            catch (e) { closeLiveCamera(); cameraInput.click(); }
        }
        function closeLiveCamera() {
            if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; }
            if (camOverlay) camOverlay.classList.remove('is-open');
        }
        async function flipCamera() {
            const prev = camFacing;
            camFacing = camFacing === 'user' ? 'environment' : 'user';
            try { await startStream(); } catch (e) { camFacing = prev; try { await startStream(); } catch (_) {} }
        }
        function snapPhoto() {
            const v = camOverlay.querySelector('.q-cam-video');
            if (!v || !v.videoWidth) return;
            const c = document.createElement('canvas');
            c.width = v.videoWidth; c.height = v.videoHeight;
            // captura SEM espelhar (imagem fiel p/ a IA), mesmo com preview espelhado
            c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
            c.toBlob(function(blob) {
                const file = new File([blob], 'foto.jpg', { type: 'image/jpeg' });
                closeLiveCamera();
                handlePhotoSelected(file);
            }, 'image/jpeg', 0.95);
        }
        document.getElementById('q-btn-camera').onclick = openLiveCamera;

        function loadRelatedProducts() {
            var grid = document.getElementById('q-related-grid');
            var section = document.getElementById('q-related-products');
            if (!grid || !section) return;

            var items = document.querySelectorAll('.js-swiper-related .js-item-product');
            if (!items.length) items = document.querySelectorAll('.js-item-product');
            var products = [];

            items.forEach(function(item) {
                if (products.length >= 3) return;
                var container = item.querySelector('[data-variants]');
                if (!container) return;
                try {
                    var variants = JSON.parse(container.getAttribute('data-variants'));
                    if (!variants || !variants.length) return;
                    var v = variants[0];
                    var imgRaw = v.image_url || '';
                    var img = imgRaw ? 'https:' + imgRaw.replace(/\\/g, '').replace('-1024-1024.webp', '-480-0.webp') : '';
                    var price = v.price_short || '';
                    // Name from img alt (Nuvemshop sets it reliably)
                    var imgEl = item.querySelector('img[alt]');
                    var name = imgEl ? imgEl.getAttribute('alt').trim() : '';
                    // Link from any anchor pointing to /produtos/
                    var linkEl = item.querySelector('a[href*="/produtos/"]');
                    var link = linkEl ? linkEl.getAttribute('href') : '';
                    if (img && (name || price)) {
                        products.push({ name: name, img: img, price: price, link: link });
                    }
                } catch(e) {}
            });

            if (!products.length) return;

            while (grid.firstChild) grid.removeChild(grid.firstChild);
            products.forEach(function(p) {
                var a = document.createElement('a');
                a.className = 'q-related-card';
                a.href = p.link || '#';
                a.target = '_blank';
                var img = document.createElement('img');
                img.src = p.img;
                img.alt = p.name;
                img.loading = 'lazy';
                var nameEl = document.createElement('span');
                nameEl.className = 'q-related-card-name';
                nameEl.textContent = p.name;
                a.appendChild(img);
                a.appendChild(nameEl);
                grid.appendChild(a);
            });
            section.style.display = 'block';
        }

        // ── Barra de progresso simulada (não há evento real de progresso do backend).
        // Desacelera perto de 92% e se auto-encerra sozinha quando a tela de loading
        // for escondida (sucesso, erro ou limite) — não precisa de hook em cada saída. ──
        var _qProgressTimer = null;
        function startLoadingProgress() {
            if (_qProgressTimer) { clearInterval(_qProgressTimer); _qProgressTimer = null; }
            var lb = document.getElementById('q-loading-box');
            var bar = lb ? lb.querySelector('.q-loading-bar > div') : null;
            if (!lb || !bar) return;
            bar.style.transition = 'none';
            bar.style.transform = 'scaleX(0)';
            void bar.offsetWidth;
            bar.style.transition = 'transform 0.3s ease-out';
            var progress = 0;
            _qProgressTimer = setInterval(function () {
                if (lb.style.display !== 'flex') { clearInterval(_qProgressTimer); _qProgressTimer = null; return; }
                var remaining = 92 - progress;
                progress += Math.max(remaining * 0.06, 0.15);
                if (progress > 92) progress = 92;
                bar.style.transform = 'scaleX(' + (progress / 100) + ')';
            }, 200);
        }

        function showError() {
            var lb = document.getElementById('q-loading-box');
            var su = photoStep;
            var se = document.getElementById('q-step-error');
            if (lb) lb.style.display = 'none';
            if (su) su.style.display = 'none';
            if (se) se.style.display = 'flex';
        }
        var _eb = document.getElementById('q-error-back'); if (_eb) _eb.onclick = function() { closeModal(); };



        phoneInput.addEventListener('input', function () {
            checkPhoneStep();   // Velaro: campo e-mail, sem mascara de telefone
        });
        // ── Contador de provas restantes (debounced) ──
        let _provasDebounce;
        async function _checkProvasRestantes() {
            const _els = document.querySelectorAll('.q-provas-msg');
            if (!_els.length) return;
            const phone = '0';   // Velaro: limite por IP (sem telefone)
            try {
                const r = await fetch(WEBHOOK_CHECK_LIMIT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone })
                });
                const d = await r.json();
                const used = Math.max(d.phone_count || 0, d.ip_count || 0, d.count || 0);
                const restantes = Math.max(0, 3 - used);
                if (restantes > 0) {
                    const _txt = restantes + (restantes === 1 ? ' prueba restante hoy' : ' pruebas restantes hoy');
                    _els.forEach(el => { el.textContent = _txt; el.classList.remove('is-warn'); });
                } else {
                    _els.forEach(el => { el.textContent = ''; el.classList.remove('is-warn'); });   // limite: não avisa na tela inicial; o PIX aparece só ao enviar a foto
                }
            } catch(_) { _els.forEach(el => { el.textContent = ''; el.classList.remove('is-warn'); }); }
        }
        phoneInput.addEventListener('input', () => {
            clearTimeout(_provasDebounce);
            _provasDebounce = setTimeout(_checkProvasRestantes, 600);
        });



        function flashError(targetEl, hintMsg) {
            var hint = document.getElementById('q-validation-hint');
            if (hint) {
                hint.textContent = '\u26A0\uFE0F ' + hintMsg;
                hint.classList.add('is-visible');
            }
            if (targetEl) {
                targetEl.classList.add('is-error', 'q-shake');
                setTimeout(function(){ targetEl.classList.remove('q-shake'); }, 600);
                try { targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
                if (targetEl.focus) setTimeout(function(){ targetEl.focus(); }, 350);
            }
        }
        function checkPhoneStep() {
            const nums = phoneInput.value.replace(/\D/g, '');
            const phoneOk = isValidBRPhone(nums);
            document.getElementById('q-phone-error').style.display = (phoneInput.value.length > 0 && !phoneOk) ? 'block' : 'none';
            phoneInput.style.borderColor = (phoneInput.value.length > 0 && !phoneOk) ? '#ef4444' : 'var(--q-border)';
            checkFields();
        }

        function checkFields() {
            const nums = phoneInput.value.replace(/\D/g, '');
            const phoneOk = isValidBRPhone(nums);
            /* aggressive validation: botão sempre clicável */
        }

        document.getElementById('q-accept-terms').onchange = checkFields;

        function handlePhotoSelected(file) {
            if (!file) return;
            userPhoto = file;
            const rd = new FileReader();
            rd.onload = ev => {
                preImg.src = ev.target.result;
                preImg.style.display = 'block';
                if (facePlaceholder) facePlaceholder.style.display = 'none';
                checkFields();
            };
            rd.readAsDataURL(file);
        }

        cameraInput.onchange  = (e) => handlePhotoSelected(e.target.files[0]);
        galleryInput.onchange = (e) => handlePhotoSelected(e.target.files[0]);


        function resizeImage(fileOrBlob, maxSize) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    let w = img.width, h = img.height;
                    if (w <= maxSize && h <= maxSize) { resolve(fileOrBlob); return; }
                    if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
                    else { w = Math.round(w * maxSize / h); h = maxSize; }
                    const c = document.createElement('canvas');
                    c.width = w; c.height = h;
                    c.getContext('2d').drawImage(img, 0, 0, w, h);
                    c.toBlob(b => resolve(b), 'image/jpeg', 0.95);
                };
                const url = URL.createObjectURL(fileOrBlob instanceof Blob ? fileOrBlob : new Blob([fileOrBlob]));
                img.src = url;
            });
        }

        // ── PIX: polling e controle ──
        let pixPollingTimer = null;

        function stopPixPolling() {
            if (pixPollingTimer) { clearInterval(pixPollingTimer); pixPollingTimer = null; }
        }

        // ── Recuperacao do pagamento ──────────────────────────────────────────
        // O PIX e pago NO APP DO BANCO: a aba do provador vai pra segundo plano
        // e o celular suspende o setInterval. Antes, se o cliente nao voltasse
        // pro modal ainda aberto, a prova paga nunca aparecia. Agora reconferimos
        // sempre que ele volta pra aba ou reabre o provador.
        let pixWatchId = null;

        function pixUnlock(payment_id, phone) {
            stopPixPolling();
            pixWatchId = null;
            try { if (phone) _pixClearPending(phone); } catch (_) {}
            pixPaymentId = payment_id;
            var _msg = document.getElementById('q-pix-status-msg');
            if (_msg) {
                _msg.textContent = '¡Pago confirmado!';
                _msg.className = 'q-pix-status q-pix-approved';
            }
            setTimeout(function () {
                hidePixScreen();
                // Se a pagina recarregou, perdemos a foto da memoria. O credito
                // continua valendo no servidor, entao pedimos a foto de novo em
                // vez de deixar a tela muda (era isso que o cliente via).
                if (!userPhoto) {
                    try {
                        photoStep.style.display = 'flex';
                        var h = document.getElementById('q-validation-hint');
                        if (h) {
                            h.textContent = '\u2705 ¡Pago confirmado! Sube tu foto para gerar a prova.';
                            h.classList.add('is-visible');
                        }
                    } catch (_) {}
                    return;
                }
                runGeneration();
            }, 1200);
        }

        async function pixCheck(payment_id, phone) {
            try {
                const sr = await fetch(WEBHOOK_PIX_STATUS + '?payment_id=' + payment_id);
                const st = await sr.json();
                if (st && st.status === 'approved') { pixUnlock(payment_id, phone); return true; }
            } catch (_) {}
            return false;
        }

        async function pixResume() {
            let id = pixWatchId, ph = null;
            if (!id) {
                try {
                    const raw = localStorage.getItem(_PIX_LS_KEY);
                    const arr = raw ? JSON.parse(raw) : [];
                    const now = Date.now();
                    const p = arr.filter(function (x) { return (now - x.ts) < _PIX_TTL_MS; })[0];
                    if (p) { id = p.payment_id; ph = p.phone; }
                } catch (_) {}
            }
            if (id) await pixCheck(id, ph);
        }

        // Volta do app do banco -> reconfere na hora.
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') pixResume();
        });
        window.addEventListener('focus', function () { pixResume(); });

        function showPixScreen() {
            uploadStep.style.display = 'none';
            document.getElementById('q-step-pix').style.display = 'block';
            document.getElementById('q-pix-status-msg').textContent = 'Esperando el pago...';
            document.getElementById('q-pix-status-msg').className = 'q-pix-status q-pix-waiting';
        }

        function hidePixScreen() {
            stopPixPolling();
            document.getElementById('q-step-pix').style.display = 'none';
        }

        // ── Reaproveitamento de PIX pendente ──
        // Evita criar um novo QR a cada abertura do modal: se há PIX pendente do
        // mesmo telefone gerado há menos de 25min, reaproveita e continua polando.
        const _PIX_LS_KEY = 'pl_pix_pending_v1';
        const _PIX_TTL_MS = 25 * 60 * 1000; // 25 min (PIX MP expira em 30min)
        function _pixLoadPending(phone) {
            try {
                const raw = localStorage.getItem(_PIX_LS_KEY);
                if (!raw) return null;
                const arr = JSON.parse(raw);
                const now = Date.now();
                const valid = arr.filter(p => p.phone === phone && (now - p.ts) < _PIX_TTL_MS);
                return valid[0] || null;
            } catch(_) { return null; }
        }
        function _pixSavePending(phone, payment_id, qr_code, qr_code_base64) {
            try {
                const raw = localStorage.getItem(_PIX_LS_KEY);
                let arr = [];
                try { arr = raw ? JSON.parse(raw) : []; } catch(_) {}
                // Limpa expirados
                const now = Date.now();
                arr = arr.filter(p => (now - p.ts) < _PIX_TTL_MS && p.phone !== phone);
                arr.push({ phone, payment_id, qr_code, qr_code_base64, ts: now });
                localStorage.setItem(_PIX_LS_KEY, JSON.stringify(arr));
            } catch(_) {}
        }
        function _pixClearPending(phone) {
            try {
                const raw = localStorage.getItem(_PIX_LS_KEY);
                if (!raw) return;
                let arr = JSON.parse(raw);
                arr = arr.filter(p => p.phone !== phone);
                localStorage.setItem(_PIX_LS_KEY, JSON.stringify(arr));
            } catch(_) {}
        }

        async function createPixAndPoll(_isRetry) {
            showPixScreen();
            const phone = '55' + phoneInput.value.replace(/\D/g, '');
            try {
                let pix;
                // Numa retry, ignora o pendente (foi ele que deu QR quebrado).
                const pending = _isRetry ? null : _pixLoadPending(phone);
                // Só reaproveita pendente COMPLETO (com QR base64). Pendente parcial
                // (base64 vazio) geraria 'data:image/png;base64,undefined' = QR quebrado.
                if (pending && pending.qr_code_base64) {
                    // Reaproveita PIX pendente
                    pix = { payment_id: pending.payment_id, qr_code: pending.qr_code, qr_code_base64: pending.qr_code_base64 };
                } else {
                    if (pending) _pixClearPending(phone); // limpa o pendente quebrado
                    const resp = await fetch(WEBHOOK_PIX, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: 'cliente@provoulevou.com.br', phone, loja: 'cand', origin: location.origin })
                    });
                    pix = await resp.json();
                    // Exige o base64 também — sem ele o QR não renderiza.
                    if (!pix.payment_id || !pix.qr_code || !pix.qr_code_base64) throw new Error('PIX inválido');
                    _pixSavePending(phone, pix.payment_id, pix.qr_code, pix.qr_code_base64);
                }

                const _qrImg = document.getElementById('q-pix-qr-img');
                // Auto-recuperação: se o QR não carregar, limpa e refaz UMA vez.
                _qrImg.onerror = function () {
                    _qrImg.onerror = null;
                    if (!_isRetry) { _pixClearPending(phone); stopPixPolling(); createPixAndPoll(true); }
                };
                _qrImg.src = 'data:image/png;base64,' + pix.qr_code_base64;
                document.getElementById('q-pix-code').value = pix.qr_code;

                // Polling a cada 3s ate o PIX expirar (30min), nao mais 5min.
                // O reforco de verdade e o pixResume() no visibilitychange.
                pixWatchId = pix.payment_id;
                let attempts = 0;
                pixPollingTimer = setInterval(function () {
                    attempts++;
                    if (attempts > 600) { stopPixPolling(); return; }
                    pixCheck(pix.payment_id, phone);
                }, 3000);
            } catch (e) {
                hidePixScreen();
                uploadStep.style.display = 'block';
                showError();
            }
        }

        // Botão copiar PIX
        document.getElementById('q-pix-copy-btn').onclick = () => {
            const code = document.getElementById('q-pix-code').value;
            navigator.clipboard.writeText(code).then(() => {
                document.getElementById('q-pix-copy-btn').textContent = '¡Copiado!';
                setTimeout(() => { document.getElementById('q-pix-copy-btn').textContent = 'Copiar'; }, 2000);
            });
        };

        // Botão cancelar PIX
        document.getElementById('q-pix-cancel').onclick = () => {
            hidePixScreen();
            uploadStep.style.display = 'block';
        };

        // ── GERAÇÃO PRINCIPAL ──
        async function runGeneration() {

            if (runGeneration._busy) return;

            runGeneration._busy = true;

            try {
                const keyToUse = window.PROVOU_LEVOU_API_KEY;
                if (!keyToUse || keyToUse.includes("COLOQUE_A_CHAVE_AQUI")) {
                    showError();
                    return;
                }

                // Aguarda a detecção de rosto (se ainda rodando) p/ garantir que a foto
                // do óculos NO ROSTO seja a principal. Timeout 4s -> usa o default se demorar.
                try {
                    if (faceDetectPromise) {
                        await Promise.race([faceDetectPromise, new Promise(function (r) { setTimeout(r, 4000); })]);
                    }
                } catch (e) {}

                // Prioridade: imagem da COR selecionada (corrige "vai a cor errada").
                let variantImg = '';
                try { variantImg = await selectedVariantImgUrl(); } catch (e) {}
                // ORDEM (corrigido 02/09/2026): a COR SELECIONADA manda. O packshot da
                // variante e' a referencia principal (cor certa). Antes a foto no rosto vinha
                // primeiro, mas como ela e' de UMA cor so, em produto multicor ignorava a
                // variacao que a cliente escolheu (a prova saia na cor errada). A foto no
                // rosto ainda entra como 2a referencia (so tamanho/encaixe) quando existe.
                const prodImg = variantImg || _faceUrl || selectedProductImgUrl || (document.querySelector('meta[property="og:image"]')?.content || '');
                const prodName = document.querySelector('h1.product__title,.product-single__title,h1')?.innerText || document.title;

                uploadStep.style.display = 'none';
                document.getElementById('q-loading-box').style.display = 'flex';
                startLoadingProgress();

                try {
                    const fd = new FormData();
                    fd.append('person_image', await toJpeg(userPhoto), 'person.jpg');
                    fd.append('email', (phoneInput.value || '').trim());   // le direto (runGeneration)
                    fd.append('whatsapp', '');   // Velaro nao captura telefone
                    fd.append('product_name', prodName);
                    fd.append('product_type', currentProduct.category);
                    fd.append('product_fit', currentProduct.fit);
                    fd.append('api_key', keyToUse);
                    if (pixPaymentId) fd.append('pix_payment_id', pixPaymentId);

                    if (currentProduct.category === 'top') {
                        fd.append('height', '');
                        fd.append('weight', '');
                    } else {
                        fd.append('height', '');
                        fd.append('weight', '');
                        fd.append('cintura', '');
                        fd.append('quadril', '');
                    }

                    // Coleta até 4 fotos do produto: 1ª como binary (compat), 2ª-4ª como base64 text.
                    // 1ª = prodImg (escolhida pelo cliente ou default); demais = extractImages() exceto a 1ª.
                    let allProdImgs = [];
                    if (prodImg) allProdImgs.push(prodImg);
                    // Só junta extras da galeria quando NÃO temos a imagem da variante:
                    // a galeria tem fotos de todas as cores, então mandar extras junto da
                    // cor certa contaminaria a geração. Com variantImg, mandamos só ela.
                    try {
                        if (!_faceUrl && !variantImg && typeof extractImages === 'function') {
                            const extra = extractImages();
                            for (const u of extra) {
                                const cleanU = String(u || '').split('?')[0];
                                if (!allProdImgs.some(p => String(p).split('?')[0] === cleanU)) {
                                    allProdImgs.push(u);
                                }
                            }
                        }
                    } catch (_) {}
                    // FALLBACK a prova de balas (temas Dawn/Shopify): se nada foi detectado
                    // no DOM, pega a imagem do produto direto do endpoint /products/handle.js.
                    if (allProdImgs.length === 0) {
                        try {
                            var _pj = await fetch(location.pathname.split('?')[0].replace(/\/$/, '') + '.js', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); });
                            var _pi0 = (_pj && (_pj.featured_image || (_pj.images && _pj.images[0]))) || '';
                            if (_pi0) { if (_pi0.indexOf('//') === 0) _pi0 = 'https:' + _pi0; allProdImgs.push(_pi0); }
                        } catch (_e) { }
                    }
                    allProdImgs = allProdImgs.slice(0, 4);
                    // Guarda anti-"ALTA DEMANDA": só manda blobs que são REALMENTE imagem.
                    // Se uma URL resolver pra HTML/404 (ex: página do produto), o Gemini
                    // rejeita com 400 e a prova quebra. Aqui pulamos o não-imagem; a 1ª
                    // imagem VÁLIDA vira a principal (binary), o resto vai como base64.
                    let _primaryDone = false, _slot = 1;
                    for (let _pi = 0; _pi < allProdImgs.length; _pi++) {
                        try {
                            const _u = String(allProdImgs[_pi] || '').replace(/^http:\/\//i, 'https://').replace(/\{width\}/g, '1200');
                            const _b = await fetch(_u).then(r => r.blob());
                            if (!_b || !/^image\//i.test(_b.type)) continue;
                            if (!_primaryDone) {
                                fd.append('product_image', _b, 'product.jpg');
                                _primaryDone = true;
                            } else {
                                _slot++;
                                const _b64 = await new Promise((resolve, reject) => {
                                    const _r = new FileReader();
                                    _r.onloadend = () => resolve(_r.result.split(',')[1]);
                                    _r.onerror = reject;
                                    _r.readAsDataURL(_b);
                                });
                                fd.append('product_image_' + _slot + '_b64', _b64);
                            }
                        } catch (_) { }
                    }
                    if (!_primaryDone) {
                        // Sem imagem de produto válida o gerador não tem o que provar e o nó
                        // "Extract Product Image" quebra (Provided parameter is not a string).
                        // Aborta com erro claro em vez de mandar um request quebrado pro workflow.
                        console.warn('[PL Cand] nenhuma imagem de produto válida — abortando prova');
                        try { document.getElementById('q-loading-box').style.display = 'none'; } catch (_) {}
                        try { photoStep.style.display = 'flex'; } catch (_) {}
                        try { showError(); } catch (_) {}
                        return;
                    }

                    calculateFinalSize();

                    const res = await (async () => {
                        let _d = 1500;
                        for (let _i = 0; _i < 4; _i++) {
                            const _r = await fetch(WEBHOOK_PROVA, { method: 'POST', body: fd });
                            if (_r.ok || _r.status === 400 || _r.status === 401 || _r.status === 403) return _r;
                            if (_i === 3) return _r;
                            await new Promise(_x => setTimeout(_x, _d + Math.random() * 500));
                            _d *= 2;
                        }
                    })();

                    const contentType = res.headers.get("content-type") || "";
                    if (contentType.includes("application/json")) {
                        const data = await res.json();
                        if (data.limited || data.error === 'limite_diario') {
                            try { document.getElementById('q-loading-box').style.display = 'none'; } catch (_) {}
                            createPixAndPoll();
                            return;
                        }
                        if (data.error) {
                            document.getElementById('q-loading-box').style.display = 'none';
                            photoStep.style.display = 'flex';
                            if (data.error === "Chave invalida, vencida ou inativa." || data.error.includes("vencida ou inativa")) {
                                showError();
                            } else {
                                alert(data.error);
                            }
                            return;
                        }
                    }

                    if (res.ok) {
                        const blob = await res.blob();
                        document.getElementById('q-loading-box').style.display = 'none';
                        document.getElementById('q-final-view-img').src = URL.createObjectURL(blob);
                        document.querySelector('.q-card-ia').classList.add('is-result');
                        document.getElementById('q-step-result').style.display = 'flex';
                        populateBuyCta();
                        if (typeof _checkProvasRestantes === 'function') _checkProvasRestantes();
                    } else if (res.status === 401 || res.status === 403) {
                        document.getElementById('q-loading-box').style.display = 'none';
                        photoStep.style.display = 'flex';
                        showError();
                    } else { throw new Error(); }
                } catch (e) {
                    document.getElementById('q-loading-box').style.display = 'none';
                    photoStep.style.display = 'flex';
                    showError();
                }
        

            } finally {

                runGeneration._busy = false;

            }
        }

        

        genBtn.onclick = async () => {
            // Validação agressiva (UI feedback)
            var _vNums = (phoneInput.value || '').replace(/\D/g, '');
            var _vPhoneOk = isValidBRPhone();
            var _vFaceFrame = document.getElementById('q-face-frame');
            var _vTerms = document.getElementById('q-accept-terms');
            if (!_vPhoneOk) { flashError(phoneInput, 'Escribe un correo válido para continuar'); return; }
            if (!userPhoto) { flashError(_vFaceFrame, 'Sube o toma tu foto para continuar'); return; }
            if (_vTerms && !_vTerms.checked) { flashError(document.querySelector('.q-terms-row'), 'Acepta los términos para continuar'); return; }
            var _vHint = document.getElementById('q-validation-hint');
            if (_vHint) _vHint.classList.remove('is-visible');
            phoneInput.classList.remove('is-error');
            if (_vFaceFrame) _vFaceFrame.classList.remove('is-error');

            if (!userPhoto) return;
            if (!isValidBRPhone()) { phoneInput.focus(); return; }
            const _email = (phoneInput.value || '').trim();
            const phone = '0';   // Velaro: sem telefone; limite/gerador usam email + IP
            genBtn.disabled = true;

            // Feedback imediato: mostra a animacao na hora; o check de limite roda enquanto ela ja aparece.
            try { uploadStep.style.display = 'none'; } catch (_) {}
            try { document.getElementById('q-loading-box').style.display = 'flex';
 startLoadingProgress(); } catch (_) {}


            try {
                const resp = await fetch(WEBHOOK_CHECK_LIMIT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone })
                });
                const data = await resp.json();
                if (data.limited) {
            try { document.getElementById('q-loading-box').style.display = 'none'; } catch (_) {}
                    genBtn.disabled = false;
                    try {
                        var _eh = document.querySelector('#q-step-error h2');
                        var _ep = document.querySelector('#q-step-error p');
                        if (_eh) _eh.textContent = 'Límite alcanzado';
                        if (_ep) _ep.textContent = 'Ya usaste tus 3 pruebas de hoy. Vuelve mañana para probar más modelos.';
                    } catch (_) {}
                    showError();
                    return;
                }
            } catch (_) {
                // se o check falhar, deixa gerar (evita bloquear por erro de rede)
            }

            genBtn.disabled = false;
            runGeneration();
        };
    }

    // ─── EXECUTA APENAS EM PÁGINAS DE PRODUTO (Shopify estrito) ──────────────────
    // Só roda se a página for produto de verdade: og:type=product E /products/<handle>.
    // Evita aparecer em /products cru, coleções, home, etc. (pedido do lojista Cand).
    const isProductPage = !!document.querySelector('meta[property="og:type"][content="product"]') && /\/products\/[^\/?#]+/.test(window.location.pathname);

    if (isProductPage && !PROVADOR_OFF) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
        else init();
    }

})();
