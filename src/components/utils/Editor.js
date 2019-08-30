import React from "react"
import Markdown from "./Markdown"
import Cursor from "./Cursor"

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
    }

    constructor() {
        super()
        document.onkeypress = e => {
            e = e || window.event

            const newChar = e.key === "Enter" ? "\n" : e.key

            this.setState(({ text, curPos }) => ({
                text: text.slice(0, curPos) + newChar + text.slice(curPos),
                curPos: curPos + 1,
            }))
        }

        document.onkeydown = e => {
            e = e || window.event

            console.log(e)
            if (e.key === "Backspace")
                this.setState(({ text, curPos }) => ({
                    text:
                        curPos !== 0
                            ? text.slice(0, curPos - 1) + text.slice(curPos)
                            : text,
                    curPos: curPos !== 0 ? curPos - 1 : curPos,
                }))
            if (e.key === "Delete")
                this.setState(({ text, curPos }) => ({
                    text:
                        curPos !== text.length
                            ? text.slice(0, curPos) + text.slice(curPos + 1)
                            : text,
                }))
            if (e.key === "ArrowLeft")
                this.setState(({ curPos }) => ({
                    curPos: curPos !== 0 ? curPos - 1 : curPos,
                }))
            if (e.key === "ArrowRight")
                this.setState(({ text, curPos }) => ({
                    curPos: curPos !== text.length ? curPos + 1 : curPos,
                }))
        }
    }

    onCharClick = n => e => {
        const { left, right } = e.target.getBoundingClientRect()

        this.setState({
            curPos: e.clientX - left < right - e.clientX ? n : n + 1,
        })
    }

    render() {
        const { text, curPos } = this.state

        const paragraphs = split(text, curPos)
        console.log(paragraphs)

        return (
            <div className="editor">
                {paragraphs.map(({ text, active, startCurPos }, i) =>
                    active ? (
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
                            <Cursor key={"cursor" + curPos} />
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
        )
    }
}

export default Editor
