import React from "react"
import Footer from "../blocks/Footer"
import Markdown from "../utils/Markdown"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import { NavLink } from "react-router-dom"
import { Desktop } from "../utils/MobileDesktop"

const isToday = someDate => {
    const today = new Date()
    someDate = new Date(someDate)
    return (
        someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
    )
}

export default class ReviewPage extends React.Component {
    state = {
        flipped: false,
        card: null,
        showFooter: false,
        deckIndex: -1,
        done: true,
    }

    constructor(props) {
        super(props)

        const reviewedCardsCount = this.props.decks
            .map(
                deck =>
                    deck.cards.filter(
                        card =>
                            card.repetitions.length > 0 &&
                            isToday(
                                card.repetitions[card.repetitions.length - 1]
                                    .date
                            )
                    ).length
            )
            .reduce((a, b) => a + b, 0)

        const cardsToReview =
            this.props.decks
                .map(deck => deck.cardsToReview().length)
                .reduce((a, b) => a + b, 0) + reviewedCardsCount

        this.state = {
            ...this.state,
            ...this.nextDeckState(),
            cardsToReview,
            reviewedCardsCount,
        }

        if (!this.state.done)
            this.state.card = this.props.decks[
                this.state.deckIndex
            ].nextCardToReview()
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

        if (currentDeck.hasCardsToReview()) {
            nextCard = currentDeck.nextCardToReview()
            _deckIndex = this.state.deckIndex
            _done = false
        } else {
            let { deckIndex, done } = this.nextDeckState()
            _deckIndex = deckIndex
            _done = done

            nextCard = done
                ? null
                : this.props.decks[deckIndex].nextCardToReview()
        }

        this.setState(({ reviewedCardsCount }) => ({
            card: nextCard,
            deckIndex: _deckIndex,
            done: _done,
            flipped: false,
            showFooter: false,
            reviewedCardsCount: reviewedCardsCount + 1,
        }))
    }

    onGrade = quality => {
        this.props.decks[this.state.deckIndex].grade(quality)
        this.nextCard()
    }

    nextDeckState = () => {
        let deckIndex = this.state.deckIndex
        // advance to next deck
        deckIndex++

        // skip decks with no cards to review until you run out of decks
        while (
            deckIndex < this.props.decks.length &&
            !this.props.decks[deckIndex].hasCardsToReview()
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
        console.log(this.state.reviewedCardsCount)
        const reviewRate =
            this.state.cardsToReview === 0
                ? 1
                : (100 * this.state.reviewedCardsCount) /
                  this.state.cardsToReview

        if (this.state.done) {
            return (
                <div className="card">
                    <div className="front">You have no cards to review</div>
                </div>
            )
        } else
            return (
                <>
                    {this.state.card && (
                        <>
                            <div className="learn-header">
                                <Desktop>
                                    {this.props.backTo && (
                                        <NavLink
                                            to={this.props.backTo}
                                            className="icon"
                                        >
                                            <ArrowBackIcon />
                                        </NavLink>
                                    )}
                                </Desktop>
                                <span className="review-deck-title">
                                    {
                                        this.props.decks[this.state.deckIndex]
                                            .name
                                    }
                                </span>
                                <div className="review-bar">
                                    <div
                                        className="fill"
                                        style={{
                                            width: `${reviewRate}%`,
                                        }}
                                    />
                                </div>
                            </div>
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
                            onGrade={this.onGrade}
                            isNew={this.state.card.isNew}
                        />
                    )}
                </>
            )
    }
}
