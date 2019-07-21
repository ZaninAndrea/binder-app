import React from "react"

export default class Card extends React.Component {
    render() {
        const { onGrade, isNew, onOk } = this.props
        return (
            <div className="footer">
                {isNew ? (
                    <button
                        style={{
                            background: "#69b7eb",
                            borderColor: "#69b7eb",
                        }}
                        className="okButton"
                        onClick={onOk}
                    >
                        Ok
                    </button>
                ) : (
                    <>
                        <button
                            style={{
                                background: "#ee5c87",
                                borderColor: "#ee5c87",
                            }}
                            className="gradeButton"
                            onClick={() => onGrade(0)}
                        >
                            0
                        </button>
                        <button
                            style={{
                                background: "#fab397",
                                borderColor: "#fab397",
                            }}
                            className="gradeButton"
                            onClick={() => onGrade(1)}
                        >
                            1
                        </button>
                        <button
                            style={{
                                background: "#f6edb2",
                                borderColor: "#f6edb2",
                            }}
                            className="gradeButton"
                            onClick={() => onGrade(2)}
                        >
                            2
                        </button>
                        <button
                            style={{
                                background: "#cfecd0",
                                borderColor: "#cfecd0",
                            }}
                            className="gradeButton"
                            onClick={() => onGrade(3)}
                        >
                            3
                        </button>
                        <button
                            style={{
                                background: "#a0cea7",
                                borderColor: "#a0cea7",
                            }}
                            className="gradeButton"
                            onClick={() => onGrade(4)}
                        >
                            4
                        </button>
                        <button
                            style={{
                                background: "#69b7eb",
                                borderColor: "#69b7eb",
                            }}
                            className="gradeButton"
                            onClick={() => onGrade(5)}
                        >
                            5
                        </button>
                    </>
                )}
            </div>
        )
    }
}
