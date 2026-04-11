const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel,
        AlignmentType, WidthType, BorderStyle, ShadingType, PageBreak } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "44546A" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: "bullet",
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
          }
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({
        children: [new TextRun({ text: "PRD - YieldField", bold: true, size: 36, color: "1F4E78" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Site Vitrine Finance de Marché × IA — v1.1", size: 24, color: "595959" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Recommandations de Bryan intégrées", size: 18, italic: true, color: "2E75B6" })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 }
      }),

      new Paragraph({
        children: [new TextRun({ text: "SECTION 1: KPIs ENRICHIS", bold: true, size: 28, color: "1F4E78" })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun("Dashboard enrichi avec 6-8 KPIs (au lieu de 3):")],
        spacing: { after: 100 }
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Courbe des taux: OAT 2Y, 5Y, 10Y, 30Y")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Spreads: OAT-Bund, Bund-US")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Indices: CAC 40, Euro Stoxx 50, S&P 500, Nikkei")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Volatilité: VIX, VSTOXX")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Macro: Dollar Index, rendements EUR/USD")] }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({
        children: [new TextRun({ text: "SECTION 2: BRIEFING MACRO - CONTEXTE RICHE", bold: true, size: 28, color: "1F4E78" })],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [new TextRun("Améliorer le briefing IA avec:")],
        spacing: { after: 100 }
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Thème du jour (ex: 'Inflation US en focus')")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Niveau de certitude (préliminaire vs définitif)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Événement clé attendu (jobs, BCE, résultats)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Niveau de risque pour les positions")] }),

      new Paragraph({
        children: [new TextRun({ text: "Tone à adopter: ", bold: true }), new TextRun("Trader senior qui ne pédagogue pas.")],
        spacing: { before: 120, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "✗ Mauvais: ", bold: true, color: "C00000" }), new TextRun("'La BCE a augmenté les taux'")],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "✓ Bon: ", bold: true, color: "00B050" }), new TextRun("'La BCE resserre. OAT-Bund s'élargit. Crédit EU en alerte jaune.'")]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({
        children: [new TextRun({ text: "SECTION 3: SOURCES DE DONNÉES", bold: true, size: 28, color: "1F4E78" })],
        spacing: { after: 120 }
      }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Taux (BCE + Banque de France)")]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("OAT 2Y, 5Y, 10Y, 30Y — BCE API / Euribot")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Spreads OAT-Bund (calcul local: OAT - Bund)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Rendement temps réel")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Indices Boursiers")]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("CAC 40, Euro Stoxx 50 — Finnhub / Twelvedata")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("S&P 500, Nasdaq — Alpha Vantage")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Nikkei — Clé pour Asia risk-on/off")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Volatilité")]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("VIX — US equity fear gauge (CBOE)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("VSTOXX — EU equity volatility (Eurex)")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Macro Complémentaire")]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Dollar Index (DXY) — ICE")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Commodités: WTI (pétrole), Gold (or)")] }),

      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Fallback Strategy")]
      }),
      new Paragraph({
        children: [new TextRun("Si une API échoue, afficher dernière donnée valide + timestamp 'donnée > 12h'.")]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({
        children: [new TextRun({ text: "SECTION 4: EDGE CASES FINANCE", bold: true, size: 28, color: "1F4E78" })],
        spacing: { after: 120 }
      }),

      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Marché fermé → afficher veille + 'dernier jour ouvré'")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Données manquantes → dernière valeur + 'donnée > 12h'")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Crise/spike volatilité → tone change, alerte risque")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Erreur API → fallback gracieux + historique 7j")] }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({
        children: [new TextRun({ text: "SECTION 5: PAGE COULISSES - TRANSPARENCE", bold: true, size: 28, color: "1F4E78" })],
        spacing: { after: 120 }
      }),

      new Paragraph({
        children: [new TextRun("Montrer la mécanique IA derrière le site:")]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Historique courbe des taux (1M/3M/1Y/5Y/10Y animée)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Logs appels API (timestamps, latence)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Prompts d'analyse (v03→v06, évolution du tone)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Exemples: données brutes → briefing généré")] }),

      new Paragraph({ children: [new PageBreak()] }),

      new Paragraph({
        children: [new TextRun({ text: "SECTION 6: CRITÈRES DE SUCCÈS (DoD)", bold: true, size: 28, color: "1F4E78" })],
        spacing: { after: 120 }
      }),

      new Paragraph({
        children: [new TextRun("Valider AVANT de considérer 'Done':")]
      }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("✅ Courbe des taux visible et mise à jour quotidienne")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("✅ Spread OAT-Bund calculé et affiché")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("✅ Briefing mentionne ≥2 spreads/volatilité")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("✅ Page Coulisses montre évolutions prompts")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("✅ Edge case test: fallback gracieux")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("PRD_BMAD_Site_Finance_Bryan_v1.1.docx", buffer);
  console.log("PRD v1.1 generated successfully");
}).catch(err => {
  console.error("Error:", err);
});
