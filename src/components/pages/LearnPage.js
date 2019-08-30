import React from "react"
import Footer from "../blocks/Footer"
import Markdown from "../utils/Markdown"

export default class LearnPage extends React.Component {
    state = {
        flipped: false,
        card: null,
        showFooter: false,
        deckIndex: -1,
        done: true,
    }

    constructor(props) {
        super(props)

        this.state = {
            ...this.state,
            ...this.nextDeckState(),
        }

        if (!this.state.done)
            this.state.card = this.props.decks[
                this.state.deckIndex
            ].nextCardToLearn()
    }

    onFlip = () => {
        this.setState(({ flipped }) => {
            return {
                flipped: true,
                showFooter: true,
            }
        })
    }

    nextCard = () => {
        const currentDeck = this.props.decks[this.state.deckIndex]

        let nextCard, _deckIndex, _done

        if (currentDeck.hasCardsToLearn()) {
            nextCard = currentDeck.nextCardToLearn()
            _deckIndex = this.state.deckIndex
            _done = false
        } else {
            let { deckIndex, done } = this.nextDeckState()
            _deckIndex = deckIndex
            _done = done

            nextCard = done
                ? null
                : this.props.decks[deckIndex].nextCardToLearn()
        }

        this.setState({
            card: nextCard,
            deckIndex: _deckIndex,
            done: _done,
            flipped: false,
            showFooter: false,
        })
    }

    onOk = () => {
        this.props.decks[this.state.deckIndex].learn()
        this.nextCard()
    }

    nextDeckState = () => {
        let deckIndex = this.state.deckIndex
        // advance to next deck
        deckIndex++

        // skip decks with no cards to review until you run out of decks
        while (
            deckIndex < this.props.decks.length &&
            !this.props.decks[deckIndex].hasCardsToLearn()
        ) {
            deckIndex++
        }

        let done
        if (deckIndex === this.props.decks.length) {
            done = true
        } else {
            done = false
        }

        return {
            deckIndex,
            done,
        }
    }

    render() {
        if (this.state.done) {
            return (
                <div className="card">
                    <div className="front">You have no cards to learn</div>
                </div>
            )
        } else
            return (
                <>
                    {this.state.card && (
                        <>
                            <div className="card">
                                <div className="front">
                                    <Markdown source={this.state.card.front} />
                                </div>
                                <div
                                    className={
                                        this.state.flipped
                                            ? "back"
                                            : "back hidden"
                                    }
                                    onClick={this.onFlip}
                                >
                                    {this.state.flipped ? (
                                        <Markdown
                                            source={this.state.card.back}
                                        />
                                    ) : (
                                        "show"
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                    {this.state.showFooter && (
                        <Footer
                            onOk={this.onOk}
                            isNew={this.state.card.isNew}
                        />
                    )}
                </>
            )
    }
}
