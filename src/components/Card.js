import React from "react"
import Deck from "../controller/deck"
import Footer from "./Footer"

export default class Card extends React.Component {
    deck = new Deck()

    state = {
        flipped: false,
        card: this.deck.nextCard(),
        showFooter: false,
    }

    onFlip = () => {
        this.setState(({ flipped }) => {
            return {
                flipped: true,
                showFooter: true,
            }
        })
    }

    onGrade = quality => {
        this.deck.grade(quality)
        this.setState({
            card: this.deck.nextCard(),
            flipped: false,
            showFooter: false,
        })
    }
    onOk = () => {
        this.setState({
            card: this.deck.nextCard(),
            flipped: false,
            showFooter: false,
        })
    }

    render() {
        return (
            <>
                {this.state.card && (
                    <>
                        <div className="card">
                            <div className="front">{this.state.card.front}</div>
                            <div
                                className={
                                    this.state.flipped ? "back" : "back hidden"
                                }
                                onClick={this.onFlip}
                            >
                                {this.state.flipped
                                    ? this.state.card.back
                                    : "show"}
                            </div>
                        </div>
                    </>
                )}
                {this.state.showFooter && (
                    <Footer
                        onGrade={this.onGrade}
                        isNew={this.state.card.isNew}
                        onOk={this.onOk}
                    />
                )}
            </>
        )
    }
}
