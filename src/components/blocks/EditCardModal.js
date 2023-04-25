import React from "react"
import Editor from "../editor"
import DeleteIcon from "@material-ui/icons/Delete"
import VisibilityIcon from "@material-ui/icons/Visibility"
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff"

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
        return (
            <>
                <div className="modalClickAway" onClick={this.props.onClose} />
                <div className="toolbar">
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
                <div className="modal">
                    <div className="editor-container">
                        <div className="front">
                            <Editor
                                placeholder={"Type the question here"}
                                editable={true}
                                value={this.props.card.front}
                                onUpdate={(newValue) => {
                                    this.props.card.front = newValue
                                    this.setState({ updated: true })
                                }}
                            />
                        </div>
                        <div className="back">
                            <Editor
                                placeholder={"Type the answer here"}
                                editable={true}
                                value={this.props.card.back}
                                onUpdate={(newValue) => {
                                    this.props.card.back = newValue
                                    this.setState({ updated: true })
                                }}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
