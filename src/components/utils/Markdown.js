import React from "react"
const unified = require("unified")
const markdown = require("remark-parse")
const math = require("remark-math")
const remark2rehype = require("remark-rehype")
const katex = require("rehype-katex")
const stringify = require("rehype-stringify")

export default ({ source }) => {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: unified()
                    .use(markdown)
                    .use(math)
                    .use(remark2rehype)
                    .use(katex)
                    .use(stringify)
                    .processSync(source).contents,
            }}
        />
    )
}
