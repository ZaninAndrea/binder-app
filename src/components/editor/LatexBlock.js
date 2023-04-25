import React from "react"
import {
    Node,
    mergeAttributes,
    nodeInputRule,
    nodePasteRule,
} from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import katex from "katex"

function renderLatexBlock(source) {
    if (!source)
        return `<div class="katex-empty">Insert a LaTeX expression</div>`
    try {
        return katex.renderToString(source, {
            displayMode: true,
            strict: false,
        })
    } catch (e) {
        let errorMessage = "Unknown error"
        if (e.message.startsWith("KaTeX parse error: ")) {
            errorMessage = e.message.slice("KaTeX parse error: ".length)
        }

        return `<div class="katex-error">${errorMessage}</div>`
    }
}

const LatexBlock = ({ selected, editor, node, updateAttributes }) => {
    return (
        <NodeViewWrapper className="latex-block">
            {selected && editor.isEditable && (
                <div className="latex-block__input">
                    <textarea
                        style={{
                            width: "100%",
                        }}
                        autoFocus
                        value={node.attrs.latex}
                        onChange={(e) => {
                            updateAttributes({
                                latex: e.target.value,
                            })
                        }}
                    />
                </div>
            )}
            <div
                className="latex-block__output"
                dangerouslySetInnerHTML={{
                    __html: renderLatexBlock(node.attrs.latex),
                }}
            />
        </NodeViewWrapper>
    )
}

export default Node.create({
    name: "latex-block",
    group: "block",
    atom: true,
    selectable: true,
    priority: 1000,
    addInputRules() {
        return [
            nodeInputRule({
                find: /(^\$\$$)/gms,
                type: this.type,
                getAttributes: {
                    latex: "",
                },
            }),
        ]
    },
    addPasteRules() {
        const r = /(\$\$)([\s\S]*)(\$\$)/gms

        return [
            nodePasteRule({
                find: r,
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
                tag: "latex-block",
            },
            {
                tag: "div.math-display",
                getAttrs: (node) => {
                    return {
                        latex: node.textContent,
                    }
                },
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return ["latex-block", mergeAttributes(HTMLAttributes)]
    },
    addNodeView() {
        return ReactNodeViewRenderer(LatexBlock)
    },
})
