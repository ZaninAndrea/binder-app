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

const Editor = ({
    placeholder,
    value,
    editable,
    onUpdate,
    showSummary,
    editorRef,
    onFocus,
    onBlur,
}) => {
    const editor = useEditor(
        {
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
            onBeforeCreate: ({ editor }) => {
                if (editorRef) editorRef(editor)
            },
            onFocus: ({ editor }) => {
                if (onFocus) onFocus()
            },
            onBlur: ({ editor }) => {
                if (onBlur) onBlur()
            },
            onUpdate: ({ editor }) => {
                onUpdate(editor.getHTML())
            },
        },
        editable ? [editable] : [editable, value]
    )

    return (
        <EditorContent
            editor={editor}
            className={showSummary ? "editor summary" : "editor"}
        />
    )
}

export default Editor
