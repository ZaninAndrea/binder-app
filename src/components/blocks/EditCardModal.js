import React from "react"
import Editor from "../editor"
import DeleteIcon from "@material-ui/icons/Delete"
import VisibilityIcon from "@material-ui/icons/Visibility"
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff"
import CloseIcon from "@material-ui/icons/Close"
import { Mobile, Desktop } from "../utils/MobileDesktop"
import Button from "@mui/joy/Button"
import Switch, { switchClasses } from "@mui/joy/Switch"
import Tabs from "@mui/joy/Tabs"
import TabList from "@mui/joy/TabList"
import Tab from "@mui/joy/Tab"
import TabPanel from "@mui/joy/TabPanel"
import { computeCardStrength } from "../../controller/deck"

export default class EditCardModal extends React.Component {
    state = {
        updated: false,
        tab: "edit",
        focusedEditor: null,
    }

    frontEditor = null
    backEditor = null

    handlePopState = (e) => {
        this.props.onClose(this.state.updated)
    }

    componentDidMount() {
        window.addEventListener("popstate", this.handlePopState)
    }
    componentWillUnmount() {
        window.removeEventListener("popstate", this.handlePopState)
    }

    render() {
        const totalReviews = this.props.card.totalRepetitions
        const correctReviews = this.props.card.correctRepetitions
        const percentage = Math.round(
            totalReviews === 0 ? 100 : (100 * correctReviews) / totalReviews
        )

        const editorContainer = (
            <div className="modal-editor" key="edit-panel">
                <div className="front">
                    <Editor
                        editorRef={(ref) => {
                            this.frontEditor = ref
                        }}
                        placeholder={"Type the question here"}
                        editable={true}
                        value={this.props.card.front}
                        onUpdate={(newValue) => {
                            if (newValue != this.props.card.front) {
                                this.props.card.front = newValue
                                this.setState({ updated: true })
                            }
                        }}
                        onFocus={() => {
                            this.setState({ focusedEditor: "front" })
                        }}
                        onBlur={() => {
                            this.forceUpdate()
                        }}
                    />
                </div>
                <div className="back">
                    <Editor
                        editorRef={(ref) => {
                            this.backEditor = ref
                        }}
                        placeholder={"Type the answer here"}
                        editable={true}
                        value={this.props.card.back}
                        onUpdate={(newValue) => {
                            if (newValue != this.props.card.back) {
                                this.props.card.back = newValue
                                this.setState({ updated: true })
                            }
                        }}
                        onFocus={() => {
                            this.setState({ focusedEditor: "back" })
                        }}
                        onBlur={() => {
                            this.forceUpdate()
                        }}
                    />
                </div>
            </div>
        )

        const activeEditor =
            this.state.focusedEditor === "front"
                ? this.frontEditor
                : this.state.focusedEditor === "back"
                ? this.backEditor
                : null

        const editToolbar = (
            <div className="modal-toolbar" key="edit-toolbar">
                <select
                    style={{
                        background: "inherit",
                        border: "none",
                        outline: "none",
                    }}
                    disabled={!activeEditor}
                    onChange={(e, value) => {
                        if (activeEditor.isActive("latex-block")) {
                            return
                        }

                        let chain = activeEditor.chain().focus().clearNodes()
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
                                const { from, to } =
                                    activeEditor.state.selection
                                const text = activeEditor.state.doc.textBetween(
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
                        activeEditor === null
                            ? ""
                            : activeEditor.isActive("bulletList")
                            ? "bulletList"
                            : activeEditor.isActive("bulletList")
                            ? "bulletList"
                            : activeEditor.isActive("orderedList")
                            ? "numberedList"
                            : activeEditor.isActive("blockquote")
                            ? "quote"
                            : activeEditor.isActive("codeBlock")
                            ? "code"
                            : activeEditor.isActive("heading")
                            ? "heading"
                            : activeEditor.isActive("latex-block")
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
                    disabled={!activeEditor}
                    onClick={() =>
                        activeEditor.chain().focus().toggleBold().run()
                    }
                    className={
                        activeEditor !== null && activeEditor.isActive("bold")
                            ? "active"
                            : ""
                    }
                >
                    <b>B</b>
                </button>
                <button
                    disabled={!activeEditor}
                    onClick={() =>
                        activeEditor.chain().focus().toggleItalic().run()
                    }
                    className={
                        activeEditor !== null && activeEditor.isActive("italic")
                            ? "active"
                            : ""
                    }
                >
                    <i>i</i>
                </button>
                <button
                    disabled={!activeEditor}
                    onClick={() =>
                        activeEditor.chain().focus().toggleCode().run()
                    }
                    className={
                        activeEditor !== null && activeEditor.isActive("code")
                            ? "active"
                            : ""
                    }
                >
                    {"<>"}
                </button>
                <button
                    disabled={!activeEditor}
                    onClick={() => {
                        if (activeEditor.isActive("latex-inline")) {
                            activeEditor
                                .chain()
                                .insertContent(
                                    activeEditor.getAttributes("latex-inline")
                                        .latex
                                )
                                .run()
                        } else {
                            const { from, to } = activeEditor.state.selection
                            const text = activeEditor.state.doc.textBetween(
                                from,
                                to,
                                " "
                            )

                            activeEditor
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
                        activeEditor !== null &&
                        activeEditor.isActive("latex-inline")
                            ? "active"
                            : ""
                    }
                >
                    {"√"}
                </button>
            </div>
        )

        const statsPanel = (
            <div className="modal-stats" key="stats-panel">
                <Desktop>
                    <p className="stats-header">Stats</p>
                </Desktop>
                {totalReviews > 0 ? (
                    <>
                        <div className="stats-block">
                            <div className="score">
                                {Math.round(
                                    computeCardStrength(this.props.card) * 100
                                )}
                                %
                            </div>
                            <div className="description">Strength</div>
                        </div>
                        <div className="stats-block">
                            <div className="score">
                                {Math.round(
                                    this.props.card.halfLife /
                                        (24 * 3600 * 1000)
                                )}
                            </div>
                            <div className="description">Durability</div>
                        </div>
                        <div className="stats-block">
                            <div className="score">{totalReviews}</div>
                            <div className="description">Total reviews</div>
                        </div>
                        <div className="stats-block">
                            <div className="score">
                                {correctReviews} ({percentage}%)
                            </div>
                            <div className="description">Correct reviews</div>
                        </div>
                    </>
                ) : (
                    <p>
                        <b>Card not learned yet</b>
                    </p>
                )}
                <div style={{ flexGrow: 1 }} />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                    }}
                >
                    <b style={{ marginRight: "8px" }}>Active:</b>
                    <Switch
                        size="sm"
                        checked={!this.props.card.paused}
                        variant="solid"
                        onChange={this.props.onTogglePaused}
                        sx={{
                            [`&.${switchClasses.checked}`]: {
                                "--Switch-trackBackground":
                                    "var(--primary-highlight-color)",
                                "&:hover": {
                                    "--Switch-trackBackground":
                                        "var(--primary-highlight-color)",
                                },
                            },
                        }}
                    />
                </div>
                <Button
                    variant="solid"
                    onClick={this.props.onDelete}
                    color="danger"
                >
                    Delete card
                </Button>
            </div>
        )

        return (
            <>
                <Desktop>
                    <div
                        className="modalClickAway"
                        onClick={() => this.props.onClose(this.state.updated)}
                    />
                    <div className="modal desktop">
                        {editToolbar}
                        {editorContainer}
                        {statsPanel}
                    </div>
                </Desktop>
                <Mobile>
                    <div
                        className="modalClickAway"
                        onClick={() => this.props.onClose(this.state.updated)}
                    />
                    <div
                        className={
                            this.state.tab === "edit"
                                ? "modal mobile edit-tab"
                                : "modal mobile stats-tab"
                        }
                    >
                        <div className="modal-mobile-header">
                            <Tabs
                                key="tabs"
                                className="modal-mobile-tabs"
                                value={this.state.tab}
                                size="sm"
                                onChange={(e, newValue) =>
                                    this.setState({ tab: newValue })
                                }
                            >
                                <TabList>
                                    <Tab value="edit" key="edit">
                                        Edit
                                    </Tab>
                                    <Tab value="info" key="info">
                                        Info
                                    </Tab>
                                </TabList>
                            </Tabs>
                            <button
                                key="close"
                                className="close"
                                onClick={() =>
                                    this.props.onClose(this.state.updated)
                                }
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        {this.state.tab === "edit" ? (
                            <>
                                {editorContainer}
                                {editToolbar}
                            </>
                        ) : (
                            statsPanel
                        )}
                    </div>
                </Mobile>
            </>
        )
    }
}
