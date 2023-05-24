import React from "react"
import Editor from "../editor"
import DeleteIcon from "@material-ui/icons/Delete"
import VisibilityIcon from "@material-ui/icons/Visibility"
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff"
import CloseIcon from "@material-ui/icons/Close"
import { Mobile, Desktop } from "../utils/MobileDesktop"

export default class EditCardModal extends React.Component {
    state = {
        updated: false,
    }
    render() {
        const totalReviews = this.props.card.totalRepetitions
        const correctReviews = this.props.card.correctRepetitions
        const percentage = Math.round(
            totalReviews === 0 ? 100 : (100 * correctReviews) / totalReviews
        )

        const editorContainer = (
            <div className="editor-container">
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

        const cardToolbar = (
            <div className="toolbar">
                <button
                    className="close"
                    onClick={() => this.props.onClose(this.state.updated)}
                >
                    <CloseIcon />
                </button>
                <span className="stats-tool">
                    {totalReviews > 0
                        ? `${percentage}% correct reviews out of ${totalReviews}`
                        : "No reviews yet"}
                </span>
                <button
                    className="show-hide"
                    onClick={this.props.onTogglePaused}
                >
                    {this.props.card.paused ? (
                        <VisibilityIcon />
                    ) : (
                        <VisibilityOffIcon />
                    )}
                </button>
                <button className="delete" onClick={this.props.onDelete}>
                    <DeleteIcon />
                </button>
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
                        {cardToolbar}
                        {editorContainer}
                    </div>
                </Desktop>
                <Mobile>
                    <div
                        className="modalClickAway"
                        onClick={() => this.props.onClose(this.state.updated)}
                    />
                    <div className="modal">
                        {cardToolbar}
                        {editorContainer}
                    </div>
                </Mobile>
            </>
        )
    }
}
