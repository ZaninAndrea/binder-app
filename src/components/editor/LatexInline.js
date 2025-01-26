import React from "react"
import {
    Node,
    mergeAttributes,
    nodeInputRule,
    nodePasteRule,
} from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import katex from "katex"
require("katex/contrib/mhchem/mhchem.js")

function renderLatexInline(source) {
    if (source === "" || source === null || source === undefined)
        return `<div class="katex-empty">Insert a LaTeX expression</div>`
    try {
        return katex.renderToString(source.toString(), {
            displayMode: false,
            strict: false,
        })
    } catch (e) {
        let errorMessage = "Unknown error"
        if (e.message.startsWith("KaTeX parse error: ")) {
            errorMessage = e.message.slice("KaTeX parse error: ".length)
        } else {
            console.error(e)
        }

        return `<div class="katex-error">${errorMessage}</div>`
    }
}

const LatexInline = ({ selected, editor, node, updateAttributes }) => {
    return (
        <NodeViewWrapper className="latex-inline">
            <div
                className="latex-inline-output"
                dangerouslySetInnerHTML={{
                    __html: renderLatexInline(node.attrs.latex),
                }}
            />
        </NodeViewWrapper>
    )
}

export default Node.create({
    name: "latex-inline",
    group: "inline",
    inline: true,
    atom: true,
    selectable: true,
    priority: 900,
    addInputRules() {
        return [
            nodePasteRule({
                find: /(\$)([^\s]?.+?[^\s]*?)(\$)/g,
                type: this.type,
                getAttributes: (match) => {
                    return {
                        latex: match[2],
                    }
                },
            }),
        ]
    },
    addPasteRules() {
        return [
            nodePasteRule({
                find: /(\$)([^\s\$][^\$]*[^\s\$]*)(\$)/g,
                type: this.type,
                getAttributes: (match) => {
                    return {
                        latex: match[2],
                    }
                },
            }),
        ]
    },
    addAttributes() {
        return {
            latex: {
                default: "",
            },
        }
    },
    parseHTML() {
        return [
            {
                tag: "latex-inline",
            },
            {
                tag: "span.math-inline",
                getAttrs: (node) => ({
                    latex: node.textContent.toString(),
                }),
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return ["latex-inline", mergeAttributes(HTMLAttributes)]
    },
    addNodeView() {
        return ReactNodeViewRenderer(LatexInline)
    },
})
