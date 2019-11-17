import React from "react"
const unified = require("unified")
const markdown = require("remark-parse")
const math = require("remark-math")
const remark2rehype = require("remark-rehype")
const katex = require("rehype-katex")
const stringify = require("rehype-stringify")

export function split(text) {
    let lines = text.split("\n")
    let paragraphs = []

    // group latex blocks in a single paragraph
    let accumulatingLatex = false
    let accumulatedLine = ""

    for (let line of lines) {
        if (!accumulatingLatex && !line.startsWith("$$")) {
            paragraphs.push(line)

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
            paragraphs.push(accumulatedLine)
            accumulatedLine = ""
            continue
        }
    }

    if (accumulatingLatex) {
        paragraphs.push(accumulatedLine)
    }

    return paragraphs
}

function memoize(f) {
    const memory = {}

    return source => {
        if (!(source in memory)) memory[source] = f(source)

        return memory[source]
    }
}

function renderPipeline(source) {
    return unified()
        .use(markdown)
        .use(math)
        .use(remark2rehype)
        .use(katex)
        .use(stringify)
        .processSync(source).contents
}

const renderMarkdown = memoize(renderPipeline)

export default ({ source }) => {
    let blocks = split(source)

    return (
        <div>
            {blocks.map((block, i) => (
                <div
                    className="markdownRender"
                    key={i}
                    dangerouslySetInnerHTML={{
                        __html: renderMarkdown(block),
                    }}
                />
            ))}
        </div>
    )
}
