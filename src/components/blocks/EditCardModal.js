import React from "react"
import Editor from "../utils/Editor"
import DeleteIcon from "@material-ui/icons/Delete"
import VisibilityIcon from "@material-ui/icons/Visibility"
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff"

export default class EditCardModal extends React.Component {
    render() {
        const totalReviews = this.props.card.repetitions.length
        const correctReviews = this.props.card.repetitions.reduce(
            (acc, curr) => (curr.quality >= 4 ? acc + 1 : acc),
            0
        )
        const percentage = Math.round(
            totalReviews === 0 ? 100 : (100 * correctReviews) / totalReviews
        )
        return (
            <>
                <div className="modalClickAway" onClick={this.props.onClose} />
                <div className="modal">
                    <div className="toolbar">
                        <span className="stats-tool">
                            {percentage}% correct reviews out of {totalReviews}
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
                        <button
                            className="delete"
                            onClick={this.props.onDelete}
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                    <div className="editor-container">
                        <div className="front">
                            <Editor
                                value={this.props.card.front}
                                onTextUpdate={(newText) => {
                                    this.props.card.front = newText
                                }}
                            />
                        </div>
                        <div className="back">
                            <Editor
                                value={this.props.card.back}
                                onTextUpdate={(newText) => {
                                    this.props.card.back = newText
                                }}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
