import React from "react"
import Flipcard from "@kennethormandy/react-flipcard"
import "../stylesheets/flipcard.css"
import { CSSTransitionGroup } from "react-transition-group" // ES6
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
                flipped: !flipped,
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
                <CSSTransitionGroup
                    transitionName="card"
                    transitionEnterTimeout={300}
                    transitionLeaveTimeout={300}
                    style={{ gridArea: "card" }}
                >
                    {this.state.card && (
                        <Flipcard
                            flipped={this.state.flipped}
                            onClick={this.onFlip}
                            key={this.state.card.id}
                        >
                            <div
                                className={
                                    this.state.card.isNew
                                        ? "card front new"
                                        : "card front"
                                }
                            >
                                {this.state.card.front}
                            </div>
                            <div
                                className={
                                    this.state.card.isNew
                                        ? "card back new"
                                        : "card back"
                                }
                            >
                                {this.state.card.back}
                            </div>
                        </Flipcard>
                    )}
                </CSSTransitionGroup>
                }
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
