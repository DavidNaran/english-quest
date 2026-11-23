/* vocab-icons.js — Ilustraciones SVG propias (offline) para las 20 palabras y el guía. */
(function (EQ) {
  'use strict';
  var W = function (inner, label) {
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + label + '">' + inner + '</svg>';
  };
  var sky = '<rect width="100" height="100" rx="14" fill="#d8ecfb"/>';
  var grass = '<rect y="72" width="100" height="28" rx="0" fill="#8ccf7e"/>';

  var I = {
    mountain: W(sky +
      '<circle cx="80" cy="20" r="9" fill="#ffd25e"/>' +
      '<polygon points="5,88 38,28 70,88" fill="#8a7d72"/><polygon points="38,28 30,43 36,40 41,46 46,41" fill="#fff"/>' +
      '<polygon points="40,88 68,42 96,88" fill="#6f6359"/><polygon points="68,42 61,54 67,51 72,56 75,52" fill="#fff"/>' +
      '<rect y="86" width="100" height="14" fill="#7bbf6a"/>', 'mountain'),

    forest: W(sky + grass +
      '<rect x="16" y="62" width="6" height="16" fill="#7a4e2d"/><polygon points="19,18 4,64 34,64" fill="#2f8f4e"/>' +
      '<rect x="46" y="58" width="7" height="20" fill="#7a4e2d"/><polygon points="49.5,10 30,60 69,60" fill="#237a41"/>' +
      '<rect x="78" y="62" width="6" height="16" fill="#7a4e2d"/><polygon points="81,22 66,64 96,64" fill="#3aa35c"/>', 'forest'),

    village: W(sky + grass +
      '<rect x="8" y="50" width="26" height="28" fill="#f4c98b"/><polygon points="5,52 21,34 37,52" fill="#c0503c"/><rect x="17" y="62" width="8" height="16" fill="#7a4e2d"/>' +
      '<rect x="38" y="44" width="26" height="34" fill="#fbe3b3"/><polygon points="35,46 51,26 67,46" fill="#a8402f"/><rect x="45" y="54" width="8" height="8" fill="#9ed0f2"/><rect x="47" y="66" width="8" height="12" fill="#7a4e2d"/>' +
      '<rect x="68" y="52" width="24" height="26" fill="#f4c98b"/><polygon points="65,54 80,38 95,54" fill="#c0503c"/><rect x="76" y="62" width="8" height="8" fill="#9ed0f2"/>', 'village'),

    field: W(sky +
      '<circle cx="20" cy="20" r="9" fill="#ffd25e"/>' +
      '<path d="M0,55 Q50,45 100,55 L100,100 L0,100 Z" fill="#a8d86e"/>' +
      '<path d="M0,70 Q50,60 100,70" stroke="#86b94f" stroke-width="3" fill="none"/>' +
      '<path d="M0,84 Q50,74 100,84" stroke="#86b94f" stroke-width="3" fill="none"/>' +
      '<g fill="#e9b949"><ellipse cx="20" cy="62" rx="3" ry="6"/><ellipse cx="40" cy="60" rx="3" ry="6"/><ellipse cx="60" cy="60" rx="3" ry="6"/><ellipse cx="80" cy="62" rx="3" ry="6"/></g>' +
      '<g fill="#e05d7a"><circle cx="30" cy="90" r="3"/><circle cx="70" cy="92" r="3"/></g>' +
      '<path d="M5,55 L95,55" stroke="#7a4e2d" stroke-width="0"/>' +
      '<rect x="62" y="38" width="3" height="18" fill="#7a4e2d"/><rect x="82" y="38" width="3" height="18" fill="#7a4e2d"/><rect x="60" y="42" width="28" height="3" fill="#a06a3d"/><rect x="60" y="49" width="28" height="3" fill="#a06a3d"/>', 'field'),

    lake: W(sky +
      '<rect y="40" width="100" height="60" fill="#8ccf7e"/>' +
      '<ellipse cx="50" cy="70" rx="42" ry="20" fill="#4aa3df"/>' +
      '<path d="M25,68 q6,-4 12,0 M55,74 q6,-4 12,0 M40,80 q5,-3 10,0" stroke="#d6efff" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<polygon points="12,44 4,62 20,62" fill="#2f8f4e"/><polygon points="88,40 79,60 97,60" fill="#2f8f4e"/>' +
      '<polygon points="30,38 22,26 38,26" fill="none"/><path d="M58,30 l10,-12 l10,12 Z" fill="#8a7d72"/>', 'lake'),

    island: W('<rect width="100" height="100" rx="14" fill="#bfe6fb"/>' +
      '<circle cx="78" cy="20" r="9" fill="#ffd25e"/>' +
      '<rect y="58" width="100" height="42" fill="#3a8fd1"/>' +
      '<ellipse cx="48" cy="64" rx="30" ry="10" fill="#f3d58f"/>' +
      '<path d="M48,62 Q46,44 40,30" stroke="#8a5a32" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M40,30 Q28,24 18,32 M40,30 Q36,18 26,16 M40,30 Q48,18 58,20 M40,30 Q54,28 60,38" stroke="#2f8f4e" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<path d="M10,80 q6,-4 12,0 M70,84 q6,-4 12,0" stroke="#d6efff" stroke-width="2.5" fill="none" stroke-linecap="round"/>', 'island'),

    river: W('<rect width="100" height="100" rx="14" fill="#8ccf7e"/>' +
      '<path d="M40,0 C20,25 70,40 45,60 C25,75 55,90 50,100 L72,100 C78,88 48,74 66,60 C92,40 42,24 62,0 Z" fill="#4aa3df"/>' +
      '<path d="M48,20 q5,-3 8,1 M54,48 q5,-3 8,1 M52,80 q5,-3 8,1" stroke="#d6efff" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<polygon points="15,20 7,38 23,38" fill="#2f8f4e"/><polygon points="85,62 77,80 93,80" fill="#2f8f4e"/><circle cx="18" cy="78" r="6" fill="#3aa35c"/>', 'river'),

    path: W(sky +
      '<rect y="40" width="100" height="60" fill="#8ccf7e"/>' +
      '<path d="M30,100 C35,80 70,74 58,60 C50,50 46,46 50,40 L54,40 C54,46 62,52 66,60 C80,76 52,82 64,100 Z" fill="#e7c48e"/>' +
      '<g fill="#b38a5a"><circle cx="45" cy="88" r="2"/><circle cx="58" cy="70" r="2"/><circle cx="52" cy="52" r="1.5"/></g>' +
      '<polygon points="16,30 8,50 24,50" fill="#2f8f4e"/><polygon points="84,28 76,48 92,48" fill="#2f8f4e"/>' +
      '<rect x="74" y="64" width="3" height="16" fill="#7a4e2d"/><rect x="66" y="62" width="18" height="7" rx="2" fill="#c98e4f"/>', 'path'),

    bridge: W(sky +
      '<rect y="70" width="100" height="30" fill="#4aa3df"/>' +
      '<rect y="58" width="14" height="42" fill="#8ccf7e"/><rect x="86" y="58" width="14" height="42" fill="#8ccf7e"/>' +
      '<path d="M6,60 Q50,20 94,60" stroke="#b5643a" stroke-width="7" fill="none"/>' +
      '<path d="M6,60 Q50,32 94,60 L94,66 Q50,40 6,66 Z" fill="#c97b48"/>' +
      '<g stroke="#8a4a28" stroke-width="3"><line x1="26" y1="46" x2="26" y2="54"/><line x1="40" y1="38" x2="40" y2="46"/><line x1="60" y1="38" x2="60" y2="46"/><line x1="74" y1="46" x2="74" y2="54"/></g>' +
      '<path d="M20,84 q6,-4 12,0 M60,88 q6,-4 12,0" stroke="#d6efff" stroke-width="2.5" fill="none" stroke-linecap="round"/>', 'bridge'),

    late: W('<rect width="100" height="100" rx="14" fill="#2c3a6b"/>' +
      '<g fill="#fff6c9"><circle cx="15" cy="18" r="1.8"/><circle cx="30" cy="10" r="1.4"/><circle cx="88" cy="40" r="1.6"/><circle cx="70" cy="12" r="1.3"/><circle cx="12" cy="60" r="1.4"/></g>' +
      '<path d="M88,14 a12,12 0 1,1 -14,16 a10,10 0 1,0 14,-16 Z" fill="#ffe27a"/>' +
      '<circle cx="48" cy="58" r="28" fill="#fff" stroke="#e05d4f" stroke-width="5"/>' +
      '<g stroke="#2c3a6b" stroke-width="4" stroke-linecap="round"><line x1="48" y1="58" x2="36" y2="50"/><line x1="48" y1="58" x2="48" y2="38"/></g>' +
      '<circle cx="48" cy="58" r="3" fill="#2c3a6b"/>' +
      '<g fill="#2c3a6b"><rect x="46.5" y="33" width="3" height="5"/><rect x="46.5" y="78" width="3" height="5"/><rect x="23" y="56.5" width="5" height="3"/><rect x="68" y="56.5" width="5" height="3"/></g>', 'late'),

    meet: W(sky + grass +
      '<circle cx="30" cy="30" r="9" fill="#f5c9a0"/><rect x="22" y="40" width="16" height="26" rx="6" fill="#e05d7a"/><rect x="24" y="64" width="5" height="14" fill="#3a4a7a"/><rect x="31" y="64" width="5" height="14" fill="#3a4a7a"/>' +
      '<path d="M26,22 q4,-8 10,-2" stroke="#6b3e1f" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<circle cx="70" cy="30" r="9" fill="#c98e62"/><rect x="62" y="40" width="16" height="26" rx="6" fill="#3aa35c"/><rect x="64" y="64" width="5" height="14" fill="#3a4a7a"/><rect x="71" y="64" width="5" height="14" fill="#3a4a7a"/>' +
      '<path d="M37,46 L50,52 L63,46" stroke="#f5c9a0" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="50" cy="52" r="4" fill="#e9b07e"/>' +
      '<path d="M44,16 l3,-6 M50,14 l0,-7 M56,16 l-3,-6" stroke="#e9a23b" stroke-width="2.5" stroke-linecap="round"/>', 'to meet'),

    early: W('<rect width="100" height="100" rx="14" fill="#ffe2c2"/>' +
      '<rect y="62" width="100" height="38" fill="#8ccf7e"/>' +
      '<path d="M22,62 a28,28 0 0,1 56,0 Z" fill="#ffb347"/>' +
      '<g stroke="#ff9a2e" stroke-width="4" stroke-linecap="round"><line x1="50" y1="26" x2="50" y2="16"/><line x1="26" y1="38" x2="18" y2="31"/><line x1="74" y1="38" x2="82" y2="31"/><line x1="14" y1="56" x2="5" y2="54"/><line x1="86" y1="56" x2="95" y2="54"/></g>' +
      '<circle cx="76" cy="80" r="14" fill="#fff" stroke="#3aa35c" stroke-width="3.5"/>' +
      '<g stroke="#2c3a6b" stroke-width="3" stroke-linecap="round"><line x1="76" y1="80" x2="76" y2="70"/><line x1="76" y1="80" x2="69" y2="84"/></g>', 'early'),

    ask: W(sky +
      '<circle cx="34" cy="48" r="11" fill="#f5c9a0"/><path d="M24,42 q10,-12 20,0" stroke="#6b3e1f" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<rect x="24" y="60" width="20" height="32" rx="8" fill="#4a7fd4"/>' +
      '<path d="M44,66 L56,46" stroke="#f5c9a0" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M56,8 h34 a6,6 0 0 1 6,6 v22 a6,6 0 0 1 -6,6 h-20 l-10,10 v-10 h-4 a6,6 0 0 1 -6,-6 v-22 a6,6 0 0 1 6,-6 Z" fill="#fff" stroke="#6a4fb3" stroke-width="3"/>' +
      '<text x="73" y="35" text-anchor="middle" font-size="26" font-weight="700" fill="#6a4fb3" font-family="Verdana, sans-serif">?</text>', 'to ask'),

    answer: W(sky +
      '<circle cx="66" cy="48" r="11" fill="#c98e62"/><path d="M56,44 q10,-12 20,0" stroke="#2b1d12" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<rect x="56" y="60" width="20" height="32" rx="8" fill="#e8833a"/>' +
      '<path d="M44,8 h-34 a6,6 0 0 0 -6,6 v22 a6,6 0 0 0 6,6 h20 l10,10 v-10 h4 a6,6 0 0 0 6,-6 v-22 a6,6 0 0 0 -6,-6 Z" fill="#fff" stroke="#1f7a3a" stroke-width="3"/>' +
      '<path d="M15,25 l7,7 l13,-14" stroke="#1f7a3a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>', 'to answer'),

    show: W(sky +
      '<circle cx="28" cy="40" r="11" fill="#f5c9a0"/><path d="M18,36 q10,-12 20,0" stroke="#6b3e1f" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<rect x="18" y="52" width="20" height="34" rx="8" fill="#3aa35c"/>' +
      '<path d="M38,60 L54,52" stroke="#f5c9a0" stroke-width="6" stroke-linecap="round"/>' +
      '<rect x="52" y="22" width="40" height="34" rx="4" fill="#fff" stroke="#a46a00" stroke-width="3"/>' +
      '<polygon points="56,50 68,34 76,44 80,38 88,50" fill="#7bbf6a"/><circle cx="82" cy="30" r="4" fill="#ffd25e"/>' +
      '<path d="M60,14 l-4,-6 M72,12 v-7 M84,14 l4,-6" stroke="#e9a23b" stroke-width="2.5" stroke-linecap="round"/>', 'to show'),

    bark: W(sky + grass +
      '<ellipse cx="40" cy="66" rx="22" ry="12" fill="#c98e4f"/>' +
      '<rect x="24" y="70" width="6" height="14" rx="2" fill="#c98e4f"/><rect x="48" y="70" width="6" height="14" rx="2" fill="#c98e4f"/>' +
      '<path d="M18,62 q-10,-6 -8,-14" stroke="#c98e4f" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<circle cx="62" cy="50" r="14" fill="#d9a066"/>' +
      '<ellipse cx="54" cy="42" rx="5" ry="10" fill="#8a5a32" transform="rotate(-20 54 42)"/>' +
      '<circle cx="66" cy="46" r="2.5" fill="#222"/><ellipse cx="75" cy="53" rx="4" ry="3" fill="#222"/>' +
      '<path d="M66,58 q6,6 12,0" stroke="#7a2b2b" stroke-width="3" fill="#e46b6b"/>' +
      '<g stroke="#6a4fb3" stroke-width="3.5" stroke-linecap="round"><path d="M82,40 l8,-5"/><path d="M84,50 l10,0"/><path d="M82,60 l8,5"/></g>', 'to bark'),

    catch: W(sky +
      '<circle cx="70" cy="28" r="12" fill="#ff6b5b"/><path d="M62,20 q8,8 0,16 M78,20 q-8,8 0,16" stroke="#fff" stroke-width="2.5" fill="none"/>' +
      '<g stroke="#7aa0c8" stroke-width="3" stroke-linecap="round"><line x1="88" y1="12" x2="96" y2="6"/><line x1="90" y1="24" x2="98" y2="22"/></g>' +
      '<path d="M18,92 L30,58 C28,46 40,40 46,48 L52,40 C56,34 64,38 62,46 L58,58 C62,62 60,72 52,74 L40,92 Z" fill="#a0602f"/>' +
      '<path d="M30,58 C40,52 52,56 58,58" stroke="#7a4220" stroke-width="3" fill="none"/>' +
      '<path d="M56,46 Q66,40 70,40" stroke="#7aa0c8" stroke-width="2" stroke-dasharray="3 4" fill="none"/>', 'to catch'),

    build: W(sky +
      '<rect y="86" width="100" height="14" fill="#8ccf7e"/>' +
      '<g fill="#d0603f" stroke="#fbe3d6" stroke-width="2">' +
      '<rect x="8" y="70" width="22" height="16"/><rect x="30" y="70" width="22" height="16"/><rect x="52" y="70" width="22" height="16"/>' +
      '<rect x="19" y="54" width="22" height="16"/><rect x="41" y="54" width="22" height="16"/>' +
      '<rect x="30" y="38" width="22" height="16"/></g>' +
      '<g transform="rotate(35 80 40)"><rect x="77" y="30" width="6" height="40" rx="2" fill="#a06a3d"/><rect x="68" y="22" width="24" height="12" rx="3" fill="#6f7780"/></g>', 'to build'),

    keep: W(sky +
      '<rect x="18" y="50" width="64" height="38" rx="6" fill="#b7793f" stroke="#7a4e2d" stroke-width="3"/>' +
      '<path d="M14,50 Q50,24 86,50 Z" fill="#c98e4f" stroke="#7a4e2d" stroke-width="3"/>' +
      '<rect x="44" y="56" width="12" height="14" rx="3" fill="#ffd25e" stroke="#a46a00" stroke-width="2"/>' +
      '<rect x="18" y="72" width="64" height="5" fill="#7a4e2d"/>' +
      '<circle cx="50" cy="16" r="9" fill="#ffd25e" stroke="#a46a00" stroke-width="2"/><text x="50" y="21" text-anchor="middle" font-size="12" font-weight="700" fill="#a46a00" font-family="Verdana, sans-serif">★</text>' +
      '<path d="M50,27 v8" stroke="#a46a00" stroke-width="3" stroke-linecap="round"/><path d="M45,31 l5,5 l5,-5" stroke="#a46a00" stroke-width="3" fill="none" stroke-linecap="round"/>', 'to keep'),

    pocket: W('<rect width="100" height="100" rx="14" fill="#5d86c4"/>' +
      '<g stroke="#f2c45a" stroke-width="2" stroke-dasharray="4 3" fill="none"><path d="M6,8 V94"/><path d="M94,8 V94"/></g>' +
      '<path d="M22,34 H78 V64 Q78,86 50,90 Q22,86 22,64 Z" fill="#4a72b0" stroke="#f2c45a" stroke-width="2.5" stroke-dasharray="4 3"/>' +
      '<path d="M22,34 H78" stroke="#2f4f80" stroke-width="5"/>' +
      '<circle cx="42" cy="30" r="9" fill="#ffd25e" stroke="#a46a00" stroke-width="2"/>' +
      '<rect x="54" y="14" width="8" height="24" rx="2" fill="#ff6b5b" transform="rotate(15 58 26)"/>', 'pocket')
  };

  /* Zarra, la gata exploradora (guía) */
  var CAT_FACE =
    '<polygon points="18,46 24,12 46,30" fill="#f2a65a"/><polygon points="24,38 27,20 39,30" fill="#f7b8c4"/>' +
    '<polygon points="82,46 76,12 54,30" fill="#f2a65a"/><polygon points="76,38 73,20 61,30" fill="#f7b8c4"/>' +
    '<ellipse cx="50" cy="57" rx="34" ry="29" fill="#f2a65a"/>' +
    '<path d="M44,30 l2,9 M50,29 v10 M56,30 l-2,9" stroke="#d9822b" stroke-width="3" stroke-linecap="round"/>' +
    '<ellipse cx="50" cy="70" rx="14" ry="10" fill="#fff3e6"/>' +
    '<circle cx="30" cy="66" r="5" fill="#f7a1b0" opacity=".55"/><circle cx="70" cy="66" r="5" fill="#f7a1b0" opacity=".55"/>' +
    '<ellipse cx="38" cy="54" rx="5" ry="6.5" fill="#2b1d12"/><ellipse cx="62" cy="54" rx="5" ry="6.5" fill="#2b1d12"/>' +
    '<circle cx="39.8" cy="51.5" r="1.8" fill="#fff"/><circle cx="63.8" cy="51.5" r="1.8" fill="#fff"/>' +
    '<polygon points="46.5,64 53.5,64 50,68" fill="#e86a8a"/>' +
    '<path d="M50,68 q-3,4 -7,2 M50,68 q3,4 7,2" stroke="#2b1d12" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M34,68 L16,64 M34,72 L16,74 M66,68 L84,64 M66,72 L84,74" stroke="#8a5a32" stroke-width="1.6" stroke-linecap="round"/>' +
    '<polygon points="66,20 74,26 66,32" fill="#e05d7a"/><polygon points="82,20 74,26 82,32" fill="#e05d7a"/><circle cx="74" cy="26" r="3.2" fill="#c2405e"/>';
  var GUIDE = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<circle cx="50" cy="50" r="48" fill="#ffe8c7"/>' + CAT_FACE + '</svg>';

  EQ.art = {
    icon: function (id) { return I[id] || ''; },
    has: function (id) { return !!I[id]; },
    guide: GUIDE,
    ids: Object.keys(I)
  };
})(window.EQ);
