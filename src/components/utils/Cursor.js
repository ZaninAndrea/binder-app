import React from "react"

export default class Cursor extends React.Component {
    state = { on: true }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState(({ on }) => ({ on: !on }))
        }, 400)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return (
            <span style={{ position: "relative", width: "0", height: "0" }}>
                <span
                    style={{
                        position: "absolute",
                        left: "-0.5ch",
                        fontWeight: "light",
                    }}
                >
                    {this.state.on ? "|" : ""}
                </span>
            </span>
        )
    }
}
