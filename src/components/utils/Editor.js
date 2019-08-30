import React from "react"
import Markdown from "./Markdown"
import Cursor from "./Cursor"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"

function Char({ text, pos, onCharClick }) {
    if (text === "\n") return <br />

    return <span onClick={onCharClick(pos)}>{text}</span>
}

function split(text, curPos) {
    let lines = text.split("\n")
    let paragraphs = []

    // group latex blocks in a single paragraph
    let accumulatingLatex = false
    let accumulatedLine = ""

    let accumulatedCurPos = 0
    let previousCurPos = 0
    let alreadyFoundActive = false
    let isActive = false

    for (let line of lines) {
        accumulatedCurPos += line.length + 1
        if (!alreadyFoundActive && accumulatedCurPos > curPos) {
            isActive = true
            alreadyFoundActive = true
        }

        if (!accumulatingLatex && !line.startsWith("$$")) {
            paragraphs.push({
                active: isActive,
                text: line,
                startCurPos: previousCurPos,
            })
            isActive = false
            previousCurPos = accumulatedCurPos

            continue
        } else if (!accumulatingLatex && line.startsWith("$$")) {
            accumulatedLine = line
            accumulatingLatex = true
            continue
        } else if (accumulatingLatex && !line.startsWith("$$")) {
            accumulatedLine += "\n" + line
            continue
        } else if (accumulatingLatex && line.startsWith("$$")) {
            accumulatedLine += "\n" + line
            accumulatingLatex = false
            paragraphs.push({
                active: isActive,
                text: accumulatedLine,
                startCurPos: previousCurPos,
            })
            accumulatedLine = ""
            isActive = false
            previousCurPos = accumulatedCurPos
            continue
        }
    }

    if (accumulatingLatex) {
        paragraphs.push({
            active: isActive,
            text: accumulatedLine,
            startCurPos: previousCurPos,
        })
    }

    return paragraphs
}

class Editor extends React.Component {
    state = {
        text: "",
        curPos: 0,
        focused: false,
    }

    constructor(props) {
        super(props)

        document.addEventListener("keypress", this.onKeyPress)
        document.addEventListener("keydown", this.onKeyDown)

        this.state.text = props.value || ""
    }

    onKeyPress = e => {
        if (!this.state.focused) return

        e = e || window.event

        const newChar = e.key === "Enter" ? "\n" : e.key

        this.setState(({ text, curPos }) => {
            const newText = text.slice(0, curPos) + newChar + text.slice(curPos)
            this.props.onTextUpdate(newText)

            return {
                text: newText,
                curPos: curPos + 1,
            }
        })

        e.preventDefault()
    }

    onKeyDown = e => {
        if (!this.state.focused) return

        e = e || window.event

        if (e.key === "Backspace")
            this.setState(({ text, curPos }) => {
                const newText =
                    curPos !== 0
                        ? text.slice(0, curPos - 1) + text.slice(curPos)
                        : text

                this.props.onTextUpdate(newText)
                return {
                    text: newText,
                    curPos: curPos !== 0 ? curPos - 1 : curPos,
                }
            })
        if (e.key === "Delete")
            this.setState(({ text, curPos }) => {
                const newText =
                    curPos !== text.length
                        ? text.slice(0, curPos) + text.slice(curPos + 1)
                        : text

                this.props.onTextUpdate(newText)

                return {
                    text: newText,
                }
            })
        if (e.key === "ArrowLeft")
            this.setState(({ curPos }) => ({
                curPos: curPos !== 0 ? curPos - 1 : curPos,
            }))
        if (e.key === "ArrowRight")
            this.setState(({ text, curPos }) => ({
                curPos: curPos !== text.length ? curPos + 1 : curPos,
            }))
    }

    componentWillUnmount = () => {
        document.removeEventListener("keypress", this.onKeyPress)
        document.removeEventListener("keydown", this.onKeyDown)
    }

    onCharClick = n => e => {
        const { left, right } = e.target.getBoundingClientRect()

        this.setState({
            curPos: e.clientX - left < right - e.clientX ? n : n + 1,
        })

        e.preventDefault()
    }

    render() {
        const { text, curPos } = this.state

        const paragraphs = split(text, curPos)

        return (
            <ClickAwayListener
                onClickAway={() => this.setState({ focused: false })}
                mouseEvent="onMouseDown"
            >
                <div
                    className="editor"
                    onClick={() => this.setState({ focused: true })}
                >
                    {paragraphs.map(({ text, active, startCurPos }, i) =>
                        active && this.state.focused ? (
                            <p className="active" key={"paragraph_" + i}>
                                {text
                                    .slice(0, curPos - startCurPos)
                                    .split("")
                                    .map((char, i) => (
                                        <Char
                                            onCharClick={this.onCharClick}
                                            pos={startCurPos + 1}
                                            key={startCurPos + 1}
                                            text={char}
                                        />
                                    ))}
                                {this.state.focused && (
                                    <Cursor key={"cursor" + curPos} />
                                )}
                                {text
                                    .slice(curPos - startCurPos)
                                    .split("")
                                    .map((char, i) => (
                                        <Char
                                            onCharClick={this.onCharClick}
                                            pos={curPos + i}
                                            key={curPos + i}
                                            text={char}
                                        />
                                    ))}
                            </p>
                        ) : (
                            <div
                                key={"paragraph_" + i}
                                onClick={() => {
                                    this.setState({ curPos: startCurPos })
                                }}
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
