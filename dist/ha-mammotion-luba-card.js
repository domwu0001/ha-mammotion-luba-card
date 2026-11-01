/*
 * Mammotion Luba Card for Home Assistant
 * Mammotion integration: https://github.com/mikey0000/Mammotion-HA
 * Inspired by the interaction patterns of juju35/ha-vacuum-card.
 */
const VERSION = "0.1.0";

const DEFAULTS = {
  type: "custom:ha-mammotion-luba-card",
  entity: null,
  name: null,
  battery: null,
  progress: null,
  area: null,
  elapsed: null,
  remaining: null,
  activity: null,
  self_check: null,
  blade_height: null,
  mowing_speed: null,
  gps_stars: null,
  task: null,
  map_entity: null,
  map_height: 230,
  show_map: true,
  show_details: true,
  show_controls: true,
  show_quick_actions: true,
  show_progress: true,
  show_diagnostics: false,
  show_name: true,
  compact: false,
  confirm_stop: true,
  language: "auto",
  accent_color: "var(--primary-color)",
  image: null,
};

const I18N = {
  de: {
    ready: "Bereit", mowing: "Mäht", paused: "Pausiert", returning: "Fährt zur Ladestation",
    docked: "An der Ladestation", charging: "Lädt", error: "Fehler", unavailable: "Nicht verfügbar",
    start: "Start", pause: "Pause", dock: "Zur Ladestation", stop: "Aufgabe abbrechen",
    refresh: "Status aktualisieren", release: "Abdocken", details: "Details", hide: "Ausblenden",
    battery: "Akku", progress: "Fortschritt", area: "Fläche", elapsed: "Laufzeit",
    remaining: "Verbleibend", self_check: "Selbsttest", blade_height: "Schnitthöhe",
    speed: "Mähgeschwindigkeit", satellites: "Satelliten", task: "Aktuelle Aufgabe",
    diagnostics: "Diagnose", no_map: "Keine Kartenansicht konfiguriert", map: "Mähkarte",
    confirm_stop: "Möchtest du die aktuelle Mähaufgabe wirklich abbrechen?",
    connection: "Verbindung", unknown: "Unbekannt", running: "In Betrieb", no_entity: "Bitte eine lawn_mower-Entity konfigurieren.",
  },
  en: {
    ready: "Ready", mowing: "Mowing", paused: "Paused", returning: "Returning to dock",
    docked: "At dock", charging: "Charging", error: "Error", unavailable: "Unavailable",
    start: "Start", pause: "Pause", dock: "Return to dock", stop: "Cancel job",
    refresh: "Refresh status", release: "Leave dock", details: "Details", hide: "Hide",
    battery: "Battery", progress: "Progress", area: "Area", elapsed: "Elapsed",
    remaining: "Remaining", self_check: "Self check", blade_height: "Cutting height",
    speed: "Mowing speed", satellites: "Satellites", task: "Current task",
    diagnostics: "Diagnostics", no_map: "No map entity configured", map: "Mowing map",
    confirm_stop: "Do you really want to cancel the current mowing job?",
    connection: "Connection", unknown: "Unknown", running: "Running", no_entity: "Please configure a lawn_mower entity.",
  },
};

