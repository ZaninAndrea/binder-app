import React from "react"

export default class Card extends React.Component {
    render() {
        return (
            <div className="footer">
                <button
                    style={{
                        background: "#ee5c87",
                        borderColor: "#ee5c87",
                    }}
                >
                    0
                </button>
                <button
                    style={{
                        background: "#fab397",
                        borderColor: "#fab397",
                    }}
                >
                    1
                </button>
                <button
                    style={{
                        background: "#f6edb2",
                        borderColor: "#f6edb2",
                    }}
                >
                    2
                </button>
                <button
                    style={{
                        background: "#cfecd0",
                        borderColor: "#cfecd0",
                    }}
                >
                    3
                </button>
                <button
                    style={{
                        background: "#a0cea7",
                        borderColor: "#a0cea7",
                    }}
                >
                    4
                </button>
                <button
                    style={{
                        background: "#69b7eb",
                        borderColor: "#69b7eb",
                    }}
                >
                    5
                </button>
            </div>
        )
    }
}
