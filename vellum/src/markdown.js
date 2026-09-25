// Renderizador Markdown mínimo, seguro y sin dependencias.
// Solo procesa texto ya escapado y nunca introduce HTML del usuario sin escaparlo.

function escapeHtml(src) {
    return String(src)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const PROTECT = "\u0000CODE";

function inline(s) {
    s = s
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/__([^_]+)__/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/~~([^~]+)~~/g, "<del>$1</del>");
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) => {
        const clean = String(url).replace(/["'<>]/g, "");
        if (/^(https?:|mailto:|#)/i.test(clean)) {
            return `<a class="md-a" href="${clean}" target="_blank" rel="noreferrer">${text}</a>`;
        }
        return text;
    });
    return s;
}

function renderList(items) {
    // items: array de {depth, ordered, checked, raw, text, label}
    let html = "";
    const stack = [];
    let lastTag = null;
    const open = (depth, ordered) => {
        const tag = ordered ? "ol" : "ul";
        while (stack.length > depth) {
            html += `</${stack.pop()}>`;
        }
        if (lastTag !== tag) {
            stack.push(tag);
            lastTag = tag;
            html += `<${tag} class="md-ul">`;
        }
    };
    for (const it of items) {
        open(it.depth, it.ordered);
        if (it.checked !== undefined) {
            const box =
                it.checked === "x" || it.checked === "X"
                    ? '<input type="checkbox" checked="checked" disabled aria-label="hecho" />'
                    : '<input type="checkbox" disabled aria-label="pendiente" />';
            html += `<li class="md-li"><span class="md-task">${box}<span>${inline(it.label)}</span></span></li>`;
        } else {
            html += `<li class="md-li">${inline(it.label)}</li>`;
        }
    }
    while (stack.length) html += `</${stack.pop()}>`;
    return html;
}

export function renderMarkdown(src) {
    if (typeof src !== "string" || !src.trim()) return "";
    const escaped = escapeHtml(src).replace(/\r\n/g, "\n");

    // Proteger bloques de código (ya escapados) con placeholders
    const codeBlocks = [];
    const stepped = [];
    const lines = escaped.split("\n");
    let buf = [];
    let inCode = false;
    for (const line of lines) {
        if (!inCode) {
            if (/^```/.test(line)) {
                inCode = true;
                buf = [];
            } else {
                stepped.push(line);
            }
        } else {
            if (/^```/.test(line)) {
                codeBlocks.push(buf.join("\n"));
                stepped.push(`${PROTECT}${codeBlocks.length - 1}`);
                inCode = false;
                buf = [];
            } else {
                buf.push(line);
            }
        }
    }
    if (inCode) {
        codeBlocks.push(buf.join("\n"));
        stepped.push(`${PROTECT}${codeBlocks.length - 1}`);
    }

    const out = [];
    for (let i = 0; i < stepped.length; i++) {
        const line = stepped[i];

        if (line.startsWith(PROTECT)) {
            out.push(`<pre class="md-pre"><code>${codeBlocks[Number(line.slice(PROTECT.length))] || ""}</code></pre>`);
            continue;
        }

        const h = line.match(/^(#{1,6})\s+(.*)$/);
        if (h) {
            const lvl = h[1].length;
            out.push(`<h${lvl} class="md-h">${inline(h[2])}</h${lvl}>`);
            continue;
        }

        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
            out.push('<hr class="md-hr" />');
            continue;
        }

        const quote = line.match(/^&gt;+\s*(.*)$/);
        if (quote) {
            out.push(`<blockquote class="md-bq">${inline(quote[1])}</blockquote>`);
            continue;
        }

        // Listas con orden consecutivo
        const listStart = line.match(/^(\s*)([-*]|\d+\.)\s+(\[([ xX])\]\s*)?(.*)$/);
        if (listStart) {
            const items = [
                {
                    depth: Math.min(3, Math.floor(listStart[1].length / 2)),
                    ordered: /\d/.test(listStart[2]),
                    checked: listStart[4] !== undefined ? listStart[4] : undefined,
                    label: listStart[5],
                },
            ];
            let j = i + 1;
            while (j < stepped.length) {
                const nl = stepped[j].match(/^(\s*)([-*]|\d+\.)\s+(\[([ xX])\]\s*)?(.*)$/);
                if (!nl || nl[5] === undefined && !nl[2]) break;
                if (nl[5] === undefined && nl[2]) {
                    // entrada de lista sin texto tras el marcador
                    items.push({
                        depth: Math.min(3, Math.floor(nl[1].length / 2)),
                        ordered: /\d/.test(nl[2]),
                        checked: undefined,
                        label: "",
                    });
                } else {
                    items.push({
                        depth: Math.min(3, Math.floor(nl[1].length / 2)),
                        ordered: /\d/.test(nl[2]),
                        checked: nl[4] !== undefined ? nl[4] : undefined,
                        label: nl[5],
                    });
                }
                j++;
            }
            out.push(renderList(items));
            i = j - 1;
            continue;
        }

        // Párrafo
        const para = [];
        para.push(line);
        let j = i + 1;
        while (j < stepped.length && stepped[j].trim() !== "" && !/^(#{1,6})\s/.test(stepped[j]) && !/^```/.test(stepped[j]) && !/^(-{3,}|\*{3,}|_{3,})$/.test(stepped[j]) && !/^\s*[-*]\s+/.test(stepped[j]) && !/^\s*\d+\.\s+/.test(stepped[j]) && !/^&gt;/.test(stepped[j])) {
            if (stepped[j].startsWith(PROTECT)) break;
            para.push(stepped[j]);
            j++;
        }
        out.push(`<p class="md-p">${para.map(inline).join("<br />")}</p>`);
        i = j - 1;
    }

    return out.filter(Boolean).join("\n");
}