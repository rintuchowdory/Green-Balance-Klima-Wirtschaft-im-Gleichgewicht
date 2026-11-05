/**
 * Vercel-Einstiegspunkt.
 *
 * Der Server wird beim Build mit esbuild zu dist/index.mjs gebündelt. Dieses Modul
 * exportiert die Express-App als Default und startet keinen Listener, sobald VERCEL
 * gesetzt ist. Dadurch muss Vercel kein TypeScript mehr übersetzen (das war die
 * Fehlerquelle: TS2835/TS7006 im NodeNext-Modus).
 */
import app from "../dist/index.mjs";

export default app;
