import React from "react"
import Flipcard from "@kennethormandy/react-flipcard"
import "./flipcard.css"
import { CSSTransitionGroup } from "react-transition-group" // ES6

export default class Card extends React.Component {
    state = {
        flipped: false,
        front: "front",
    }

    constructor() {
        super()

        setTimeout(() => this.setState({ front: "adsfadsfasd" }), 3000)
    }

    render() {
        return (
            <CSSTransitionGroup
                transitionName="card"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
                style={{ gridArea: "card" }}
            >
                <Flipcard
                    flipped={this.state.flipped}
                    onClick={() =>
                        this.setState(({ flipped }) => ({
                            flipped: !flipped,
                        }))
                    }
                    key={this.state.front}
                >
                    <div className="card front">{this.state.front}</div>
                    <div className="card back">Back</div>
                </Flipcard>
            </CSSTransitionGroup>
        )
    }
}
