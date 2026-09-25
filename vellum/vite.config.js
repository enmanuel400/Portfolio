import { defineConfig } from "vite";

// En build emitimos un único script clásico (no módulo): así la app funciona
// igual por file:// (Electron loadFile) que por http, y evita el bloqueo CORS
// de ES modules sobre file://.
function classicEntryScript() {
    return {
        name: "classic-entry-script",
        transformIndexHtml(html, ctx) {
            if (!ctx || !ctx.bundle) return html; // dev: conservar modules para HMR
            return html.replace(
                /<script type="module" crossorigin src="([^"]+)"><\/script>/,
                '<script src="$1" defer></script>'
            );
        },
    };
}

export default defineConfig({
    root: "./src",
    base: "./",
    server: {
        host: "0.0.0.0",
        port: 5174,
        strictPort: true,
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        // Script único clásico (IIFE): funciona igual por file:// (Electron) y por http
        rollupOptions: {
            output: {
                format: "iife",
                inlineDynamicImports: true,
                entryFileNames: "assets/[name].js",
            },
        },
    },
    plugins: [classicEntryScript()],
});
