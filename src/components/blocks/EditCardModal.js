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
    }

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
                        placeholder={"Type the question here"}
                        editable={true}
                        value={this.props.card.front}
                        onUpdate={(newValue) => {
                            if (newValue != this.props.card.front) {
                                this.props.card.front = newValue
                                this.setState({ updated: true })
                            }
                        }}
                    />
                </div>
                <div className="back">
                    <Editor
                        placeholder={"Type the answer here"}
                        editable={true}
                        value={this.props.card.back}
                        onUpdate={(newValue) => {
                            if (newValue != this.props.card.back) {
                                this.props.card.back = newValue
                                this.setState({ updated: true })
                            }
                        }}
                    />
                </div>
            </div>
        )

        const statsPanel = (
            <div className="modal-stats" key="stats-panel">
                {totalReviews > 0 ? (
                    <>
                        <p>
                            <b>Total reviews:</b> {totalReviews}
                        </p>
                        <p>
                            <b>Correct reviews:</b> {correctReviews} (
                            {percentage}%)
                        </p>
                        <p>
                            <b>Strength:</b>{" "}
                            {Math.round(
                                computeCardStrength(this.props.card) * 100
                            )}
                            %
                        </p>
                        <p>
                            <b>Durability:</b>{" "}
                            {Math.round(
                                this.props.card.halfLife / (24 * 3600 * 1000)
                            )}
                        </p>
                    </>
                ) : (
                    <p>
                        <b>Card not learned yet</b>
                    </p>
                )}
                <div style={{ display: "flex", alignItems: "center" }}>
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
                <div style={{ flexGrow: 1 }} />
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
                    <div className="modal">
                        {editorContainer}
                        {statsPanel}
                    </div>
                </Desktop>
                <Mobile>
                    <div
                        className="modalClickAway"
                        onClick={() => this.props.onClose(this.state.updated)}
                    />
                    <div className="modal mobile">
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
                        {this.state.tab === "edit"
                            ? editorContainer
                            : statsPanel}
                    </div>
                </Mobile>
            </>
        )
    }
}
