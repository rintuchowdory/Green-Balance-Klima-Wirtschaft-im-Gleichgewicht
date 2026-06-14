# 🌿 Green Balance – Klima & Wirtschaft im Gleichgewicht

Eine interaktive deutschsprachige Plattform, die die Zielkonflikte zwischen **Klimaschutz und Wirtschaftsinteressen** in Deutschland datenbasiert visualisiert.

🌐 **Live:** [info-website-builder--chowdory.replit.app](https://info-website-builder--chowdory.replit.app)

---

## Was ist das?

Green Balance zeigt, wie Klimapolitik und Wirtschaft in Deutschland zusammenhängen — mit echten CO₂-Daten, Bundesländer-Vergleichen, Meinungsumfragen und einem interaktiven Energiemix-Simulator.

## Seiten

| Seite | Beschreibung |
|-------|-------------|
| Übersicht | Hero-Landing mit aktuellen Klimakennzahlen |
| Dashboard | CO₂-Trend, Energiemix & Jobs (Recharts) |
| Konflikt-Atlas | 8 Klima-vs-Wirtschaft Konfliktthemen mit Scores |
| Bundesländer | Vergleich aller 16 Bundesländer (CO₂, Erneuerbare, Jobs) |
| Meinungen | 4 Live-Abstimmungen mit Echtzeit-Ergebnissen |
| Debatte | Perspektivgenerator: Unternehmer · Arbeitnehmer · Aktivist · Politiker |
| Simulator | Energiemix-Regler → CO₂-Auswirkungen in Echtzeit |

## Stack

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion + Recharts
- **Backend:** Express 5 + Node.js 24 + TypeScript
- **Datenbank:** PostgreSQL + Drizzle ORM (nur für Umfragen)
- **Validierung:** Zod + OpenAPI (Orval Codegen)
- **Hosting:** Replit

## Lokal starten

```bash
git clone https://github.com/rintuchowdory/Green-Balance-Klima-Wirtschaft-im-Gleichgewicht
cd Green-Balance-Klima-Wirtschaft-im-Gleichgewicht

# Env Variable setzen
echo "DATABASE_URL=postgresql://..." > .env

# Dependencies
pnpm install

# API-Server starten (Port 8080)
pnpm --filter @workspace/api-server run dev

# Frontend starten (Port 25780)
pnpm --filter @workspace/green-balance run dev
```

## Autor

**Rintu Chowdory** — DevOps Engineer & Full-Stack Developer
📍 Baesweiler, Germany
🔗 [GitHub](https://github.com/rintuchowdory) · [LinkedIn](https://linkedin.com/in/rintu-chowdory-67977b2a7)
