import React from "react"
import Markdown, { split } from "./Markdown"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"

class Editor extends React.Component {
    state = {
        text: "",
        curParagraph: 0,
        focused: false,
        curSelection: 0,
    }

    setSelection = true

    constructor(props) {
        super(props)

        this.state.text = props.value || ""
    }

    getText = () => (this.textarea ? this.textarea.value : null)

    selectParagraph = i => () => {
        if (this.state.focused) {
            let paragraphs = split(this.state.text)

            paragraphs[this.state.curParagraph] = this.getText()
            const newText = paragraphs.join("\n")
            this.props.onTextUpdate(newText)

            this.setState({
                curParagraph: i,
                text: newText,
                curSelection: 0,
            })
            this.setSelection = true
        } else {
            this.setState({
                curParagraph: i,
                curSelection: 0,
            })
            this.setSelection = true
        }
    }

    onKeyUp = e => {
        if (e.key === "Enter") {
            let paragraphs = split(this.state.text)
            const curText = this.getText()
            paragraphs[this.state.curParagraph] = curText

            const isOpenLatexBlock = text =>
                text.trim().startsWith("$$") &&
                (!text.trim().endsWith("$$") || text.trim() === "$$")

            // Enter inside a latex block should not split the paragraph
            const paragraphIncrease = !isOpenLatexBlock(curText)

            const newText = paragraphs.join("\n")
            this.props.onTextUpdate(newText)

            this.setState(({ curParagraph, curSelection }) => ({
                text: newText,
                curParagraph: paragraphIncrease
                    ? curParagraph + 1
                    : curParagraph,
                curSelection: paragraphIncrease
                    ? 0
                    : this.textarea.selectionStart + 1,
            }))
            this.setSelection = true
        }
    }

    onKeyDown = e => {
        if (
            e.key === "Backspace" &&
            this.textarea.selectionEnd === 0 &&
            this.state.curParagraph !== 0
        ) {
            let paragraphs = split(this.state.text)
            paragraphs.splice(this.state.curParagraph)

            let curSelection = paragraphs[this.state.curParagraph - 1].length
            paragraphs[this.state.curParagraph - 1] += this.getText()

            const newText = paragraphs.join("\n")
            this.props.onTextUpdate(newText)

            this.setState(({ curParagraph }) => ({
                text: newText,
                curParagraph: curParagraph - 1,
                curSelection,
            }))
            this.setSelection = true

            e.preventDefault()
        } else if (
            e.key === "Delete" &&
            this.textarea.selectionStart === this.textarea.value.length &&
            this.state.curParagraph !== split(this.state.text).length - 1
        ) {
            let paragraphs = split(this.state.text)
            const nextLine = paragraphs.splice(this.state.curParagraph + 1)[0]
            const currentLine = this.getText()

            paragraphs[this.state.curParagraph] = currentLine + nextLine

            const newText = paragraphs.join("\n")
            this.props.onTextUpdate(newText)

            this.setState(({ curParagraph }) => ({
                text: newText,
                curParagraph: curParagraph,
                curSelection: currentLine.length,
            }))
            this.setSelection = true
            e.preventDefault()
        } else if (
            (e.key === "ArrowLeft" || e.key === "ArrowUp") &&
            this.textarea.selectionEnd === 0 &&
            this.state.curParagraph !== 0
        ) {
            let paragraphs = split(this.state.text)
            let curSelection = paragraphs[this.state.curParagraph - 1].length
            paragraphs[this.state.curParagraph] = this.getText()

            const newText = paragraphs.join("\n")
            this.props.onTextUpdate(newText)

            this.setState(({ curParagraph }) => ({
                text: newText,
                curParagraph: curParagraph - 1,
                curSelection,
            }))
            this.setSelection = true

            e.preventDefault()
        } else if (
            (e.key === "ArrowRight" || e.key === "ArrowDown") &&
            this.textarea.selectionStart === this.textarea.value.length &&
            this.state.curParagraph !== split(this.state.text).length - 1
        ) {
            let paragraphs = split(this.state.text)
            paragraphs[this.state.curParagraph] = this.getText()

            const newText = paragraphs.join("\n")
            this.props.onTextUpdate(newText)

            this.setState(({ curParagraph }) => ({
                text: newText,
                curParagraph: curParagraph + 1,
                curSelection: 0,
            }))
            this.setSelection = true

            e.preventDefault()
        }
    }

    render() {
        const { text, curParagraph } = this.state

        const paragraphs = split(text)

        return (
            <ClickAwayListener
                onClickAway={() => {
                    if (this.state.focused) {
                        let paragraphs = split(this.state.text)
                        paragraphs[this.state.curParagraph] = this.getText()

                        const newText = paragraphs.join("\n")
                        this.props.onTextUpdate(newText)

                        this.setState({
                            text: newText,
                            focused: false,
                        })

                        this.textarea = null
                    }
                }}
                mouseEvent="onMouseDown"
            >
                <div
                    className="editor"
                    onClick={() => this.setState({ focused: true })}
                >
                    {paragraphs.map((text, i) =>
                        i === curParagraph && this.state.focused ? (
                            <p
                                className="paragraph active"
                                key={"paragraph_" + i}
                            >
                                <TextareaAutosize
                                    defaultValue={text}
                                    key={text}
                                    ref={el => {
                                        this.textarea = el
                                        if (el !== null) {
                                            el.focus()

                                            if (this.setSelection) {
                                                el.selectionStart = this.state.curSelection
                                                el.selectionEnd = this.state.curSelection
                                                this.setSelection = false
                                            }
                                        }
                                    }}
                                    onKeyUp={this.onKeyUp}
                                    onKeyDown={this.onKeyDown}
                                />
                            </p>
                        ) : (
                            <div
                                key={"paragraph_" + i}
                                onClick={this.selectParagraph(i)}
                                className="paragraph"
                            >
                                <Markdown source={text} />
                            </div>
                        )
                    )}
                </div>
            </ClickAwayListener>
        )
    }
}

export default Editor
