import React from "react"
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import { lowlight } from "./lowlight"
import LatexBlock from "./LatexBlock"
import LatexInline from "./LatexInline"
import "../../stylesheets/editor.css"

const Editor = ({ placeholder, value, editable, onUpdate, showSummary }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: !showSummary,
            }),
            Placeholder.configure({
                placeholder,
                showOnlyWhenEditable: false,
            }),
            LatexBlock,
            LatexInline,
            Table,
            TableCell,
            TableRow,
            TableHeader,
            CodeBlockLowlight.configure({
                lowlight,
            }),
        ],
        content: value,
        editable,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML())
        },
    })

    return (
        <>
            {editor && (
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{ duration: 100 }}
                    className="bubble-menu"
                    shouldShow={function ({ view, state, from, to, element }) {
                        const isChildOfMenu = this.element.contains(
                            document.activeElement
                        )
                        const hasEditorFocus = view.hasFocus() || isChildOfMenu

                        if (
                            !hasEditorFocus ||
                            state.selection.empty ||
                            !this.editor.isEditable ||
                            this.editor.isActive("latex-block")
                        ) {
                            return false
                        }

                        return true
                    }}
                >
                    <select
                        onChange={(e, value) => {
                            if (editor.isActive("latex-block")) {
                                return
                            }

                            let chain = editor.chain().focus().clearNodes()
                            switch (e.target.value) {
                                case "text":
                                    chain.setParagraph().run()
                                    break
                                case "bulletList":
                                    chain.toggleBulletList().run()
                                    break
                                case "numberedList":
                                    chain.toggleOrderedList().run()
                                    break
                                case "quote":
                                    chain.setBlockquote().run()
                                    break
                                case "code":
                                    chain.setCodeBlock().run()
                                    break
                                case "heading":
                                    chain.setHeading({ level: 2 }).run()
                                    break
                                case "math":
                                    const { from, to } = editor.state.selection
                                    const text = editor.state.doc.textBetween(
                                        from,
                                        to,
                                        " "
                                    )

                                    chain
                                        .insertContent(
                                            `<latex-block latex="${text.replaceAll(
                                                /"/g,
                                                `&quot;`
                                            )}"></latex-block>`
                                        )
                                        .run()
                                    break

                                default:
                                    break
                            }
                        }}
                        value={
                            editor.isActive("bulletList")
                                ? "bulletList"
                                : editor.isActive("bulletList")
                                ? "bulletList"
                                : editor.isActive("orderedList")
                                ? "numberedList"
                                : editor.isActive("blockquote")
                                ? "quote"
                                : editor.isActive("codeBlock")
                                ? "code"
                                : editor.isActive("heading")
                                ? "heading"
                                : editor.isActive("latex-block")
                                ? "math"
                                : "text"
                        }
                    >
                        <option value="text">Text</option>
                        <option value="heading">Heading</option>
                        <option value="bulletList">Bullet list</option>
                        <option value="numberedList">Numbered list</option>
                        <option value="quote">Quote</option>
                        <option value="code">Code</option>
                        <option value="math">Math</option>
                    </select>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        className={editor.isActive("bold") ? "active" : ""}
                    >
                        <b>B</b>
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        className={editor.isActive("italic") ? "active" : ""}
                    >
                        <i>i</i>
                    </button>
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleCode().run()
                        }
                        className={editor.isActive("code") ? "active" : ""}
                    >
                        {"<>"}
                    </button>
                    <button
                        onClick={() => {
                            if (editor.isActive("latex-inline")) {
                                editor
                                    .chain()
                                    .insertContent(
                                        editor.getAttributes("latex-inline")
                                            .latex
                                    )
                                    .run()
                            } else {
                                const { from, to } = editor.state.selection
                                const text = editor.state.doc.textBetween(
                                    from,
                                    to,
                                    " "
                                )

                                editor
                                    .chain()
                                    .insertContent(
                                        `<latex-inline latex="${text.replaceAll(
                                            /"/g,
                                            `&quot;`
                                        )}"></latex-inline>`
                                    )
                                    .run()
                            }
                        }}
                        className={
                            editor.isActive("latex-inline") ? "active" : ""
                        }
                    >
                        {"√"}
                    </button>
                </BubbleMenu>
            )}
            <EditorContent
                editor={editor}
                className={showSummary ? "editor summary" : "editor"}
            />
        </>
    )
}

export default Editor