const STYLE = `
:host{display:block;color:var(--primary-text-color);font-family:var(--paper-font-body1_-_font-family,Roboto,"Noto",sans-serif);}
*{box-sizing:border-box}
.card{overflow:hidden;border-radius:var(--ha-card-border-radius,18px);background:var(--ha-card-background,var(--card-background-color));box-shadow:var(--ha-card-box-shadow,0 2px 8px #00000018);border:1px solid var(--divider-color);}
.header{display:flex;align-items:center;gap:14px;padding:18px 18px 10px}
.identity{min-width:0;flex:1}.eyebrow{font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:var(--secondary-text-color);font-weight:700;margin-bottom:4px}.name{font-weight:750;font-size:20px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.status{font-size:13px;color:var(--secondary-text-color);margin-top:5px;display:flex;align-items:center;gap:7px}.dot{height:8px;width:8px;border-radius:50%;background:var(--success-color,#43a047);display:inline-block}.dot.work{background:var(--info-color,#039be5);box-shadow:0 0 0 4px color-mix(in srgb,var(--info-color,#039be5) 16%,transparent)}.dot.warn{background:var(--warning-color,#f9a825)}.dot.bad{background:var(--error-color,#db4437)}
.battery{display:flex;align-items:center;gap:8px;font-weight:700;font-size:15px;white-space:nowrap}.battery ha-icon{--mdc-icon-size:21px;color:var(--secondary-text-color)}
.hero{position:relative;min-height:148px;display:flex;align-items:center;justify-content:center;padding:8px 18px 12px;background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--primary-color) 4%,transparent));}
.robot{width:min(64%,300px);height:155px;object-fit:contain;filter:drop-shadow(0 9px 9px #00000020)}.hero-fallback{font-size:92px;line-height:1;filter:drop-shadow(0 9px 9px #00000020)}
.progress-wrap{padding:0 18px 16px}.progress-top{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--secondary-text-color);margin-bottom:8px}.progress-top strong{color:var(--primary-text-color);font-size:14px}.bar{height:7px;border-radius:99px;background:var(--divider-color);overflow:hidden}.bar>span{height:100%;display:block;border-radius:99px;background:var(--luba-accent,var(--primary-color));transition:width .35s ease}
.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--divider-color);border-bottom:1px solid var(--divider-color);padding:13px 8px}.metric{text-align:center;min-width:0;padding:0 4px}.metric+ .metric{border-left:1px solid var(--divider-color)}.metric-value{font-size:17px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.metric-label{font-size:10px;color:var(--secondary-text-color);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:uppercase;letter-spacing:.035em}
.controls{display:flex;gap:9px;padding:15px 16px 16px}.control{border:0;border-radius:13px;min-height:44px;padding:0 12px;display:flex;align-items:center;justify-content:center;gap:7px;flex:1;font:inherit;font-weight:700;font-size:13px;cursor:pointer;color:var(--primary-text-color);background:var(--secondary-background-color);transition:filter .15s,transform .15s}.control:active{transform:scale(.97)}.control ha-icon{--mdc-icon-size:19px}.control.primary{background:var(--luba-accent,var(--primary-color));color:var(--text-primary-color,#fff)}.control.danger{color:var(--error-color,#db4437)}.control:disabled{opacity:.36;cursor:not-allowed}
.quick{display:flex;gap:7px;padding:0 16px 14px;flex-wrap:wrap}.chip{display:flex;align-items:center;gap:6px;padding:7px 10px;border:1px solid var(--divider-color);border-radius:99px;color:var(--secondary-text-color);font-size:11px;min-width:0}.chip ha-icon{--mdc-icon-size:15px}.section{border-top:1px solid var(--divider-color);padding:12px 16px}.section-head{display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:13px;margin-bottom:9px}.section-head button{border:0;background:none;color:var(--secondary-text-color);display:flex;align-items:center;cursor:pointer;font:inherit}.map{display:block;width:100%;object-fit:cover;border-radius:12px;background:var(--secondary-background-color)}.map-placeholder{height:100px;border-radius:12px;background:var(--secondary-background-color);display:grid;place-items:center;color:var(--secondary-text-color);font-size:12px;text-align:center;padding:15px}
.details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.detail{display:flex;align-items:center;gap:8px;min-width:0;font-size:12px}.detail ha-icon{color:var(--secondary-text-color);--mdc-icon-size:18px}.detail div{min-width:0}.detail span{display:block;color:var(--secondary-text-color);font-size:10px;margin-bottom:2px}.detail strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}
.footer{display:flex;justify-content:flex-end;padding:0 14px 10px}.text-button{border:0;background:none;color:var(--secondary-text-color);font:inherit;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:5px}.compact .hero{min-height:100px}.compact .robot{height:112px}.compact .hero-fallback{font-size:65px}.compact .metrics{padding:10px 5px}.compact .metric-value{font-size:15px}
@media(max-width:380px){.header{padding:15px 14px 8px}.name{font-size:18px}.hero{min-height:125px}.robot{height:125px}.metrics{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:12px}.metric:nth-child(3){border-left:0}.controls{gap:6px;padding:12px}.control{font-size:11px;padding:0 5px}.control ha-icon{--mdc-icon-size:17px}.quick{padding-left:12px;padding-right:12px}.details{grid-template-columns:1fr 1fr}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
`;

