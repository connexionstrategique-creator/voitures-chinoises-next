"use client";
import { useState } from "react";
import { getColorHex } from "@/data/types";

const PORTS = [
  { code: "bj", label: "Cotonou",  flag: "🇧🇯" },
  { code: "tg", label: "Lomé",     flag: "🇹🇬" },
  { code: "ci", label: "Abidjan",  flag: "🇨🇮" },
  { code: "sn", label: "Dakar",    flag: "🇸🇳" },
];

interface Props {
  brand: string;
  model: string;
  year: string;
  price: string;
  colors?: string[];
  carUrl: string;
  waNumber: string;
}

export default function ConfigurateurForm({
  brand, model, year, price, colors, carUrl, waNumber,
}: Props) {
  const [selectedColor, setSelectedColor] = useState(colors?.[0] ?? "");
  const [portCode, setPortCode] = useState("bj");
  const [note, setNote] = useState("");

  const port = PORTS.find((p) => p.code === portCode)!;

  const waMsg = encodeURIComponent(
    `Bonjour, je souhaite commander le véhicule suivant :\n\n` +
    `🚗 ${brand} ${model} ${year}\n` +
    `💰 Prix CIF : ${price} FCFA\n` +
    (selectedColor ? `🎨 Couleur : ${selectedColor}\n` : "") +
    `🚢 Port de livraison : ${port.label} (${port.flag})\n` +
    (note ? `📝 Message : ${note}\n` : "") +
    `\n🔗 Fiche : ${carUrl}`
  );

  return (
    <div className="config-section">
      <div className="config-section-label">CONFIGUREZ VOTRE COMMANDE</div>

      {colors && colors.length > 0 && (
        <div className="config-field">
          <div className="config-field-title">
            Couleur{selectedColor ? <span className="config-selected-val"> — {selectedColor}</span> : ""}
          </div>
          <div className="config-colors">
            {colors.map((col) => (
              <button
                key={col}
                title={col}
                className={`config-color-btn${selectedColor === col ? " active" : ""}`}
                onClick={() => setSelectedColor(col)}
              >
                <span
                  className="config-color-dot"
                  style={{ background: getColorHex(col) }}
                />
                <span className="config-color-name">{col}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="config-field">
        <div className="config-field-title">Port de livraison</div>
        <div className="config-ports">
          {PORTS.map((p) => (
            <button
              key={p.code}
              className={`config-port-btn${portCode === p.code ? " active" : ""}`}
              onClick={() => setPortCode(p.code)}
            >
              <span>{p.flag}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="config-field">
        <div className="config-field-title">Message optionnel</div>
        <textarea
          className="config-textarea"
          placeholder="Ex : quantité souhaitée, financement, délai de livraison…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <a
        href={`https://wa.me/${waNumber}?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="config-cta"
      >
        📱 Commander sur WhatsApp
      </a>
    </div>
  );
}
