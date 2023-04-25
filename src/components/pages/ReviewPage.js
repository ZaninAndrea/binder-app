import React from "react"
import Footer from "../blocks/Footer"
import Editor from "../editor"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import { NavLink } from "react-router-dom"
import { Desktop } from "../utils/MobileDesktop"
import EndBatchScreen from "../blocks/EndBatchScreen"

function getBatchFromDecks(decks) {
    let batches = decks
        .map((deck, i) => ({
            deckIndex: i,
            ...deck.getBatchToReview(),
        }))
        .filter((batch) => batch.cards.length > 0)

    if (batches.length === 0) {
        return null
    }

    batches.sort((a, b) => b.highestProbability - a.highestProbability)

    return batches[0]
}

export default class ReviewPage extends React.Component {
    state = {
        flipped: false,
        cards: [],
        showEndBatchPage: false,
        unlockedAchievements: [],
        cardIndex: -1,
        deckIndex: -1,
    }

    static getDerivedStateFromProps(newProps, oldState) {
        if (oldState.cards.length > 0) return {}

        let batch = getBatchFromDecks(newProps.decks)

        if (batch === null) return { cards: [], cardIndex: -1 }

        let newState = {
            cards: batch.cards,
            cardIndex: 0,
            deckIndex: batch.deckIndex,
            flipped: false,
        }

        return newState
    }

    onGrade = (quality) => {
        let reviewedCard = this.state.cards[this.state.cardIndex]
        this.props.decks[this.state.deckIndex]
            .grade(quality, reviewedCard.id)
            .then((res) =>
                this.setState(({ unlockedAchievements }) => ({
                    unlockedAchievements: [...unlockedAchievements, ...res],
                }))
            )

        this.props.trackAction("reviewedCard", { correct: quality >= 4 })

        if (quality < 3) {
            this.setState(({ cards, cardIndex }) => ({
                cards: [...cards, reviewedCard],
                flipped: false,
                cardIndex: cardIndex + 1,
            }))
        } else if (this.state.cardIndex < this.state.cards.length - 1) {
            this.setState(({ cardIndex }) => ({
                flipped: false,
                cardIndex: cardIndex + 1,
            }))
        } else {
            new Audio("/completed.wav").play()

            let batch = getBatchFromDecks(this.props.decks)
            if (batch === null)
                this.setState({ showEndBatchPage: true, cards: [] })
            else
                this.setState({
                    showEndBatchPage: true,
                    cards: batch.cards,
                    cardIndex: 0,
                    deckIndex: batch.deckIndex,
                    flipped: false,
                })
        }
    }

    render() {
        if (this.state.showEndBatchPage) {
            return (
                <EndBatchScreen
                    unlockedAchievements={this.state.unlockedAchievements}
                    continue={() =>
                        this.setState({
                            showEndBatchPage: false,
                            unlockedAchievements: [],
                        })
                    }
                />
            )
        }

        if (this.state.cards.length === 0) {
            return (
                <div className="card">
                    <div className="front">
                        You have no cards to review, start by creating and
                        learning some cards.
                    </div>
                </div>
            )
        }

        const reviewRate =
            (100 * this.state.cardIndex) / this.state.cards.length

        const card = this.state.cards[this.state.cardIndex]
        return (
            <>
                <div className="learn-header">
                    <Desktop>
                        {this.props.backTo && (
                            <NavLink to={this.props.backTo} className="icon">
                                <ArrowBackIcon />
                            </NavLink>
                        )}
                    </Desktop>
                    <span className="review-deck-title">
                        {this.props.decks[this.state.deckIndex].name}
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
                        <Editor
                            value={card.front}
                            editable={false}
                            placeholder={"No question present"}
                        />
                    </div>
                    <div
                        className={this.state.flipped ? "back" : "back hidden"}
                        onClick={() => {
                            this.setState({
                                flipped: true,
                            })
                        }}
                    >
                        {this.state.flipped ? (
                            <div className="back">
                                <Editor
                                    value={card.back}
                                    editable={false}
                                    placeholder={"No answer present"}
                                />
                            </div>
                        ) : (
                            "show"
                        )}
                    </div>
                </div>
                {this.state.flipped && (
                    <Footer onGrade={this.onGrade} isNew={false} />
                )}
            </>
        )
    }
}
