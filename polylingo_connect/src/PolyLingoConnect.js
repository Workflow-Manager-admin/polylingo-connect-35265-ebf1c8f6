import React, { useState } from "react";
import "./App.css";

/*
  PolyLingo Connect Main Container

  Features & Layout:
    - Top navbar with app branding.
    - Section for input language selection and input mode (text/voice).
    - Input area for text or microphone activation.
    - Multi-select for output languages and toggle between voice/text output.
    - Section for translation result cards (with text and play/copy buttons).
    - Collapsible translation history panel.
    - Responsive, accessible layout.
*/

/*
  Language options, sorted (with 'Detect Language' always first for accessibility)
  Extend here for more languages as needed.
*/
const LANGUAGES = [
  { code: "auto", label: "Detect Language" },
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  // Add more languages as needed.
];

/**
 * PUBLIC_INTERFACE
 * PolyLingoConnect: The main container for multilingual translation app.
 * Implements responsive input area for text (with language selection + Detect), voice mode toggle,
 * accessible UI, and robust input state management.
 */
function PolyLingoConnect() {
  // Robust state management for input text and language.
  const [inputLanguage, setInputLanguage] = useState("auto");
  const [inputLanguageLabel, setInputLanguageLabel] = useState("Detect Language");
  const [outputLanguages, setOutputLanguages] = useState(["en", "fr"]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [inputText, setInputText] = useState("");
  const [historyCollapsed, setHistoryCollapsed] = useState(true);
  // Dummy translations/history for scaffolding
  const dummyTranslations = [
    { lang: "en", text: "Hello", key: "en" },
    { lang: "fr", text: "Bonjour", key: "fr" },
  ];
  const dummyHistory = [
    { source: "Hola", from: "es", to: ["en", "fr"], translations: ["Hello", "Bonjour"] },
    { source: "Bonjour", from: "fr", to: ["en"], translations: ["Hello"] },
  ];

  // Handler: when the input language changes (keep label in sync for accessibility)
  // PUBLIC_INTERFACE
  const handleInputLanguageChange = (e) => {
    const code = e.target.value;
    setInputLanguage(code);
    const selectedLabel = LANGUAGES.find((lang) => lang.code === code)?.label || "Unknown";
    setInputLanguageLabel(selectedLabel);
    // If the selected language is changed from 'auto' AND current 'auto' was disabled, enable it
    // No additional state logic needed.
  };

  // Handler: input text changed
  // PUBLIC_INTERFACE
  const handleInputTextChange = (e) => setInputText(e.target.value);

  // Handler: toggle between text and voice mode
  // PUBLIC_INTERFACE
  const handleVoiceModeToggle = () => setIsVoiceMode((prev) => !prev);

  // Handler: output languages change (multi-select!)
  // PUBLIC_INTERFACE
  const handleOutputLanguagesChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setOutputLanguages(selected);
  };

  // PUBLIC_INTERFACE: keyboard accessibility, pressing Enter in text area submits (future)
  // Can extend to submit translation on Ctrl+Enter, etc.

  return (
    <div className="app polylingo-main">
      {/* Top navbar */}
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: "#2D6A4F" }}>◉</span> PolyLingo Connect
            </div>
            <button className="btn" aria-label="App Menu">
              <span style={{ fontWeight: "bold", fontSize: "1.2em" }}>☰</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <div className="container">
          {/* Input Section */}
          <section className="polylingo-section" style={{ marginTop: 96 }}>
            {/* Input language & mode selectors */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 6
              }}
            >
              <label htmlFor="input-language-select" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span className="subtitle" style={{ minWidth: 96 }}>Input Language:</span>
                <select
                  id="input-language-select"
                  value={inputLanguage}
                  onChange={handleInputLanguageChange}
                  aria-label="Select input language"
                  style={{
                    marginLeft: 2,
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--border-color)",
                    minWidth: 130,
                    fontSize: "1rem",
                  }}
                >
                  {LANGUAGES.map((l) => (
                    <option
                      value={l.code}
                      key={l.code}
                      disabled={l.code === "auto" ? false : false}
                    >
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className={`btn${isVoiceMode ? " btn-active" : ""}`}
                type="button"
                style={{
                  marginLeft: 12,
                  minWidth: 115,
                  fontWeight: 500,
                  outline: isVoiceMode ? "2px solid #FFD166" : undefined,
                  outlineOffset: 2,
                  border: isVoiceMode ? "2px solid #FFD166" : "none"
                }}
                onClick={handleVoiceModeToggle}
                aria-pressed={isVoiceMode}
                aria-label={isVoiceMode ? "Switch to text input" : "Switch to voice input"}
              >
                {isVoiceMode ? "🎤 Voice Input" : "⌨️ Text Input"}
              </button>
            </div>

            {/* Input area */}
            <div
              style={{
                marginTop: 18,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 18,
                width: "100%"
              }}
            >
              {isVoiceMode ? (
                <button
                  className="btn btn-large"
                  aria-label="Start voice input"
                  style={{
                    width: "100%",
                    minWidth: "210px",
                    maxWidth: "440px"
                  }}
                  tabIndex={0}
                >
                  <span role="img" aria-label="Microphone">🎙️ Start Speaking</span>
                </button>
              ) : (
                <textarea
                  value={inputText}
                  onChange={handleInputTextChange}
                  placeholder={`Type your message${inputLanguage === "auto" ? " (language detected automatically)" : ""}...`}
                  rows={3}
                  id="polylingo-input-area"
                  tabIndex={0}
                  style={{
                    fontSize: "1.08rem",
                    width: "70vw",
                    maxWidth: "540px",
                    minWidth: "200px",
                    resize: "vertical",
                    borderRadius: 6,
                    border: "1px solid var(--border-color)",
                    padding: 12,
                    background: "#172B39",
                    color: "var(--text-color)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                  aria-label={`Text input for translation${inputLanguageLabel !== "Detect Language" ? " (" + inputLanguageLabel + ")" : " (automatic detection)"}`}
                  aria-describedby="input-language-hint"
                />
              )}
            </div>
            <div id="input-language-hint" style={{ color: "var(--text-secondary)", fontSize: "0.98em", textAlign: "center", marginTop: 6 }}>
              {inputLanguage === "auto"
                ? "The language will be detected automatically as you type."
                : `Current input language: ${inputLanguageLabel}`}
            </div>
          </section>

          {/* Output Configuration */}
          <section className="polylingo-section" style={{ marginTop: 26 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "center" }}>
              <label>
                <span className="subtitle">Output Languages:</span>
                <select
                  multiple
                  value={outputLanguages}
                  onChange={handleOutputLanguagesChange}
                  aria-label="Select output languages"
                  style={{
                    marginLeft: 10,
                    minWidth: 110,
                    maxWidth: 250,
                    height: 38,
                  }}
                >
                  {LANGUAGES.filter(l => l.code !== "auto").map((l) => (
                    <option value={l.code} key={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ marginLeft: 20, display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={isVoiceMode}
                  onChange={handleVoiceModeToggle}
                  aria-label="Voice output enabled"
                /> Voice Output
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={!isVoiceMode}
                  onChange={handleVoiceModeToggle}
                  aria-label="Text output enabled"
                /> Text Output
              </label>
            </div>
          </section>

          {/* Results Section */}
          <section className="polylingo-section" style={{ marginTop: 36 }}>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center"
            }}>
              {dummyTranslations.map((t) => (
                <div
                  className="polylingo-card"
                  key={t.key}
                  style={{
                    background: "#263A4F",
                    borderRadius: 8,
                    padding: "16px 24px",
                    minWidth: 148,
                    maxWidth: 300,
                    color: "var(--text-color)",
                    boxShadow: "0 2px 16px rgba(0,0,0,.08)",
                  }}
                >
                  <div className="subtitle" style={{ fontSize: "1.05rem", color: "#FFD166" }}>
                    {LANGUAGES.find(l => l.code === t.lang)?.label}
                  </div>
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: "1.4rem",
                      marginTop: 5,
                      marginBottom: 11
                    }}
                  >
                    {t.text}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" aria-label="Play translation">🔊</button>
                    <button className="btn" aria-label="Copy translation">📋</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Collapsible Translation History Panel */}
          <section className="polylingo-section" style={{ marginTop: 32 }}>
            <button
              className="btn"
              onClick={() => setHistoryCollapsed((c) => !c)}
              aria-expanded={!historyCollapsed}
              aria-controls="polylingo-history-panel"
              style={{ marginBottom: 10, width: 170 }}
            >
              {historyCollapsed ? "Show" : "Hide"} Translation History
              <span style={{ marginLeft: 6 }}>{historyCollapsed ? "▼" : "▲"}</span>
            </button>
            <div
              id="polylingo-history-panel"
              style={{
                maxHeight: historyCollapsed ? 0 : 220,
                overflow: "auto",
                transition: "max-height 0.28s ease",
                background: "#1A2B2A",
                borderRadius: 6,
                padding: historyCollapsed ? 0 : 18,
                opacity: historyCollapsed ? 0 : 1,
                pointerEvents: historyCollapsed ? "none" : "auto",
              }}
              aria-hidden={historyCollapsed}
            >
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {dummyHistory.map((h, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: 10,
                      paddingBottom: 8,
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>
                      <span style={{ color: "#FFD166" }}>{LANGUAGES.find(x=>x.code===h.from)?.label || h.from}:</span> {h.source}
                    </span>{" "}
                    <span style={{ color: "var(--text-secondary)", marginLeft: 8 }}>
                      → {h.to.map(code => LANGUAGES.find(l=>l.code===code)?.label).join(", ")}:{" "}
                      {h.translations.join(" / ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PolyLingoConnect;