function formatValue(state, fallback = "—") {
  if (!state || ["unknown", "unavailable", "none", "None"].includes(String(state.state))) return fallback;
  const value = Number(state.state);
  if (Number.isFinite(value) && String(state.state).trim() !== "") return value;
  return String(state.state);
}
function numberValue(state) {
  if (!state || !Number.isFinite(Number(state.state))) return null;
  return Number(state.state);
}
function formatDuration(minutes) {
  if (minutes == null || minutes < 0) return "—";
  const h = Math.floor(minutes / 60), m = Math.round(minutes % 60);
  return h ? `${h} h ${m} min` : `${m} min`;
}
function activityKey(activity, entityState) {
  const raw = String(activity ?? entityState ?? "").toLowerCase();
  if (raw.includes("mow") || raw.includes("work")) return "mowing";
  if (raw.includes("pause")) return "paused";
  if (raw.includes("return")) return "returning";
  if (raw.includes("dock")) return "docked";
  if (raw.includes("charg")) return "charging";
  if (raw.includes("error") || raw.includes("lock")) return "error";
  if (raw.includes("ready") || raw.includes("idle")) return "ready";
  return "unknown";
}

class LubaMowerCard extends HTMLElement {
  static getConfigElement() { return document.createElement("ha-mammotion-luba-card-editor"); }
  static getStubConfig() { return { entity: "lawn_mower.luba_2_mini" }; }
  static getConfigForm() {
    return {
      schema: [
        { name: "entity", required: true, selector: { entity: { domain: "lawn_mower", integration: "mammotion" } } },
        { name: "name", selector: { text: {} } },
        { name: "battery", selector: { entity: { domain: "sensor" } } },
        { name: "progress", selector: { entity: { domain: "sensor" } } },
        { name: "area", selector: { entity: { domain: "sensor" } } },
        { name: "activity", selector: { entity: { domain: "sensor" } } },
        { name: "self_check", selector: { entity: { domain: "sensor" } } },
        { name: "map_entity", selector: { entity: { domain: ["camera", "image"] } } },
      ],
    };
  }
  setConfig(config) {
    if (!config?.entity) throw new Error("Mammotion Luba Card: 'entity' (lawn_mower) is required");
    this._config = { ...DEFAULTS, ...config };
    this._expanded = !this._config.compact;
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }
  getCardSize() { return this._config?.compact ? 4 : 7; }
  connectedCallback() { this._render(); }

