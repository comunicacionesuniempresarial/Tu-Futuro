// Builder: docs/propuesta-tcg-v5-animacion.html — premium TCG reveal animation
// Engine: GSAP 3 (CDN) + canvas particle system + inline SVG art (no emojis).
const fs = require('fs');
const path = require('path');

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TuFuturo Dual - Reveal Animation v5</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { height:100%; overflow:hidden; }
  body {
    background: #04060D;
    color: #EDEAE2;
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  body::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(52% 44% at 22% 12%, rgba(22,32,64,.75) 0%, transparent 70%),
      radial-gradient(46% 42% at 84% 88%, rgba(44,20,74,.65) 0%, transparent 70%),
      radial-gradient(38% 30% at 72% 16%, rgba(16,28,52,.5) 0%, transparent 70%);
  }
  body::after {
    content:''; position:fixed; inset:0; z-index:1; pointer-events:none;
    background: radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.72) 100%);
  }

  .topbar { position:fixed; top:0; left:0; right:0; z-index:60; display:flex; justify-content:space-between; align-items:center; padding:18px 22px; pointer-events:none; }
  .badge { font-family:'Cinzel', Georgia, serif; font-size:12px; letter-spacing:.28em; color:#E8D9A8; text-transform:uppercase; opacity:.85; }
  .badge i { font-style:normal; color:#8B7340; margin:0 8px; }
  #skip {
    pointer-events:auto; cursor:pointer; font-family:'Inter',sans-serif; font-size:11px; letter-spacing:.18em;
    text-transform:uppercase; color:#C9BFA6; background:rgba(139,115,64,.08);
    border:1px solid rgba(139,115,64,.55); border-radius:20px; padding:8px 16px;
    transition: all .25s ease; opacity:.75;
  }
  #skip:hover { opacity:1; color:#FFD98A; border-color:#F5C452; box-shadow:0 0 18px rgba(245,196,82,.25); }

  #actCap {
    position:fixed; left:22px; bottom:22px; z-index:60; pointer-events:none;
    font-family:'Cinzel', Georgia, serif; font-size:13px; letter-spacing:.22em; color:#E8D9A8;
    opacity:.8; text-transform:uppercase;
  }
  #actCap::before { content:''; display:inline-block; width:26px; height:1px; background:#F5C452; vertical-align:middle; margin-right:12px; opacity:.8; }

  .stage { position:fixed; inset:0; z-index:5; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  #fx { position:fixed; inset:0; z-index:30; pointer-events:none; }

  /* ---------- PACK ---------- */
  #pack {
    position:relative; width:190px; height:264px; cursor:pointer; border-radius:16px;
    background: linear-gradient(148deg, #37280F 0%, #1E1608 46%, #120D05 100%);
    border:1px solid rgba(245,196,82,.6);
    box-shadow: 0 0 50px rgba(245,196,82,.18), 0 30px 60px rgba(0,0,0,.65),
                inset 0 0 0 1px rgba(0,0,0,.55), inset 0 0 32px rgba(245,196,82,.05);
    transition: box-shadow .3s ease, filter .3s ease;
  }
  #pack:hover { box-shadow: 0 0 70px rgba(245,196,82,.32), 0 30px 70px rgba(0,0,0,.7),
                inset 0 0 0 1px rgba(0,0,0,.55), inset 0 0 32px rgba(245,196,82,.09); filter: brightness(1.1); }
  .p-foil { position:absolute; inset:0; border-radius:16px; overflow:hidden; pointer-events:none;
    background: repeating-linear-gradient(115deg, transparent 0 20px, rgba(255,255,255,.032) 20px 22px, transparent 22px 44px); }
  .p-sheen { position:absolute; inset:-60%; pointer-events:none; opacity:.8;
    background: linear-gradient(115deg, transparent 42%, rgba(255,255,255,.11) 50%, transparent 58%);
    animation: sweep 3.4s ease-in-out infinite; }
  @keyframes sweep { 0%, 52% { transform: translateX(-55%); } 88%, 100% { transform: translateX(55%); } }
  .p-inner { position:absolute; inset:12px; border:1px solid rgba(245,196,82,.30); border-radius:10px;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:14px; }
  .p-name { font-family:'Cinzel', Georgia, serif; font-size:15px; font-weight:700; letter-spacing:.3em;
    color:#E8D9A8; text-align:center; text-transform:uppercase; }
  .p-line { width:74px; height:1px; background: linear-gradient(90deg, transparent, rgba(245,196,82,.75), transparent); }
  .p-tag { font-size:9px; letter-spacing:.24em; color:#A79F8F; text-transform:uppercase; }

  #hint { margin-top:34px; font-size:11px; letter-spacing:.24em; color:#A79F8F; text-transform:uppercase;
    animation: hintpulse 2.2s ease-in-out infinite; }
  @keyframes hintpulse { 0%,100% { opacity:.45; } 50% { opacity:.95; } }

  .rays { position:absolute; left:50%; top:50%; width:440px; height:440px; margin:-220px 0 0 -220px; z-index:1;
    border-radius:50%; opacity:0; transform: scale(.35);
    background: repeating-conic-gradient(from 0deg, rgba(255,214,130,0) 0deg 11deg, rgba(255,214,130,.30) 11deg 15deg, rgba(255,214,130,0) 15deg 30deg);
    filter: blur(7px); pointer-events:none; transition: transform .55s cubic-bezier(.22,1.4,.36,1), opacity .55s ease; }
  .rays.on { opacity:1; transform: scale(1); }
  .rays.off { transition: opacity 1.4s ease; opacity:0; }

  /* ---------- FLY CARDS ---------- */
  .fly-card {
    position:absolute; left:50%; top:50%; width:56px; height:80px; margin:-40px 0 0 -28px;
    border-radius:7px; border:1.5px solid var(--cc);
    background: linear-gradient(160deg, #161D30 0%, #0A0F1E 58%, #060912 100%);
    box-shadow: 0 0 14px var(--cg), 0 10px 24px rgba(0,0,0,.55), inset 0 0 10px rgba(255,255,255,.03);
  }
  .fc-frame { position:absolute; inset:4px; border:1px solid rgba(255,255,255,.14); border-radius:4px;
    display:flex; align-items:center; justify-content:center; }
  .fc-sheen { position:absolute; inset:0; border-radius:7px; overflow:hidden; pointer-events:none;
    background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,.10) 46%, transparent 62%); opacity:.55; }

  /* ---------- VORTEX ---------- */
  #vortex { position:absolute; left:50%; top:50%; width:460px; height:460px; margin:-230px 0 0 -230px; z-index:4;
    display:flex; align-items:center; justify-content:center; opacity:0; visibility:hidden; transition: opacity .45s ease, visibility .45s; }
  #vortex.on { opacity:1; visibility:visible; }
  .ring { position:absolute; left:50%; top:50%; opacity:0; }
  .ring svg { display:block; }
  #vortex.on .ring.r1 { width:190px; height:190px; margin:-95px 0 0 -95px; opacity:1; animation: spin 7s linear infinite; }
  #vortex.on .ring.r2 { width:300px; height:300px; margin:-150px 0 0 -150px; opacity:.5; animation: spinRev 11s linear infinite; }
  #vortex.on .ring.r3 { width:420px; height:420px; margin:-210px 0 0 -210px; opacity:.3; animation: spin 17s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes spinRev { to { transform: rotate(-360deg); } }
  #core {
    width:120px; height:120px; border-radius:50%; opacity:0; transform: scale(.4);
    animation: coreflicker 1.5s linear infinite, corepulse 1.5s ease-in-out infinite;
  }
  #vortex.on #core { opacity:1; transform: scale(1); transition: opacity .3s ease, transform .5s cubic-bezier(.22,1.6,.36,1); }
  @keyframes corepulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
  @keyframes coreflicker {
    0%   { background: radial-gradient(circle at 50% 45%, #FFF8E7 0%, #F5C452 30%, #C4A55A 58%, transparent 76%); box-shadow: 0 0 90px 32px rgba(196,165,90,.5); }
    17%  { background: radial-gradient(circle at 50% 45%, #F0F9FF 0%, #93C5FD 30%, #60A5FA 58%, transparent 76%); box-shadow: 0 0 90px 32px rgba(96,165,250,.5); }
    33%  { background: radial-gradient(circle at 50% 45%, #FFF7ED 0%, #FDBA74 30%, #FB923C 58%, transparent 76%); box-shadow: 0 0 90px 32px rgba(251,146,60,.5); }
    50%  { background: radial-gradient(circle at 50% 45%, #FEFCE8 0%, #FDE047 30%, #FACC15 58%, transparent 76%); box-shadow: 0 0 90px 32px rgba(253,224,71,.5); }
    67%  { background: radial-gradient(circle at 50% 45%, #F0FDF4 0%, #86EFAC 30%, #4ADE80 58%, transparent 76%); box-shadow: 0 0 90px 32px rgba(74,222,128,.5); }
    83%  { background: radial-gradient(circle at 50% 45%, #FAF5FF 0%, #D8B4FE 30%, #C084FC 58%, transparent 76%); box-shadow: 0 0 90px 32px rgba(192,132,252,.5); }
    100% { background: radial-gradient(circle at 50% 45%, #FFF8E7 0%, #F5C452 30%, #C4A55A 58%, transparent 76%); box-shadow: 0 0 90px 32px rgba(196,165,90,.5); }
  }
  .vlabel { position:absolute; bottom:-30px; left:0; right:0; text-align:center; font-size:10px;
    letter-spacing:.42em; color:#F5C452; opacity:0; text-transform:uppercase; }
  #vortex.on .vlabel { opacity:.75; transition: opacity .6s ease .3s; }

  /* ---------- FLASH ---------- */
  #flash { position:fixed; inset:0; z-index:40; pointer-events:none; opacity:0;
    background: radial-gradient(circle at 50% 50%, #ffffff 0%, rgba(255,250,235,.95) 26%, rgba(255,236,180,.55) 52%, transparent 78%); }

  /* ---------- REVEAL CARD ---------- */
  .reveal-wrap { position:absolute; inset:0; z-index:20; display:flex; align-items:center; justify-content:center; pointer-events:none; }
  #reveal { display:none; position:relative; z-index:2; }
  .glow { position:absolute; inset:-50px; z-index:0; opacity:0; pointer-events:none;
    background: radial-gradient(circle at 50% 55%, rgba(245,196,82,.55), transparent 66%); filter: blur(28px); }
  .ygo {
    position:relative; z-index:1; width:300px; padding:8px; border-radius:16px;
    background:#14100A; border:1.5px solid #8B7340;
    display:flex; flex-direction:column; gap:8px;
    box-shadow: 0 0 70px rgba(245,196,82,.30), 0 34px 70px rgba(0,0,0,.7), inset 0 0 0 1px rgba(0,0,0,.5);
  }
  .shine { position:absolute; inset:0; z-index:6; pointer-events:none; border-radius:16px; overflow:hidden; opacity:0;
    background: linear-gradient(115deg, transparent 36%, rgba(255,255,255,.16) 50%, transparent 64%); }
  .shine.on { opacity:1; animation: shinesweep 1.3s ease-out .05s; }
  @keyframes shinesweep { 0% { transform: translateX(-90%); } 100% { transform: translateX(90%); } }
  .corners { position:absolute; inset:0; z-index:5; pointer-events:none; }
  .ynb { height:32px; display:flex; align-items:center; justify-content:space-between; padding:0 10px;
    background: linear-gradient(180deg, #3A2C12, #1C1509); border:1px solid #8B7340; border-radius:8px; }
  .yn { font-family:'Cinzel', Georgia, serif; font-size:17px; font-weight:700; color:#F5C452; }
  .ys { display:flex; gap:2px; }
  .ys .star { font-size:13px; color:#FFD98A; text-shadow:0 0 8px rgba(245,196,82,.9); }
  .yaf { position:relative; height:190px; border-radius:10px; overflow:hidden; border:1px solid #8B7340; }
  .yaf svg { position:absolute; inset:0; width:100%; height:100%; }
  .ag { position:absolute; inset:0; z-index:1; pointer-events:none;
    background: radial-gradient(120% 120% at 50% 100%, transparent 38%, rgba(6,9,18,.78) 100%); }
  .ytb { height:20px; display:flex; align-items:center; justify-content:space-between; padding:0 8px;
    font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:#A79F8F; }
  .ytb .el { color:#F5C452; }
  .yd { background: linear-gradient(180deg, #1E180E, #151007); border:1px solid #5A4A24; border-radius:8px;
    padding:8px 10px; min-height:76px; }
  .ef b { font-family:'Cinzel', Georgia, serif; font-size:15px; font-weight:700; color:#F5C452; }
  .ef .fx { color:#CFC7B4; font-size:12.5px; line-height:1.5; }
  .fl { font-style:italic; font-size:12px; color:#8F8778; line-height:1.45; min-height:18px;
    border-top:1px solid rgba(139,115,64,.35); padding:6px 10px 2px; }
  .ysb { height:38px; display:flex; background: linear-gradient(180deg, #3A2C12, #1C1509);
    border:1px solid #8B7340; border-radius:8px; overflow:hidden; }
  .ys2 { flex:1; display:flex; align-items:baseline; justify-content:center; gap:6px; }
  .ys2 + .ys2 { border-left:1px solid rgba(139,115,64,.6); }
  .ys2 .v { font-family:'Cinzel', Georgia, serif; font-size:21px; font-weight:800; color:#FFD98A;
    text-shadow:0 0 12px rgba(245,196,82,.85); }
  .ys2 .l { font-size:9px; letter-spacing:.2em; color:#A79F8F; }

  /* ---------- REPLAY ---------- */
  #replay {
    position:fixed; bottom:26px; left:50%; transform:translateX(-50%); z-index:50; cursor:pointer;
    font-family:'Cinzel', Georgia, serif; font-size:12px; font-weight:700; letter-spacing:.2em; text-transform:uppercase;
    color:#1C1509; background: linear-gradient(180deg, #FFD98A, #E8B54A); border:none; border-radius:22px;
    padding:12px 26px; opacity:0; pointer-events:none;
    box-shadow: 0 0 30px rgba(245,196,82,.45), 0 12px 24px rgba(0,0,0,.5);
  }
  #replay:hover { filter: brightness(1.08); }
  #replay.show { opacity:1; pointer-events:auto; }
</style>
</head>
<body>
  <div class="topbar">
    <div class="badge">TuFuturo Dual <i>·</i> Propuesta TCG v5</div>
    <button id="skip">Saltar →</button>
  </div>

  <div class="stage" id="stage">
    <div class="rays" id="rays"></div>
    <div id="vortex">
      <div class="ring r1"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" fill="none" stroke="rgba(245,196,82,.65)" stroke-width="1.5" stroke-dasharray="3 13" stroke-linecap="round"/></svg></div>
      <div class="ring r2"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="97" fill="none" stroke="rgba(196,165,90,.55)" stroke-width="1.5" stroke-dasharray="7 19" stroke-linecap="round"/></svg></div>
      <div class="ring r3"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="98" fill="none" stroke="rgba(245,196,82,.4)" stroke-width="1.5" stroke-dasharray="12 27" stroke-linecap="round"/></svg></div>
      <div id="core"></div>
      <div class="vlabel">Fusión</div>
    </div>
    <div id="pack">
      <div class="p-foil"></div>
      <div class="p-sheen"></div>
      <div class="p-inner">
        <svg width="64" height="72" viewBox="0 0 64 72">
          <rect x="6" y="16" width="40" height="50" rx="6" fill="none" stroke="rgba(139,115,64,.95)" stroke-width="2.5" transform="rotate(-9 26 41)"/>
          <rect x="20" y="8" width="40" height="50" rx="6" fill="rgba(245,196,82,.10)" stroke="#F5C452" stroke-width="1.8"/>
          <path d="M40 20 l5.5 9 10 3.5 -10 3.5 -5.5 9 -5.5 -9 -10 -3.5 10 -3.5 Z" fill="#F5C452"/>
        </svg>
        <div class="p-name">TuFuturo<br>Dual</div>
        <div class="p-line"></div>
        <div class="p-tag">25 cartas · 1 destino</div>
      </div>
    </div>
    <div id="hint">Tocá el sobre para abrirlo</div>
    <div class="reveal-wrap">
      <div id="reveal">
        <div class="glow"></div>
        <div class="ygo">
          <div class="shine"></div>
          <svg class="corners" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M8 24 V12 a4 4 0 0 1 4 -4 H24" fill="none" stroke="#F5C452" stroke-width="3" opacity=".85"/>
            <path d="M92 24 V12 a4 4 0 0 0 -4 -4 H76" fill="none" stroke="#F5C452" stroke-width="3" opacity=".85"/>
            <path d="M8 76 V88 a4 4 0 0 0 4 4 H24" fill="none" stroke="#F5C452" stroke-width="3" opacity=".85"/>
            <path d="M92 76 V88 a4 4 0 0 1 -4 4 H76" fill="none" stroke="#F5C452" stroke-width="3" opacity=".85"/>
          </svg>
          <div class="ynb">
            <span class="yn">El Forjador</span>
            <span class="ys"><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span></span>
          </div>
          <div class="yaf">
            <svg viewBox="0 0 300 190" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="forge" cx="50%" cy="66%" r="58%">
                  <stop offset="0%" stop-color="#FF9E4F" stop-opacity=".9"/>
                  <stop offset="42%" stop-color="#D9772B" stop-opacity=".38"/>
                  <stop offset="100%" stop-color="#1A1008" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#46566E"/>
                  <stop offset="45%" stop-color="#28334A"/>
                  <stop offset="100%" stop-color="#131B2A"/>
                </linearGradient>
              </defs>
              <rect width="300" height="190" fill="url(#forge)"/>
              <ellipse cx="150" cy="162" rx="116" ry="20" fill="rgba(255,158,79,.26)"/>
              <rect x="88" y="94" width="124" height="11" rx="2.5" fill="url(#steel)"/>
              <path d="M212 96 Q246 97 241 73 Q237 57 224 61 Q213 66 208 81 Z" fill="url(#steel)"/>
              <path d="M96 105 L204 105 L190 142 L110 142 Z" fill="url(#steel)"/>
              <path d="M116 142 L184 142 L179 151 L121 151 Z" fill="#0F141F"/>
              <rect x="82" y="151" width="136" height="12" rx="2.5" fill="url(#steel)"/>
              <circle cx="150" cy="123" r="13" fill="none" stroke="#F5C452" stroke-width="1.6" opacity=".85"/>
              <path d="M150 113 l5 8 h-10 z" fill="#F5C452" opacity=".9"/>
              <circle cx="88" cy="70" r="1.7" fill="#FFC37D"/>
              <circle cx="172" cy="60" r="1.4" fill="#FFC37D"/>
              <circle cx="138" cy="50" r="1.2" fill="#FF9E4F"/>
              <circle cx="104" cy="62" r="1.1" fill="#FFE0B2"/>
              <line x1="88" y1="70" x2="80" y2="61" stroke="#FFC37D" stroke-width="1" opacity=".7"/>
              <line x1="172" y1="60" x2="179" y2="51" stroke="#FFC37D" stroke-width="1" opacity=".7"/>
              <line x1="138" y1="50" x2="132" y2="42" stroke="#FF9E4F" stroke-width="1" opacity=".6"/>
            </svg>
            <div class="ag"></div>
          </div>
          <div class="ytb"><span>Monstruo · Efecto</span><span class="el">Tierra</span></div>
          <div class="yd">
            <div class="ef"><b>Forja</b><span class="fx"> — Fusiona 2 cartas de la mano para crear 1 carta más fuerte. Si el mazo del rival está a punto de vencerte, la forja siempre responde.</span></div>
          </div>
          <div class="fl" id="flavor"></div>
          <div class="ysb">
            <div class="ys2"><span class="v" id="atq">0</span><span class="l">ATQ</span></div>
            <div class="ys2"><span class="v" id="def">0</span><span class="l">DEF</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="flash"></div>
  <div id="actCap">Acto 1 — El sobre</div>
  <button id="replay">↻ Repetir el ritual</button>
  <canvas id="fx"></canvas>

<script>
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var stage = $('#stage'), fx = $('#fx'), ctx = fx.getContext('2d');
  var pack = $('#pack'), hint = $('#hint'), rays = $('#rays'), vortex = $('#vortex');
  var core = $('#core'), flash = $('#flash'), reveal = $('#reveal');
  var atqEl = $('#atq'), defEl = $('#def'), flavorEl = $('#flavor');
  var actCap = $('#actCap'), replay = $('#replay'), skip = $('#skip');
  var cardsWrap = document.createElement('div');
  cardsWrap.id = 'cardsWrap'; cardsWrap.style.cssText = 'position:absolute;inset:0;z-index:2;pointer-events:none;';
  stage.appendChild(cardsWrap);

  var W = 0, H = 0;
  function resize() { W = fx.width = window.innerWidth; H = fx.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();

  var COL = ['#C4A55A', '#60A5FA', '#FB923C', '#FDE047', '#4ADE80', '#C084FC'];
  var GOLD = '#F5C452', WHITE = '#FFF8E7';

  function sigil(kind, color) {
    var s = '<svg width="22" height="22" viewBox="0 0 24 24">';
    switch (kind) {
      case 'tierra':
        s += '<path d="M2 21 L12 7 L22 21 Z" fill="' + color + '"/>' +
             '<path d="M7 21 L12 13.5 L17 21 Z" fill="rgba(0,0,0,.38)"/>';
        break;
      case 'agua':
        s += '<path d="M12 2.5 C17.5 9 19.5 13 19.5 16.2 a7.5 7.5 0 1 1 -15 0 C4.5 13 6.5 9 12 2.5 Z" fill="' + color + '"/>';
        break;
      case 'fuego':
        s += '<path d="M12 2 C14 7 18.5 8.5 18.5 14 a6.5 6.5 0 1 1 -13 0 C5.5 10 9 8 12 2 Z" fill="' + color + '"/>' +
             '<circle cx="12" cy="15.5" r="3" fill="rgba(0,0,0,.4)"/>';
        break;
      case 'luz':
        s += '<circle cx="12" cy="12" r="4" fill="' + color + '"/>' +
             '<g stroke="' + color + '" stroke-width="2" stroke-linecap="round">' +
             '<path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>' +
             '<path d="M4.9 4.9l2.1 2.1"/><path d="M17 17l2.1 2.1"/><path d="M19.1 4.9L17 7"/><path d="M7 17l-2.1 2.1"/></g>';
        break;
      case 'viento':
        s += '<path d="M4 13 a7 7 0 1 1 7 7" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round"/>' +
             '<circle cx="16" cy="6" r="2.2" fill="' + color + '"/>';
        break;
      case 'oscuridad':
        s += '<path d="M16 3 a9 9 0 1 0 5 15 a7 7 0 1 1 -5 -15 Z" fill="' + color + '"/>';
        break;
    }
    return s + '</svg>';
  }

  var KEYS = ['tierra', 'agua', 'fuego', 'luz', 'viento', 'oscuridad'];
  var cards = [];

  function spawnCards() {
    for (var i = 0; i < 25; i++) {
      var k = KEYS[Math.floor(Math.random() * KEYS.length)];
      var c = COL[KEYS.indexOf(k)];
      var el = document.createElement('div');
      el.className = 'fly-card';
      el.style.setProperty('--cc', c);
      el.style.setProperty('--cg', 'rgba(' + hexRgb(c) + ',.35)');
      var frame = document.createElement('div');
      frame.className = 'fc-frame';
      frame.innerHTML = sigil(k, c);
      var sheen = document.createElement('div');
      sheen.className = 'fc-sheen';
      el.appendChild(frame); el.appendChild(sheen);
      cardsWrap.appendChild(el);
      cards.push(el);
    }
  }

  function hexRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
  }

  /* Pre-create all 25 cards at load (hidden) so timeline tweens target them.
     They were previously spawned at play time, AFTER the timeline was built,
     which left the tween target array empty and cards frozen at center. */
  spawnCards();
  gsap.set(cards, { autoAlpha: 0 });

  /* ---------- canvas particles ---------- */
  var parts = [];
  var orbitOn = false;
  function spawnBurst(n, cx, cy, colors, speed) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      parts.push({
        kind: 'burst', x: cx, y: cy, ang: a,
        v: speed + Math.random() * (speed * 0.8),
        life: 1, decay: 0.006 + Math.random() * 0.008,
        size: 1 + Math.random() * 1.8,
        col: colors[Math.floor(Math.random() * colors.length)],
        grav: 0.045
      });
    }
  }
  function spawnOrbit() {
    for (var i = 0; i < 90; i++) {
      parts.push({
        kind: 'orbit',
        ang: Math.random() * Math.PI * 2,
        rad: 70 + Math.random() * 130,
        spd: 0.02 + Math.random() * 0.07,
        size: 1 + Math.random() * 1.6,
        col: COL[Math.floor(Math.random() * COL.length)],
        life: 1, decay: 0.0015 + Math.random() * 0.002
      });
    }
  }
  var dust = [];
  for (var d = 0; d < 36; d++) {
    dust.push({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004, vy: (Math.random() - 0.5) * 0.0003,
      r: 0.5 + Math.random() * 1.1,
      a: 0.10 + Math.random() * 0.22,
      col: Math.random() < 0.7 ? 'rgba(245,196,82,' : 'rgba(232,222,168,'
    });
  }

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    var i;
    for (i = 0; i < dust.length; i++) {
      var p = dust[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.col + p.a + ')';
      ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (i = parts.length - 1; i >= 0; i--) {
      var q = parts[i];
      q.life -= q.decay;
      if (q.life <= 0) { parts.splice(i, 1); continue; }
      if (q.kind === 'burst') {
        q.x += Math.cos(q.ang) * q.v;
        q.y += Math.sin(q.ang) * q.v - q.grav;
        q.v *= 0.985;
        ctx.globalAlpha = Math.max(0, q.life);
        ctx.fillStyle = q.col;
        ctx.shadowColor = q.col; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(q.x, q.y, q.size, 0, 6.2832); ctx.fill();
      } else {
        q.ang += q.spd; q.rad -= 0.35;
        var x = W / 2 + Math.cos(q.ang) * q.rad;
        var y = H / 2 + Math.sin(q.ang) * q.rad;
        ctx.globalAlpha = Math.max(0, Math.min(1, q.life * 2));
        ctx.fillStyle = q.col;
        ctx.shadowColor = q.col; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(x, y, q.size, 0, 6.2832); ctx.fill();
      }
    }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  })();

  /* ---------- helpers ---------- */
  function setAct(t) { actCap.textContent = t; }
  function raysOn() {
    rays.classList.add('on');
    setTimeout(function () { rays.classList.add('off'); }, 1100);
  }
  function vortexOn() { vortex.classList.add('on'); orbitOn = true; spawnOrbit(); }
  function vortexOff() { vortex.classList.remove('on'); orbitOn = false; }
  function burstGold() { spawnBurst(90, W / 2, H / 2, [GOLD, WHITE, '#FFD98A'], 6); }
  function burstCard() { spawnBurst(46, W / 2, H / 2 - 30, [GOLD, WHITE], 4.5); }

  var statsObj = { atq: 0, def: 0 };
  function startStats() {
    gsap.to(statsObj, {
      atq: 92, def: 78, duration: 1.15, ease: 'power2.out',
      onUpdate: function () {
        atqEl.textContent = Math.round(statsObj.atq);
        defEl.textContent = Math.round(statsObj.def);
      }
    });
  }
  var flavorText = 'Donde otros ven escombros, él ve piezas sin ensamblar.';
  function typeFlavor() {
    var i = 0;
    var t = setInterval(function () {
      i++;
      flavorEl.textContent = flavorText.slice(0, i);
      if (i >= flavorText.length) clearInterval(t);
    }, 26);
  }
  function starsOn() {
    gsap.fromTo('.ys .star', { scale: 0, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.34, ease: 'back.out(2.6)', stagger: 0.16
    });
  }
  function effectUp() {
    gsap.fromTo('.ef b', { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo('.ef .fx', { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.16 });
  }
  function glowPulse() {
    gsap.fromTo('.glow', { opacity: 0 }, { opacity: 0.85, duration: 1.1, ease: 'sine.out' });
    gsap.to('.glow', { opacity: 0.5, duration: 1.7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.2 });
  }
  function shineOn() { document.querySelector('.shine').classList.add('on'); }
  function showReplay() { replay.classList.add('show'); }

  function finalize() {
    gsap.killTweensOf('*');
    clearInterval(window._typeTimer);
    document.querySelectorAll('.fly-card').forEach(function (c) { c.style.display = 'none'; });
    pack.style.display = 'none'; hint.style.display = 'none';
    vortex.classList.remove('on'); orbitOn = false;
    flash.style.opacity = '0';
    reveal.style.display = 'block';
    gsap.set(reveal, { scale: 1, y: 0, autoAlpha: 1 });
    atqEl.textContent = '92'; defEl.textContent = '78';
    flavorEl.textContent = flavorText;
    gsap.set('.ys .star', { scale: 1, opacity: 1 });
    gsap.set('.ef b, .ef .fx', { autoAlpha: 1, y: 0 });
    document.querySelector('.shine').classList.add('on');
    gsap.set('.glow', { opacity: 0.5 });
    setAct('Tu arquetipo — El Forjador');
    showReplay();
  }
  skip.addEventListener('click', finalize);
  replay.addEventListener('click', function () { location.reload(); });

  /* ---------- timeline ---------- */
  var pulse = gsap.to(pack, { scale: 1.045, duration: 1.05, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  pack.addEventListener('click', function () {
    if (window._started) return;
    window._started = true;
    pack.style.cursor = 'default';
    gsap.killTweensOf(pack);

    var tl = gsap.timeline({ defaults: { ease: 'power1.in' } });

    tl.to(pack, { rotation: -5, duration: 0.07 })
      .to(pack, { rotation: 4, duration: 0.07 })
      .to(pack, { rotation: -3, duration: 0.07 })
      .to(pack, { rotation: 2, duration: 0.07 })
      .add(function () {
        setAct('Acto 2 — Las 25 cartas');
        raysOn(); burstGold();
        gsap.to(hint, { autoAlpha: 0, duration: 0.4 });
      })
      .to(pack, { scale: 2.4, rotation: 14, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, '<')
      .fromTo(cards, {
        x: 0, y: 0, scale: 0.25, rotation: 0, autoAlpha: 0
      }, {
        x: function () { return gsap.utils.random(-540, 540); },
        y: function () { return gsap.utils.random(-330, 330); },
        rotation: function () { return gsap.utils.random(-200, 200); },
        scale: 1, autoAlpha: 1, duration: 0.85, ease: 'back.out(1.25)',
        stagger: { each: 0.035, from: 'random' }
      }, '<+0.12')
      .to(cards, {
        x: 0, y: 0, scale: 0.03, autoAlpha: 0, rotation: '+=1260',
        duration: 1.8, ease: 'power2.in',
        stagger: { each: 0.02, from: 'random' }
      }, '+=0.45')
      .add(function () { vortexOn(); setAct('Acto 3 — La fusión'); }, '<')
      .add(function () {}, '+=0.6')
      .add(function () { setAct('Acto 4 — El destello'); })
      .to(flash, { autoAlpha: 1, duration: 0.12 })
      .to(flash, { autoAlpha: 0, duration: 0.62, ease: 'power2.out' }, '+=0.16')
      .add(function () { vortexOff(); }, '<')
      .set(reveal, { display: 'block' })
      .fromTo(reveal, { scale: 0.5, y: 130, autoAlpha: 0 }, {
        scale: 1, y: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.45)'
      }, '+=0.1')
      .add(function () { setAct('Acto 5 — El forjador'); burstCard(); glowPulse(); shineOn(); }, '<+0.1')
      .add(function () { startStats(); starsOn(); typeFlavor(); effectUp(); }, '+=0.55')
      .add(function () { setAct('Tu arquetipo — El Forjador'); showReplay(); }, '+=1.7');
  });
})();
</script>
</body>
</html>
`;

const out = path.join(__dirname, 'propuesta-tcg-v5-animacion.html');
fs.writeFileSync(out, html, 'utf8');
console.log('Written: ' + html.length + ' chars to ' + out);