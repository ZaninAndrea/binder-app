import React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import FileHandler from "@tiptap-pro/extension-file-handler"
import Image from "@tiptap/extension-image"
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
                Image.configure({
                    allowBase64: true,
                }),
                FileHandler.configure({
                    allowedMimeTypes: [
                        "image/png",
                        "image/jpeg",
                        "image/gif",
                        "image/webp",
                    ],
                    onDrop: (currentEditor, files, pos) => {
                        files.forEach((file) => {
                            const fileReader = new FileReader()

                            fileReader.readAsDataURL(file)
                            fileReader.onload = () => {
                                currentEditor
                                    .chain()
                                    .insertContentAt(pos, {
                                        type: "image",
                                        attrs: {
                                            src: fileReader.result,
                                        },
                                    })
                                    .focus()
                                    .run()
                            }
                        })
                    },
                    onPaste: (currentEditor, files, htmlContent) => {
                        files.forEach((file) => {
                            if (htmlContent) {
                                // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
                                // you could extract the pasted file from this url string and upload it to a server for example
                                console.log(htmlContent) // eslint-disable-line no-console
                                return false
                            }

                            const fileReader = new FileReader()

                            fileReader.readAsDataURL(file)
                            fileReader.onload = () => {
                                currentEditor
                                    .chain()
                                    .insertContentAt(
                                        currentEditor.state.selection.anchor,
                                        {
                                            type: "image",
                                            attrs: {
                                                src: fileReader.result,
                                            },
                                        }
                                    )
                                    .focus()
                                    .run()
                            }
                        })
                    },
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