  _t(key) {
    const language = this._config.language === "auto" ? (this._hass?.locale?.language || "de").slice(0, 2) : this._config.language;
    return (I18N[language] || I18N.en)[key] || I18N.en[key] || key;
  }
  _state(entityId) { return entityId && this._hass?.states?.[entityId] ? this._hass.states[entityId] : null; }
  _firstEntity(explicit, suffixes) {
    if (explicit) return explicit;
    const base = this._config.entity.split(".").slice(1).join(".");
    const candidates = Object.keys(this._hass?.states || {});
    for (const suffix of suffixes) {
      const match = candidates.find(id => id === `sensor.${base}_${suffix}`);
      if (match) return match;
    }
    return null;
  }
  _service(domain, service, data = {}) {
    if (!this._hass) return;
    this._hass.callService(domain, service, data);
  }
  _callLawn(service) { this._service("lawn_mower", service, { entity_id: this._config.entity }); }
  _stop() {
    if (this._config.confirm_stop && !window.confirm(this._t("confirm_stop"))) return;
    // Mammotion exposes cancellation as an integration service rather than lawn_mower.stop.
    this._service("mammotion", "cancel_job", { entity_id: this._config.entity });
  }
  _render() {
    if (!this._config || !this.isConnected) return;
    const cfg = this._config, mower = this._state(cfg.entity);
    const name = cfg.name || mower?.attributes?.friendly_name || "Mammotion Luba 2 Mini";
    const batteryId = this._firstEntity(cfg.battery, ["battery_percent"]);
    const progressId = this._firstEntity(cfg.progress, ["progress"]);
    const areaId = this._firstEntity(cfg.area, ["area"]);
    const elapsedId = this._firstEntity(cfg.elapsed, ["elapsed_time"]);
    const remainingId = this._firstEntity(cfg.remaining, ["left_time"]);
    const activityId = this._firstEntity(cfg.activity, ["activity_mode"]);
    const selfCheckId = this._firstEntity(cfg.self_check, ["self_check"]);
    const bladeId = this._firstEntity(cfg.blade_height, ["blade_height"]);
    const speedId = this._firstEntity(cfg.mowing_speed, ["mowing_speed"]);
    const gpsId = this._firstEntity(cfg.gps_stars, ["gps_stars"]);
    const taskId = cfg.task;

    const battery = this._state(batteryId), progress = this._state(progressId), area = this._state(areaId);
    const elapsed = this._state(elapsedId), remaining = this._state(remainingId), activity = this._state(activityId);
    const selfCheck = this._state(selfCheckId), blade = this._state(bladeId), speed = this._state(speedId);
    const gps = this._state(gpsId), task = this._state(taskId);
    const status = mower?.state;
    const stateKey = activityKey(activity?.state, status);
    const stateLabel = this._t(stateKey);
    const percent = numberValue(progress);
    const batteryPercent = numberValue(battery);
    const isWorking = stateKey === "mowing";
    const isPaused = stateKey === "paused";
    const isUnavailable = !mower || status === "unavailable";
    const showDetails = cfg.show_details && !cfg.compact;
    const mapState = this._state(cfg.map_entity);
    const mapUrl = mapState?.attributes?.entity_picture || null;
    const mapImage = cfg.map_entity && mapUrl ? `<img class="map" style="height:${Number(cfg.map_height) || 230}px" src="${this._escape(mapUrl)}" alt="${this._t("map")}" />` : "";
    const progressMarkup = cfg.show_progress && percent !== null ? `<div class="progress-wrap"><div class="progress-top"><span>${this._t("progress")}</span><strong>${Math.max(0,Math.min(100,percent))}%</strong></div><div class="bar"><span style="width:${Math.max(0,Math.min(100,percent))}%"></span></div></div>` : "";
    const batteryLabel = batteryPercent === null ? "—" : `${Math.round(batteryPercent)}%`;
    const batteryIcon = batteryPercent === null ? "mdi:battery-unknown" : batteryPercent >= 90 ? "mdi:battery" : batteryPercent >= 60 ? "mdi:battery-80" : batteryPercent >= 40 ? "mdi:battery-60" : batteryPercent >= 20 ? "mdi:battery-30" : "mdi:battery-alert";
    const statusClass = stateKey === "mowing" ? "work" : stateKey === "error" ? "bad" : stateKey === "unknown" ? "warn" : "";

    this.innerHTML = `<ha-card class="card ${cfg.compact ? "compact" : ""}" style="--luba-accent:${this._escape(cfg.accent_color)}">
      <style>${STYLE}</style>
      <div class="header">
        <div class="identity">${cfg.show_name ? `<div class="eyebrow">Mammotion</div><div class="name">${this._escape(name)}</div>` : ""}<div class="status"><span class="dot ${statusClass}"></span>${this._escape(isUnavailable ? this._t("unavailable") : stateLabel)}</div></div>
        <div class="battery"><ha-icon icon="${batteryIcon}"></ha-icon>${batteryLabel}</div>
      </div>
      <div class="hero">${cfg.image ? `<img class="robot" src="${this._escape(cfg.image)}" alt="Luba 2 Mini" />` : this._robotArt(isWorking)}</div>
      ${progressMarkup}
      <div class="metrics">
        <div class="metric"><div class="metric-value">${batteryLabel}</div><div class="metric-label">${this._t("battery")}</div></div>
        <div class="metric"><div class="metric-value">${this._display(area, "m²")}</div><div class="metric-label">${this._t("area")}</div></div>
        <div class="metric"><div class="metric-value">${this._display(elapsed, "min")}</div><div class="metric-label">${this._t("elapsed")}</div></div>
        <div class="metric"><div class="metric-value">${this._display(remaining, "min")}</div><div class="metric-label">${this._t("remaining")}</div></div>
      </div>
      ${cfg.show_controls ? `<div class="controls">
        ${isWorking ? `<button class="control primary" data-action="pause"><ha-icon icon="mdi:pause"></ha-icon>${this._t("pause")}</button>` : `<button class="control primary" data-action="start" ${isUnavailable ? "disabled" : ""}><ha-icon icon="mdi:play"></ha-icon>${this._t("start")}</button>`}
        <button class="control" data-action="dock" ${isUnavailable ? "disabled" : ""}><ha-icon icon="mdi:home-import-outline"></ha-icon>${this._t("dock")}</button>
        <button class="control danger" data-action="stop" ${isUnavailable || (!isWorking && !isPaused) ? "disabled" : ""}><ha-icon icon="mdi:stop"></ha-icon>${this._t("stop")}</button>
      </div>` : ""}
      ${cfg.show_quick_actions && !cfg.compact ? `<div class="quick">
        ${this._chip("mdi:content-cut", this._t("blade_height"), blade, "mm")}
        ${this._chip("mdi:speedometer", this._t("speed"), speed, "m/s")}
        ${this._chip("mdi:satellite-variant", this._t("satellites"), gps, "")}
      </div>` : ""}
      ${showDetails ? `<div class="section"><div class="section-head">${this._t("diagnostics")}</div><div class="details">
        ${this._detail("mdi:shield-check", this._t("self_check"), selfCheck ? formatValue(selfCheck) : "—")}
        ${this._detail("mdi:clipboard-text-outline", this._t("task"), task ? formatValue(task) : "—")}
      </div></div>` : ""}
      ${cfg.show_map && !cfg.compact ? `<div class="section"><div class="section-head">${this._t("map")}</div>${mapImage || `<div class="map-placeholder">${this._t("no_map")}<br><small>camera / image</small></div>`}</div>` : ""}
      ${cfg.show_diagnostics ? `<div class="section"><div class="section-head">${this._t("connection")}</div><div class="details">${this._detail("mdi:state-machine", "Entity", status || "—")}${this._detail("mdi:battery", this._t("battery"), batteryLabel)}</div></div>` : ""}
      <div class="footer"><button class="text-button" data-action="refresh"><ha-icon icon="mdi:refresh"></ha-icon>${this._t("refresh")}</button></div>
    </ha-card>`;
    this.querySelectorAll("[data-action]").forEach(button => button.addEventListener("click", event => this._handleAction(event.currentTarget.dataset.action)));
  }

