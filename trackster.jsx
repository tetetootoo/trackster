import { useState, useEffect, useCallback, useRef } from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #08080f;
      --bg2:      #0d0d18;
      --bg3:      #12121f;
      --border:   rgba(255,255,255,0.06);
      --border2:  rgba(99,102,241,0.3);
      --indigo:   #6366f1;
      --indigo2:  #818cf8;
      --indigo3:  #4f46e5;
      --white:    #f0f0f8;
      --muted:    rgba(240,240,248,0.4);
      --muted2:   rgba(240,240,248,0.18);
      --green:    #22c55e;
      --red:      #f43f5e;
      --amber:    #f59e0b;
      --mono:     'DM Mono', monospace;
      --sans:     'Syne', sans-serif;
    }

    html, body { background: var(--bg); color: var(--white); font-family: var(--mono); min-height: 100vh; }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--indigo3); border-radius: 2px; }

    .app-root {
      display: flex;
      min-height: 100vh;
      background: var(--bg);
      position: relative;
      overflow: hidden;
    }

    /* noise overlay */
    .app-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      background-repeat: repeat;
      background-size: 200px;
      pointer-events: none;
      z-index: 0;
      opacity: 0.6;
    }

    /* dot grid */
    .app-root::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
      z-index: 0;
    }

    /* ── SIDEBAR ── */
    .sidebar {
      width: 220px;
      min-height: 100vh;
      background: var(--bg2);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 0;
      position: relative;
      z-index: 10;
      flex-shrink: 0;
    }

    .sidebar-logo {
      padding: 28px 24px 20px;
      border-bottom: 1px solid var(--border);
    }

    .logo-wordmark {
      font-family: var(--sans);
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: var(--white);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-dot {
      width: 8px; height: 8px;
      background: var(--indigo);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--indigo);
      flex-shrink: 0;
    }

    .logo-sub {
      font-size: 10px;
      color: var(--muted);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-section-label {
      font-size: 9px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: var(--muted2);
      padding: 12px 12px 6px;
      font-family: var(--mono);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      font-size: 13px;
      color: var(--muted);
      border: 1px solid transparent;
      font-family: var(--mono);
      background: none;
      width: 100%;
      text-align: left;
    }

    .nav-item:hover {
      background: rgba(99,102,241,0.08);
      color: var(--white);
      border-color: var(--border);
    }

    .nav-item.active {
      background: rgba(99,102,241,0.15);
      color: var(--indigo2);
      border-color: rgba(99,102,241,0.25);
    }

    .nav-icon { font-size: 15px; width: 18px; text-align: center; flex-shrink: 0; }

    .sidebar-footer {
      padding: 16px 12px;
      border-top: 1px solid var(--border);
    }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: rgba(255,255,255,0.04);
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    .user-avatar {
      width: 28px; height: 28px;
      background: linear-gradient(135deg, var(--indigo3), var(--indigo2));
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      font-family: var(--sans);
      color: white;
      flex-shrink: 0;
    }

    .user-name { font-size: 12px; color: var(--white); font-family: var(--mono); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .user-role { font-size: 10px; color: var(--muted); }

    .logout-btn {
      background: none; border: none; cursor: pointer;
      color: var(--muted); font-size: 14px; padding: 2px;
      transition: color 0.15s;
    }
    .logout-btn:hover { color: var(--red); }

    /* ── MAIN CONTENT ── */
    .main {
      flex: 1;
      min-height: 100vh;
      overflow-y: auto;
      position: relative;
      z-index: 5;
    }

    .page-header {
      padding: 32px 36px 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 28px;
      padding-bottom: 24px;
    }

    .page-title {
      font-family: var(--sans);
      font-size: 26px;
      font-weight: 700;
      color: var(--white);
      letter-spacing: -0.5px;
    }

    .page-subtitle { font-size: 13px; color: var(--muted); margin-top: 4px; }

    .page-body { padding: 0 36px 40px; }

    /* ── CARDS ── */
    .card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px 24px;
      transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
    }

    .card:hover { border-color: rgba(99,102,241,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.4); transform: translateY(-1px); }

    .card-label {
      font-size: 10px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: var(--muted2);
      margin-bottom: 8px;
    }

    .card-value {
      font-family: var(--mono);
      font-size: 28px;
      font-weight: 500;
      color: var(--white);
      letter-spacing: -0.5px;
    }

    .card-sub { font-size: 12px; color: var(--muted); margin-top: 4px; }

    /* ── STAT GRID ── */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px;
      margin-bottom: 28px;
    }

    .stat-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 20px;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: var(--indigo);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .stat-card:hover::before { opacity: 1; }
    .stat-card:hover { border-color: rgba(99,102,241,0.25); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); }

    .stat-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted2); margin-bottom: 10px; }
    .stat-value { font-size: 22px; font-family: var(--mono); font-weight: 500; color: var(--white); }
    .stat-meta { font-size: 11px; color: var(--muted); margin-top: 6px; }

    /* ── BADGE ── */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 500;
    }

    .badge-green { background: rgba(34,197,94,0.12); color: var(--green); border: 1px solid rgba(34,197,94,0.25); }
    .badge-grey { background: rgba(255,255,255,0.06); color: var(--muted); border: 1px solid var(--border); }
    .badge-indigo { background: rgba(99,102,241,0.15); color: var(--indigo2); border: 1px solid rgba(99,102,241,0.3); }

    .status-dot {
      width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
    }

    .dot-green { background: var(--green); box-shadow: 0 0 8px var(--green); animation: pulse-green 2s infinite; }
    .dot-grey { background: #666; }

    @keyframes pulse-green {
      0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--green); }
      50% { opacity: 0.6; box-shadow: 0 0 4px var(--green); }
    }

    /* ── BUTTONS ── */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 9px 18px;
      border-radius: 8px;
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      border: 1px solid transparent;
      letter-spacing: 0.3px;
    }

    .btn-primary {
      background: var(--indigo);
      color: white;
      border-color: var(--indigo);
    }
    .btn-primary:hover { background: var(--indigo2); border-color: var(--indigo2); box-shadow: 0 0 20px rgba(99,102,241,0.4); }

    .btn-ghost {
      background: rgba(255,255,255,0.04);
      color: var(--muted);
      border-color: var(--border);
    }
    .btn-ghost:hover { background: rgba(255,255,255,0.08); color: var(--white); border-color: rgba(255,255,255,0.15); }

    .btn-danger {
      background: rgba(244,63,94,0.1);
      color: var(--red);
      border-color: rgba(244,63,94,0.25);
    }
    .btn-danger:hover { background: rgba(244,63,94,0.2); box-shadow: 0 0 16px rgba(244,63,94,0.2); }

    .btn-sm { padding: 5px 11px; font-size: 11px; border-radius: 6px; }

    .btn:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ── FORM ── */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group.full { grid-column: 1 / -1; }

    .form-label {
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted2);
    }

    .form-input, .form-select, .form-textarea {
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 14px;
      color: var(--white);
      font-family: var(--mono);
      font-size: 13px;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: rgba(99,102,241,0.5);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    }

    .form-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(240,240,248,0.4)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 14px; padding-right: 36px; }

    .form-select option { background: var(--bg3); color: var(--white); }

    .form-textarea { resize: vertical; min-height: 80px; }

    /* ── FILE UPLOAD ── */
    .file-drop {
      border: 1px dashed rgba(99,102,241,0.3);
      border-radius: 10px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(99,102,241,0.03);
    }

    .file-drop:hover { border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.07); }
    .file-drop.has-file { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.04); }

    .file-drop-icon { font-size: 28px; margin-bottom: 8px; opacity: 0.6; }
    .file-drop-text { font-size: 12px; color: var(--muted); }
    .file-drop-hint { font-size: 10px; color: var(--muted2); margin-top: 4px; }

    /* ── TABLE ── */
    .data-table { width: 100%; border-collapse: collapse; }

    .data-table th {
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted2);
      padding: 8px 14px;
      text-align: left;
      border-bottom: 1px solid var(--border);
      font-family: var(--mono);
      font-weight: 400;
    }

    .data-table th.right { text-align: right; }

    .data-table td {
      padding: 11px 14px;
      font-size: 12px;
      color: var(--white);
      border-bottom: 1px solid rgba(255,255,255,0.03);
      font-family: var(--mono);
      vertical-align: middle;
    }

    .data-table td.right { text-align: right; font-variant-numeric: tabular-nums; }
    .data-table td.muted { color: var(--muted); }

    .data-table tr:hover td { background: rgba(255,255,255,0.02); }

    .data-table tr:last-child td { border-bottom: none; }

    /* ── VAT SUMMARY TABLE ── */
    .vat-table-wrap {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    .vat-section-header {
      padding: 10px 18px;
      background: rgba(99,102,241,0.06);
      border-bottom: 1px solid var(--border);
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--indigo2);
      font-family: var(--mono);
    }

    .net-row td {
      background: rgba(99,102,241,0.08) !important;
      border-top: 1px solid rgba(99,102,241,0.25) !important;
    }

    .net-row .net-label {
      font-family: var(--sans);
      font-weight: 700;
      color: var(--white);
      font-size: 14px;
    }

    .net-row .net-value {
      font-size: 20px;
      font-family: var(--mono);
      font-weight: 500;
    }

    .net-positive { color: var(--red); }
    .net-negative { color: var(--green); }

    /* ── COPY BUTTON ── */
    .copy-btn {
      background: none;
      border: 1px solid var(--border);
      border-radius: 5px;
      color: var(--muted);
      padding: 2px 7px;
      font-size: 10px;
      cursor: pointer;
      font-family: var(--mono);
      transition: all 0.15s;
      margin-left: 8px;
    }

    .copy-btn:hover { border-color: var(--indigo); color: var(--indigo2); }
    .copy-btn.copied { border-color: var(--green); color: var(--green); }

    /* ── LOGIN SCREEN ── */
    .login-root {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg);
      position: relative;
      overflow: hidden;
    }

    .login-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: radial-gradient(circle at 30% 40%, rgba(99,102,241,0.12) 0%, transparent 60%),
                        radial-gradient(circle at 75% 70%, rgba(79,70,229,0.08) 0%, transparent 50%);
      pointer-events: none;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 40px;
      position: relative;
      z-index: 2;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    }

    .login-logo {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-wordmark {
      font-family: var(--sans);
      font-size: 32px;
      font-weight: 800;
      color: var(--white);
      letter-spacing: -1px;
    }

    .login-wordmark span { color: var(--indigo); }

    .login-tagline {
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .login-tabs {
      display: flex;
      gap: 4px;
      background: var(--bg3);
      border-radius: 8px;
      padding: 4px;
      margin-bottom: 24px;
    }

    .login-tab {
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: 12px;
      font-family: var(--mono);
      cursor: pointer;
      border-radius: 5px;
      transition: all 0.15s;
      color: var(--muted);
      border: none;
      background: none;
    }

    .login-tab.active { background: var(--bg2); color: var(--white); border: 1px solid var(--border); }

    .login-error {
      background: rgba(244,63,94,0.1);
      border: 1px solid rgba(244,63,94,0.25);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      color: var(--red);
      margin-bottom: 16px;
    }

    .login-success {
      background: rgba(34,197,94,0.1);
      border: 1px solid rgba(34,197,94,0.25);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 12px;
      color: var(--green);
      margin-bottom: 16px;
    }

    /* ── ENTRIES ── */
    .entry-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 10px;
      margin-bottom: 8px;
      transition: all 0.15s;
    }

    .entry-row:hover { border-color: rgba(99,102,241,0.2); background: rgba(99,102,241,0.04); }

    .entry-cat-badge {
      width: 28px; height: 28px;
      background: rgba(99,102,241,0.15);
      border: 1px solid rgba(99,102,241,0.3);
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--indigo2);
      flex-shrink: 0;
      font-family: var(--sans);
    }

    .entry-desc { flex: 1; font-size: 13px; color: var(--white); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .entry-date { font-size: 11px; color: var(--muted); white-space: nowrap; }
    .entry-amount { font-size: 14px; font-weight: 500; color: var(--white); white-space: nowrap; font-variant-numeric: tabular-nums; }

    .receipt-thumb {
      width: 28px; height: 28px;
      background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 5px;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.15s;
    }
    .receipt-thumb:hover { background: rgba(99,102,241,0.25); border-color: var(--indigo); }

    /* ── FILTER BAR ── */
    .filter-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-select {
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 7px 12px;
      color: var(--white);
      font-family: var(--mono);
      font-size: 12px;
      outline: none;
      cursor: pointer;
    }

    /* ── PERIOD CARD ── */
    .period-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 20px 24px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.2s;
    }

    .period-card:hover { border-color: rgba(99,102,241,0.2); }
    .period-card-info { flex: 1; }
    .period-card-name { font-family: var(--sans); font-size: 15px; font-weight: 600; color: var(--white); }
    .period-card-dates { font-size: 11px; color: var(--muted); margin-top: 4px; }

    /* ── TOAST ── */
    .toast-container {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .toast {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 18px;
      font-size: 13px;
      color: var(--white);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideIn 0.25s ease;
      min-width: 240px;
    }

    .toast-success { border-color: rgba(34,197,94,0.3); }
    .toast-error { border-color: rgba(244,63,94,0.3); }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    /* ── DIVIDER ── */
    .divider { height: 1px; background: var(--border); margin: 20px 0; }

    /* ── MODAL ── */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      padding: 24px;
    }

    .modal {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 32px 80px rgba(0,0,0,0.7);
      position: relative;
    }

    .modal-title {
      font-family: var(--sans);
      font-size: 18px;
      font-weight: 700;
      color: var(--white);
      margin-bottom: 16px;
    }

    /* ── EMPTY STATE ── */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--muted);
    }

    .empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.4; }
    .empty-title { font-family: var(--sans); font-size: 16px; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
    .empty-text { font-size: 12px; }

    /* ── SECTIONS ── */
    .section-title {
      font-family: var(--sans);
      font-size: 13px;
      font-weight: 600;
      color: var(--white);
      letter-spacing: 0.3px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-line { flex: 1; height: 1px; background: var(--border); }

    /* ── EXPORT PAGE ── */
    .export-category-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 10px;
      transition: all 0.2s;
    }

    .export-category-card:hover { border-color: rgba(99,102,241,0.2); }

    .export-cat-badge {
      width: 36px; height: 36px;
      background: rgba(99,102,241,0.15);
      border: 1px solid rgba(99,102,241,0.3);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
      font-weight: 800;
      color: var(--indigo2);
      font-family: var(--sans);
      flex-shrink: 0;
    }

    .export-info { flex: 1; }
    .export-cat-name { font-size: 13px; color: var(--white); }
    .export-cat-meta { font-size: 11px; color: var(--muted); margin-top: 3px; }

    /* ── NET VAT BANNER ── */
    .net-banner {
      background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(79,70,229,0.08));
      border: 1px solid rgba(99,102,241,0.3);
      border-radius: 14px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .net-banner-label {
      font-family: var(--sans);
      font-size: 13px;
      font-weight: 600;
      color: var(--indigo2);
      letter-spacing: 0.3px;
    }

    .net-banner-formula { font-size: 11px; color: var(--muted); margin-top: 3px; }

    .net-banner-value {
      font-family: var(--mono);
      font-size: 32px;
      font-weight: 500;
      letter-spacing: -1px;
    }

    /* ── RESPONSIVE TWEAKS ── */
    @media (max-width: 768px) {
      .sidebar { width: 64px; }
      .nav-item span, .logo-sub, .user-name, .user-role, .nav-section-label, .logo-wordmark-text { display: none; }
      .page-body, .page-header { padding-left: 20px; padding-right: 20px; }
    }
  `}</style>
);

// ─── VAT CATEGORIES ───────────────────────────────────────────────────────────
const VAT_CATEGORIES = [
  { code: "A", label: "Moms af varesalg og ydelser", group: "output", desc: "Standard rate sales VAT (25%)" },
  { code: "B", label: "Moms af EU-varekøb", group: "output", desc: "Acquisition VAT on EU goods" },
  { code: "C", label: "Moms af køb af ydelser fra udlandet", group: "output", desc: "Reverse charge services" },
  { code: "D", label: "Købsmoms", group: "input", desc: "Standard input VAT on purchases" },
  { code: "E", label: "Importmoms", group: "input", desc: "Import VAT" },
  { code: "F", label: "Varesalg til andre EU-lande", group: "eu", desc: "EU sales (0% VAT, reportable)" },
  { code: "G", label: "Salg af varer til lande uden for EU", group: "eu", desc: "Exports outside EU" },
  { code: "H", label: "Køb af varer fra andre EU-lande", group: "eu", desc: "EU acquisitions" },
  { code: "I", label: "Salg af ydelser til andre EU-lande", group: "eu", desc: "EU service sales" },
  { code: "J", label: "Køb af ydelser fra andre EU-lande", group: "eu", desc: "EU service purchases (reverse charge)" },
  { code: "K", label: "Moms af oliebrændsel og afgiftspligtige brændstoffer", group: "oil", desc: "Oil/Gas VAT" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0) + " kr";
const fmtShort = (n) => new Intl.NumberFormat("da-DK", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0);

function getPeriodLabel(period) {
  if (!period) return "";
  const start = new Date(period.start);
  const end = new Date(period.end);
  const opts = { month: "short", year: "numeric" };
  return `${start.toLocaleDateString("da-DK", opts)} – ${end.toLocaleDateString("da-DK", opts)}`;
}

function genPeriodId() {
  return "p_" + Date.now();
}

function makePeriod(type, startDate) {
  const start = new Date(startDate);
  const end = new Date(start);
  if (type === "quarterly") {
    end.setMonth(end.getMonth() + 3);
    end.setDate(end.getDate() - 1);
  } else {
    end.setFullYear(end.getFullYear() + 1);
    end.setDate(end.getDate() - 1);
  }
  return {
    id: genPeriodId(),
    type,
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
    status: "active",
    createdAt: new Date().toISOString(),
  };
}

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
const hasNativeStorage = () => typeof window !== "undefined" && window.storage && typeof window.storage.get === "function";

async function storageGet(key) {
  try {
    if (hasNativeStorage()) {
      const r = await window.storage.get(key);
      return r ? JSON.parse(r.value) : null;
    }
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

async function storageSet(key, val) {
  try {
    if (hasNativeStorage()) {
      await window.storage.set(key, JSON.stringify(val));
    } else {
      localStorage.setItem(key, JSON.stringify(val));
    }
    return true;
  } catch { return false; }
}

async function storageList(prefix) {
  try {
    if (hasNativeStorage()) {
      const r = await window.storage.list(prefix);
      return r ? r.keys : [];
    }
    return Object.keys(localStorage).filter(k => k.startsWith(prefix));
  } catch { return []; }
}

async function storageDelete(key) {
  try {
    if (hasNativeStorage()) {
      await window.storage.delete(key);
    } else {
      localStorage.removeItem(key);
    }
    return true;
  } catch { return false; }
}

// ─── AUTH HELPERS ─────────────────────────────────────────────────────────────
async function getUsers() {
  return (await storageGet("auth:users")) || {};
}

async function saveUsers(users) {
  return storageSet("auth:users", users);
}

async function authenticate(username, password) {
  const users = await getUsers();
  const u = users[username.toLowerCase()];
  if (!u) return { ok: false, error: "User not found" };
  if (u.password !== password) return { ok: false, error: "Incorrect password" };
  return { ok: true, user: { username: u.username, periodType: u.periodType } };
}

async function register(username, password, periodType) {
  if (!username || username.length < 2) return { ok: false, error: "Username must be at least 2 characters" };
  if (!password || password.length < 4) return { ok: false, error: "Password must be at least 4 characters" };
  const users = await getUsers();
  const key = username.toLowerCase();
  if (users[key]) return { ok: false, error: "Username already taken" };
  users[key] = { username, password, periodType: periodType || "quarterly" };
  await saveUsers(users);
  return { ok: true, user: { username, periodType } };
}

// ─── ENTRIES HELPERS ──────────────────────────────────────────────────────────
async function getEntries(username, periodId) {
  return (await storageGet(`entries:${username}:${periodId}`)) || [];
}

async function saveEntries(username, periodId, entries) {
  return storageSet(`entries:${username}:${periodId}`, entries);
}

async function getPeriods(username) {
  return (await storageGet(`periods:${username}`)) || [];
}

async function savePeriods(username, periods) {
  return storageSet(`periods:${username}`, periods);
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username: "", password: "", confirm: "", periodType: "quarterly" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleLogin() {
    setError(""); setLoading(true);
    const r = await authenticate(form.username, form.password);
    setLoading(false);
    if (!r.ok) return setError(r.error);
    onLogin(r.user);
  }

  async function handleRegister() {
    setError(""); setSuccess("");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true);
    const r = await register(form.username, form.password, form.periodType);
    setLoading(false);
    if (!r.ok) return setError(r.error);
    setSuccess("Account created! You can now log in.");
    setTab("login");
  }

  const handleKey = (fn) => (e) => e.key === "Enter" && fn();

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-wordmark">track<span>ster</span></div>
          <div className="login-tagline">Danish VAT / MOMS Tracking</div>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>Sign In</button>
          <button className={`login-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); setError(""); setSuccess(""); }}>Register</button>
        </div>

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        {tab === "login" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" value={form.username} onChange={set("username")} onKeyDown={handleKey(handleLogin)} placeholder="your_username" autoComplete="username" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={set("password")} onKeyDown={handleKey(handleLogin)} placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 6 }} onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" value={form.username} onChange={set("username")} placeholder="choose_username" autoComplete="username" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" autoComplete="new-password" />
            </div>
            <div className="form-group">
              <label className="form-label">VAT Period Type</label>
              <select className="form-select" value={form.periodType} onChange={set("periodType")}>
                <option value="quarterly">Quarterly (3 months)</option>
                <option value="annual">Annual (12 months)</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 6 }} onClick={handleRegister} disabled={loading}>
              {loading ? "Creating…" : "Create Account →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ user, currentPeriod, entries, periods, onNavigate }) {
  const [copied, setCopied] = useState(null);

  const totals = {};
  VAT_CATEGORIES.forEach(c => {
    totals[c.code] = entries.filter(e => e.category === c.code).reduce((s, e) => s + Number(e.amount || 0), 0);
  });

  const outputVAT = (totals.A || 0) + (totals.B || 0) + (totals.C || 0);
  const inputVAT = (totals.D || 0) + (totals.E || 0);
  const netVAT = outputVAT - inputVAT;
  const totalEntries = entries.length;

  function copyVal(code, val) {
    navigator.clipboard.writeText(fmtShort(val)).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  const groups = [
    { label: "Udgående Moms (Output VAT)", codes: ["A", "B", "C"], color: "#f43f5e" },
    { label: "Indgående Moms (Input VAT)", codes: ["D", "E"], color: "#22c55e" },
    { label: "EU & International", codes: ["F", "G", "H", "I", "J"], color: "#6366f1" },
    { label: "Olie / Brændstoffer", codes: ["K"], color: "#f59e0b" },
  ];

  return (
    <>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">VAT summary for current period</p>
          </div>
          {currentPeriod && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className={`badge ${currentPeriod.status === "active" ? "badge-green" : "badge-grey"}`}>
                <span className={`status-dot ${currentPeriod.status === "active" ? "dot-green" : "dot-grey"}`} />
                {currentPeriod.status === "active" ? "Active Period" : "Closed"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="page-body">
        {!currentPeriod ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <div className="empty-title">No active period</div>
            <div className="empty-text">Go to Periods to create your first VAT period.</div>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => onNavigate("periods")}>Create Period →</button>
          </div>
        ) : (
          <>
            {/* Period info */}
            <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
              <div className="stat-card" style={{ flex: 1, minWidth: 180 }}>
                <div className="stat-label">Period</div>
                <div className="stat-value" style={{ fontSize: 16, fontFamily: "var(--sans)", fontWeight: 600 }}>{getPeriodLabel(currentPeriod)}</div>
                <div className="stat-meta">{currentPeriod.type === "quarterly" ? "Quarterly" : "Annual"}</div>
              </div>
              <div className="stat-card" style={{ flex: 1, minWidth: 180 }}>
                <div className="stat-label">Total Entries</div>
                <div className="stat-value">{totalEntries}</div>
                <div className="stat-meta">recorded transactions</div>
              </div>
              <div className="stat-card" style={{ flex: 1, minWidth: 180 }}>
                <div className="stat-label">Output VAT</div>
                <div className="stat-value" style={{ fontSize: 16, color: "var(--red)" }}>{fmt(outputVAT)}</div>
                <div className="stat-meta">A + B + C</div>
              </div>
              <div className="stat-card" style={{ flex: 1, minWidth: 180 }}>
                <div className="stat-label">Input VAT</div>
                <div className="stat-value" style={{ fontSize: 16, color: "var(--green)" }}>{fmt(inputVAT)}</div>
                <div className="stat-meta">D + E</div>
              </div>
            </div>

            {/* Net VAT */}
            <div className="net-banner">
              <div>
                <div className="net-banner-label">Net Moms Payable (Momstilsvar)</div>
                <div className="net-banner-formula">(A + B + C) − (D + E)</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div className={`net-banner-value ${netVAT >= 0 ? "net-positive" : "net-negative"}`}>
                  {fmt(netVAT)}
                </div>
                <button className={`copy-btn ${copied === "NET" ? "copied" : ""}`} onClick={() => copyVal("NET", netVAT)}>
                  {copied === "NET" ? "✓" : "copy"}
                </button>
              </div>
            </div>

            {/* Category tables */}
            {groups.map(g => (
              <div key={g.label} className="vat-table-wrap" style={{ marginBottom: 20 }}>
                <div className="vat-section-header" style={{ color: g.color }}>{g.label}</div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>Field</th>
                      <th>Description</th>
                      <th className="right">Entries</th>
                      <th className="right">Total (DKK)</th>
                      <th style={{ width: 80 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.codes.map(code => {
                      const cat = VAT_CATEGORIES.find(c => c.code === code);
                      const total = totals[code] || 0;
                      const count = entries.filter(e => e.category === code).length;
                      return (
                        <tr key={code}>
                          <td>
                            <span style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 5, padding: "2px 7px", fontSize: 11, fontWeight: 700, color: "var(--indigo2)", fontFamily: "var(--sans)" }}>
                              {code}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontSize: 12, color: "var(--white)" }}>{cat.label}</div>
                            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{cat.desc}</div>
                          </td>
                          <td className="right muted">{count}</td>
                          <td className="right" style={{ fontWeight: 500, color: total > 0 ? "var(--white)" : "var(--muted)" }}>{fmt(total)}</td>
                          <td>
                            <button className={`copy-btn ${copied === code ? "copied" : ""}`} onClick={() => copyVal(code, total)}>
                              {copied === code ? "✓ copied" : "copy"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-primary" onClick={() => onNavigate("new-entry")}>+ New Entry</button>
              <button className="btn btn-ghost" onClick={() => onNavigate("export")}>↓ Export Receipts</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── NEW ENTRY PAGE ───────────────────────────────────────────────────────────
function NewEntryPage({ user, currentPeriod, onSave, toast }) {
  const [form, setForm] = useState({
    category: "A",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    file: null,
    fileName: "",
    fileType: "",
  });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, file: ev.target.result, fileName: file.name, fileType: file.type }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!form.description || !form.amount || !form.date) {
      toast("Please fill in all required fields", "error");
      return;
    }
    setSaving(true);
    await onSave({
      id: "e_" + Date.now(),
      category: form.category,
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
      file: form.file,
      fileName: form.fileName,
      fileType: form.fileType,
      createdAt: new Date().toISOString(),
    });
    setSaving(false);
    setForm({ category: "A", description: "", amount: "", date: new Date().toISOString().split("T")[0], file: null, fileName: "", fileType: "" });
    toast("Entry saved successfully");
  }

  if (!currentPeriod) {
    return (
      <div className="page-body" style={{ paddingTop: 40 }}>
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-title">No active period</div>
          <div className="empty-text">Create a VAT period first before adding entries.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">New Entry</h1>
        <p className="page-subtitle">Log a VAT transaction for {getPeriodLabel(currentPeriod)}</p>
      </div>
      <div className="page-body">
        <div className="card" style={{ maxWidth: 680 }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">VAT Category *</label>
              <select className="form-select" value={form.category} onChange={set("category")}>
                {VAT_CATEGORIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} – {c.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" value={form.date} onChange={set("date")} />
            </div>
            <div className="form-group full">
              <label className="form-label">Description *</label>
              <input className="form-input" value={form.description} onChange={set("description")} placeholder="e.g. Office supplies – Kontorforsyninger A/S" />
            </div>
            <div className="form-group">
              <label className="form-label">VAT Amount (DKK) *</label>
              <input className="form-input" type="number" step="0.01" min="0" value={form.amount} onChange={set("amount")} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Category Info</label>
              <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 11, color: "var(--muted)", lineHeight: 1.5 }}>
                {VAT_CATEGORIES.find(c => c.code === form.category)?.desc}
              </div>
            </div>
            <div className="form-group full">
              <label className="form-label">Invoice / Receipt (optional)</label>
              <div
                className={`file-drop ${form.file ? "has-file" : ""}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setForm(f => ({ ...f, file: ev.target.result, fileName: file.name, fileType: file.type }));
                    reader.readAsDataURL(file);
                  }
                }}
              >
                {form.file ? (
                  <>
                    <div className="file-drop-icon">✅</div>
                    <div className="file-drop-text" style={{ color: "var(--green)" }}>{form.fileName}</div>
                    <div className="file-drop-hint">Click to replace</div>
                  </>
                ) : (
                  <>
                    <div className="file-drop-icon">📎</div>
                    <div className="file-drop-text">Drop file or click to upload</div>
                    <div className="file-drop-hint">PDF, JPEG, PNG — stored securely</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} style={{ display: "none" }} />
              {form.file && (
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, alignSelf: "flex-start" }} onClick={() => setForm(f => ({ ...f, file: null, fileName: "", fileType: "" }))}>
                  ✕ Remove file
                </button>
              )}
            </div>
          </div>

          <div className="divider" />

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "✓ Save Entry"}
            </button>
            <button className="btn btn-ghost" onClick={() => setForm({ category: "A", description: "", amount: "", date: new Date().toISOString().split("T")[0], file: null, fileName: "", fileType: "" })}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── ENTRIES PAGE ─────────────────────────────────────────────────────────────
function EntriesPage({ entries, periods, currentPeriod, onDelete, toast }) {
  const [filterCat, setFilterCat] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState(currentPeriod?.id || "all");
  const [previewEntry, setPreviewEntry] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const allPeriods = [...periods].sort((a, b) => new Date(b.start) - new Date(a.start));

  const filtered = entries.filter(e => {
    if (filterCat !== "all" && e.category !== filterCat) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Entries</h1>
        <p className="page-subtitle">{filtered.length} entries · {fmt(filtered.reduce((s, e) => s + Number(e.amount || 0), 0))} total</p>
      </div>

      <div className="page-body">
        <div className="filter-bar">
          <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="all">All categories</option>
            {VAT_CATEGORIES.map(c => <option key={c.code} value={c.code}>{c.code} – {c.label.substring(0, 30)}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗂</div>
            <div className="empty-title">No entries found</div>
            <div className="empty-text">Add entries from the New Entry page.</div>
          </div>
        ) : (
          filtered.map(e => {
            const cat = VAT_CATEGORIES.find(c => c.code === e.category);
            return (
              <div key={e.id} className="entry-row">
                <div className="entry-cat-badge">{e.category}</div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div className="entry-desc">{e.description}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{cat?.label}</div>
                </div>
                <div className="entry-date">{e.date}</div>
                <div className="entry-amount">{fmt(e.amount)}</div>
                {e.file ? (
                  <div className="receipt-thumb" title={e.fileName} onClick={() => setPreviewEntry(e)}>
                    {e.fileType?.includes("pdf") ? "📄" : "🖼"}
                  </div>
                ) : (
                  <div style={{ width: 28, flexShrink: 0 }} />
                )}
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(e)}>✕</button>
              </div>
            );
          })
        )}
      </div>

      {/* File Preview Modal */}
      {previewEntry && (
        <div className="modal-overlay" onClick={() => setPreviewEntry(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <div className="modal-title">📎 {previewEntry.fileName}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 16 }}>{previewEntry.description} · {previewEntry.date}</div>
            {previewEntry.fileType?.includes("pdf") ? (
              <iframe src={previewEntry.file} style={{ width: "100%", height: 480, borderRadius: 8, border: "1px solid var(--border)", background: "#fff" }} />
            ) : (
              <img src={previewEntry.file} alt={previewEntry.fileName} style={{ width: "100%", maxHeight: 480, objectFit: "contain", borderRadius: 8, background: "var(--bg3)" }} />
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <a href={previewEntry.file} download={previewEntry.fileName} className="btn btn-ghost">↓ Download</a>
              <button className="btn btn-ghost" onClick={() => setPreviewEntry(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Delete Entry?</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
              This will permanently delete <strong style={{ color: "var(--white)" }}>{confirmDelete.description}</strong> ({fmt(confirmDelete.amount)}).
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-danger" onClick={async () => { await onDelete(confirmDelete.id); setConfirmDelete(null); toast("Entry deleted"); }}>Delete</button>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── PERIODS PAGE ─────────────────────────────────────────────────────────────
function PeriodsPage({ user, periods, currentPeriod, onArchive, onCreatePeriod, toast }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newStart, setNewStart] = useState(new Date().toISOString().split("T")[0]);
  const [creating, setCreating] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  const sorted = [...periods].sort((a, b) => new Date(b.start) - new Date(a.start));

  async function handleCreate() {
    setCreating(true);
    const p = makePeriod(user.periodType, newStart);
    await onCreatePeriod(p);
    setCreating(false);
    setShowCreate(false);
    toast("New period created");
  }

  return (
    <>
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 className="page-title">VAT Periods</h1>
            <p className="page-subtitle">Manage your reporting periods</p>
          </div>
          {!currentPeriod && (
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Period</button>
          )}
        </div>
      </div>

      <div className="page-body">
        {currentPeriod && (
          <div style={{ marginBottom: 28 }}>
            <div className="section-title">
              <span>Current Period</span>
              <div className="section-line" />
            </div>
            <div className="period-card">
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="period-card-name">{getPeriodLabel(currentPeriod)}</div>
                  <span className="badge badge-green"><span className="status-dot dot-green" /> Active</span>
                </div>
                <div className="period-card-dates">
                  {currentPeriod.start} → {currentPeriod.end} · {currentPeriod.type === "quarterly" ? "Quarterly" : "Annual"}
                </div>
              </div>
              <button className="btn btn-ghost" onClick={() => setConfirmArchive(true)}>Archive Period</button>
            </div>
          </div>
        )}

        {!currentPeriod && (
          <div style={{ marginBottom: 24 }}>
            {!showCreate ? (
              <div className="empty-state" style={{ padding: "40px 20px" }}>
                <div className="empty-icon">📅</div>
                <div className="empty-title">No active period</div>
                <div className="empty-text">Create a new VAT period to start tracking.</div>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowCreate(true)}>+ Create Period</button>
              </div>
            ) : (
              <div className="card" style={{ maxWidth: 480 }}>
                <div className="modal-title" style={{ fontSize: 16, marginBottom: 16 }}>Create New Period</div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Start Date</label>
                  <input className="form-input" type="date" value={newStart} onChange={e => setNewStart(e.target.value)} />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16, background: "var(--bg3)", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)" }}>
                  Period type: <strong style={{ color: "var(--white)" }}>{user.periodType === "quarterly" ? "Quarterly (3 months)" : "Annual (12 months)"}</strong><br />
                  End date will be: <strong style={{ color: "var(--indigo2)" }}>
                    {(() => {
                      const end = new Date(newStart);
                      if (isNaN(end.getTime())) return "—";
                      if (user.periodType === "quarterly") { end.setMonth(end.getMonth() + 3); end.setDate(end.getDate() - 1); }
                      else { end.setFullYear(end.getFullYear() + 1); end.setDate(end.getDate() - 1); }
                      return end.toISOString().split("T")[0];
                    })()}
                  </strong>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>{creating ? "Creating…" : "Create"}</button>
                  <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {sorted.filter(p => p.status !== "active").length > 0 && (
          <>
            <div className="section-title">
              <span>Archived Periods</span>
              <div className="section-line" />
            </div>
            {sorted.filter(p => p.status !== "active").map(p => (
              <div key={p.id} className="period-card">
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="period-card-name">{getPeriodLabel(p)}</div>
                    <span className="badge badge-grey"><span className="status-dot dot-grey" /> Closed</span>
                  </div>
                  <div className="period-card-dates">{p.start} → {p.end} · {p.type === "quarterly" ? "Quarterly" : "Annual"}</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {confirmArchive && (
        <div className="modal-overlay" onClick={() => setConfirmArchive(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Archive Current Period?</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
              This will close the current period and allow you to create a new one. Existing entries will be preserved.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-primary" onClick={async () => { await onArchive(); setConfirmArchive(false); toast("Period archived"); }}>Archive</button>
              <button className="btn btn-ghost" onClick={() => setConfirmArchive(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── EXPORT PAGE ──────────────────────────────────────────────────────────────
function ExportPage({ entries, periods, currentPeriod, toast }) {
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod?.id || "");
  const [exporting, setExporting] = useState(null);

  const sorted = [...periods].sort((a, b) => new Date(b.start) - new Date(a.start));
  const activePeriod = sorted.find(p => p.id === selectedPeriod);

  const catEntries = {};
  VAT_CATEGORIES.forEach(c => {
    catEntries[c.code] = entries.filter(e => e.category === c.code && e.file);
  });

  async function exportCategory(code) {
    const items = catEntries[code];
    if (!items || items.length === 0) { toast("No receipts for this category", "error"); return; }

    setExporting(code);
    try {
      // Dynamically load pdf-lib
      if (!window.PDFLib) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const { PDFDocument } = window.PDFLib;
      const mergedDoc = await PDFDocument.create();

      for (const item of items) {
        const base64 = item.file.split(",")[1];
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

        if (item.fileType?.includes("pdf")) {
          try {
            const srcDoc = await PDFDocument.load(bytes);
            const copiedPages = await mergedDoc.copyPages(srcDoc, srcDoc.getPageIndices());
            copiedPages.forEach(p => mergedDoc.addPage(p));
          } catch { /* skip corrupt PDF */ }
        } else {
          // Image → embed as PDF page
          try {
            let img;
            if (item.fileType?.includes("png")) {
              img = await mergedDoc.embedPng(bytes);
            } else {
              img = await mergedDoc.embedJpg(bytes);
            }
            const { width, height } = img.scale(1);
            const page = mergedDoc.addPage([width, height]);
            page.drawImage(img, { x: 0, y: 0, width, height });
          } catch { /* skip */ }
        }
      }

      const pdfBytes = await mergedDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const periodLabel = activePeriod ? `${activePeriod.start}_${activePeriod.end}` : "period";
      a.href = url;
      a.download = `VAT_${code}_${periodLabel}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast(`Downloaded VAT_${code}.pdf`);
    } catch (err) {
      console.error(err);
      toast("Export failed. Please try again.", "error");
    }
    setExporting(null);
  }

  async function exportAll() {
    for (const c of VAT_CATEGORIES) {
      if (catEntries[c.code]?.length > 0) {
        await exportCategory(c.code);
      }
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Export</h1>
        <p className="page-subtitle">Download receipts as merged PDFs per VAT category</p>
      </div>

      <div className="page-body">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div className="form-group" style={{ flex: 1, maxWidth: 320 }}>
            <label className="form-label">Period</label>
            <select className="form-select" value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}>
              <option value="">— Select period —</option>
              {sorted.map(p => <option key={p.id} value={p.id}>{getPeriodLabel(p)} ({p.status})</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 22 }} onClick={exportAll} disabled={!!exporting}>
            ↓ Export All
          </button>
        </div>

        {VAT_CATEGORIES.map(c => {
          const count = catEntries[c.code]?.length || 0;
          const total = entries.filter(e => e.category === c.code).reduce((s, e) => s + Number(e.amount || 0), 0);
          return (
            <div key={c.code} className="export-category-card">
              <div className="export-cat-badge">{c.code}</div>
              <div className="export-info">
                <div className="export-cat-name">{c.label}</div>
                <div className="export-cat-meta">
                  {count} receipt{count !== 1 ? "s" : ""} · {fmt(total)} total
                </div>
              </div>
              <button
                className={`btn ${count > 0 ? "btn-primary" : "btn-ghost"} btn-sm`}
                disabled={count === 0 || exporting === c.code}
                onClick={() => exportCategory(c.code)}
              >
                {exporting === c.code ? "Exporting…" : count > 0 ? "↓ Download PDF" : "No receipts"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [periods, setPeriods] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toasts, show: showToast } = useToast();

  const currentPeriod = periods.find(p => p.status === "active") || null;

  // Load data when user logs in
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const ps = await getPeriods(user.username);
      setPeriods(ps);
      // Load entries for active period
      const active = ps.find(p => p.status === "active");
      if (active) {
        const es = await getEntries(user.username, active.id);
        setEntries(es);
      } else {
        setEntries([]);
      }
      setLoading(false);
    })();
  }, [user]);

  async function handleSaveEntry(entry) {
    if (!currentPeriod) return;
    const updated = [...entries, entry];
    setEntries(updated);
    await saveEntries(user.username, currentPeriod.id, updated);
  }

  async function handleDeleteEntry(id) {
    if (!currentPeriod) return;
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await saveEntries(user.username, currentPeriod.id, updated);
  }

  async function handleCreatePeriod(period) {
    const updated = [...periods, period];
    setPeriods(updated);
    await savePeriods(user.username, updated);
    setEntries([]);
  }

  async function handleArchivePeriod() {
    if (!currentPeriod) return;
    const updated = periods.map(p => p.id === currentPeriod.id ? { ...p, status: "closed" } : p);
    setPeriods(updated);
    await savePeriods(user.username, updated);
    setEntries([]);
  }

  function handleLogin(u) {
    setUser(u);
    setPage("dashboard");
  }

  function handleLogout() {
    setUser(null);
    setPage("dashboard");
    setPeriods([]);
    setEntries([]);
  }

  if (!user) return (
    <>
      <GlobalStyles />
      <LoginPage onLogin={handleLogin} />
    </>
  );

  const navItems = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "new-entry", icon: "+", label: "New Entry" },
    { id: "entries", icon: "≡", label: "Entries" },
    { id: "periods", icon: "◷", label: "Periods" },
    { id: "export", icon: "↓", label: "Export" },
  ];

  const renderPage = () => {
    if (loading) return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", paddingTop: 100 }}>
        <div style={{ textAlign: "center", color: "var(--muted)" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⟳</div>
          <div style={{ fontSize: 13 }}>Loading your data…</div>
        </div>
      </div>
    );

    switch (page) {
      case "dashboard": return <DashboardPage user={user} currentPeriod={currentPeriod} entries={entries} periods={periods} onNavigate={setPage} />;
      case "new-entry": return <NewEntryPage user={user} currentPeriod={currentPeriod} onSave={handleSaveEntry} toast={showToast} />;
      case "entries": return <EntriesPage entries={entries} periods={periods} currentPeriod={currentPeriod} onDelete={handleDeleteEntry} toast={showToast} />;
      case "periods": return <PeriodsPage user={user} periods={periods} currentPeriod={currentPeriod} onArchive={handleArchivePeriod} onCreatePeriod={handleCreatePeriod} toast={showToast} />;
      case "export": return <ExportPage entries={entries} periods={periods} currentPeriod={currentPeriod} toast={showToast} />;
      default: return null;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div className="app-root">
        <nav className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-wordmark">
              <div className="logo-dot" />
              <span className="logo-wordmark-text">trackster</span>
            </div>
            <div className="logo-sub">VAT / MOMS</div>
          </div>

          <div className="sidebar-nav">
            <div className="nav-section-label">Navigation</div>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? "active" : ""}`}
                onClick={() => setPage(item.id)}
              >
                <span className="nav-icon" style={{ fontFamily: "monospace" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {currentPeriod && (
            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", marginBottom: 0 }}>
              <div style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted2)", marginBottom: 8 }}>Current Period</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="status-dot dot-green" />
                <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}>
                  {new Date(currentPeriod.start).toLocaleDateString("da-DK", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          )}

          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div className="user-name">{user.username}</div>
                <div className="user-role">{user.periodType === "quarterly" ? "Quarterly" : "Annual"}</div>
              </div>
              <button className="logout-btn" onClick={handleLogout} title="Sign out">⏻</button>
            </div>
          </div>
        </nav>

        <main className="main">
          {renderPage()}
        </main>
      </div>
      <ToastContainer toasts={toasts} />
    </>
  );
}
