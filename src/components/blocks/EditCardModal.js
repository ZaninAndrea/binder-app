import React from "react"
import Editor from "../utils/Editor"

export default class EditCardModal extends React.Component {
    render() {
        console.log(this.props)

        return (
            <>
                <div className="modalClickAway" onClick={this.props.onClose} />
                <div className="modal">
                    <div className="editor-container">
                        <div className="front">
                            <Editor
                                value={this.props.card.front}
                                onTextUpdate={newText => {
                                    this.props.card.front = newText
                                }}
                            />
                        </div>
                        <div className="back">
                            <Editor
                                value={this.props.card.back}
                                onTextUpdate={newText => {
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