  _robotArt(isWorking) {
    return `<svg class="robot-art ${isWorking ? "mowing" : ""}" viewBox="0 0 320 160" role="img" aria-label="Mammotion Luba 2 Mini">
      <path d="M34 126 Q160 143 286 126" fill="none" stroke="var(--divider-color)" stroke-width="7" stroke-linecap="round"/>
      <path class="grass" d="M43 137l-4-10m16 12-1-13m215 11 4-12m-18 13 1-14"/>
      <g transform="translate(0 2)">
        <rect class="wheel" x="51" y="58" width="42" height="66" rx="15"/><rect class="wheel" x="227" y="58" width="42" height="66" rx="15"/>
        <path class="body" d="M75 49 Q82 27 112 25 L206 25 Q237 29 245 54 L257 102 Q259 119 241 123 L79 123 Q61 120 63 101Z"/>
        <path d="M91 47Q101 35 119 35H201Q218 37 226 51L233 67H84Z" fill="#555d62"/>
        <path class="glass" d="M126 39H195Q210 40 218 57H102Q110 41 126 39Z"/>
        <path class="accent" d="M83 76H237L245 96H76Z"/>
        <rect x="142" y="26" width="37" height="9" rx="4" fill="#24282b"/>
        <circle cx="160" cy="76" r="7" fill="#1c2023" stroke="#f1a25e" stroke-width="2"/>
        <path d="M105 108H215" stroke="#9aa1a5" stroke-width="3" stroke-linecap="round"/>
        <path class="cutting" d="M92 132H228" fill="none" stroke="#7eb45d" stroke-width="3" stroke-dasharray="5 6"/>
      </g>
    </svg>`;
  }
  _display(state, unit) {
    if (!state) return "—";
    const value = numberValue(state);
    if (value === null) return "—";
    if (unit === "min") return formatDuration(value);
    return `${Number.isInteger(value) ? value : value.toFixed(1)} ${unit}`;
  }
  _chip(icon, label, state, unit) {
    if (!state || ["unknown", "unavailable"].includes(state.state)) return "";
    const value = formatValue(state);
    return `<div class="chip"><ha-icon icon="${icon}"></ha-icon><span>${this._escape(label)}: ${this._escape(value)}${unit ? ` ${unit}` : ""}</span></div>`;
  }
  _detail(icon, label, value) { return `<div class="detail"><ha-icon icon="${icon}"></ha-icon><div><span>${this._escape(label)}</span><strong>${this._escape(value)}</strong></div></div>`; }
  _escape(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  _handleAction(action) {
    switch (action) {
      case "start": this._callLawn("start_mowing"); break;
      case "pause": this._callLawn("pause"); break;
      case "dock": this._callLawn("dock"); break;
      case "stop": this._stop(); break;
      case "refresh": {
        const base = this._config.entity.split(".").slice(1).join(".");
        const refreshId = Object.keys(this._hass?.states || {}).find(id => id === `button.${base}_refresh_status`);
        if (refreshId) this._service("button", "press", { entity_id: refreshId });
        else this._hass?.callService("homeassistant", "update_entity", { entity_id: this._config.entity });
        break;
      }
    }
  }
}

class LubaMowerCardEditor extends HTMLElement {
  setConfig(config) { this._config = { ...config }; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this.appendChild(this._form);
      this._form.addEventListener("value-changed", event => {
        event.stopPropagation();
        this._config = { ...this._config, ...event.detail.value };
        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: this._config }, bubbles: true, composed: true,
        }));
      });
    }
    this._form.hass = this._hass;
    this._form.data = { ...this._config };
    this._form.schema = [
      { name: "entity", required: true, selector: { entity: { domain: "lawn_mower" } } },
      { name: "name", selector: { text: {} } },
      { name: "battery", selector: { entity: { domain: "sensor" } } },
      { name: "progress", selector: { entity: { domain: "sensor" } } },
      { name: "area", selector: { entity: { domain: "sensor" } } },
      { name: "elapsed", selector: { entity: { domain: "sensor" } } },
      { name: "remaining", selector: { entity: { domain: "sensor" } } },
      { name: "activity", selector: { entity: { domain: "sensor" } } },
      { name: "self_check", selector: { entity: { domain: "sensor" } } },
      { name: "blade_height", selector: { entity: { domain: "sensor" } } },
      { name: "mowing_speed", selector: { entity: { domain: "sensor" } } },
      { name: "gps_stars", selector: { entity: { domain: "sensor" } } },
      { name: "map_entity", selector: { entity: { domain: ["camera", "image"] } } },
      { name: "show_map", selector: { boolean: {} } },
      { name: "show_details", selector: { boolean: {} } },
      { name: "show_controls", selector: { boolean: {} } },
      { name: "show_quick_actions", selector: { boolean: {} } },
      { name: "show_progress", selector: { boolean: {} } },
      { name: "show_diagnostics", selector: { boolean: {} } },
      { name: "compact", selector: { boolean: {} } },
      { name: "confirm_stop", selector: { boolean: {} } },
      { name: "accent_color", selector: { text: {} } },
      { name: "image", selector: { text: {} } },
      { name: "language", selector: { select: { options: ["auto", "de", "en"] } } },
    ];
  }
}
if (!customElements.get("ha-mammotion-luba-card")) customElements.define("ha-mammotion-luba-card", LubaMowerCard);
if (!customElements.get("ha-mammotion-luba-card-editor")) customElements.define("ha-mammotion-luba-card-editor", LubaMowerCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({ type: "ha-mammotion-luba-card", name: "Mammotion Luba Card", description: "Mammotion Luba mower status, battery, mowing stats and controls", preview: true });
console.info(`%c LUBA-MOWER-CARD %c ${VERSION} `, "color:white;background:#4c7f42;font-weight:700", "color:#4c7f42;background:white;font-weight:700");
