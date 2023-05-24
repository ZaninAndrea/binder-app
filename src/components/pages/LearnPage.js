import React from "react"
import Footer from "../blocks/Footer"
import Editor from "../editor"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import { NavLink } from "react-router-dom"
import { Desktop } from "../utils/MobileDesktop"
import EditCardModal from "../blocks/EditCardModal"

function getBatchFromDecks(decks) {
    let batches = decks
        .map((deck, i) => ({
            deckIndex: i,
            cards: deck.getBatchToLearn(),
            strength: deck.getStrengthInNDays(7),
        }))
        .filter((batch) => batch.cards.length > 0)

    if (batches.length === 0) {
        return null
    }

    batches.sort((a, b) => b.strength - a.strength)

    return batches[0]
}

export default class LearnPage extends React.Component {
    state = {
        cards: [],
        cardIndex: -1,
        deckIndex: -1,
        showEditModal: false,
    }

    static getDerivedStateFromProps(newProps, oldState) {
        let batch = getBatchFromDecks(newProps.decks)

        if (batch === null) return { cards: [], cardIndex: -1 }

        let newState = {
            cards: batch.cards,
            cardIndex: 0,
            deckIndex: batch.deckIndex,
        }

        return newState
    }

    onOk = () => {
        let reviewedCard = this.state.cards[this.state.cardIndex]
        this.props.decks[this.state.deckIndex].learn(reviewedCard.id)
        this.props.trackAction("learnedCard", { correct: true })
        this.goToNextCard()
    }

    goToNextCard = () => {
        if (this.state.cardIndex < this.state.cards.length - 1) {
            this.setState(({ cardIndex }) => ({
                cardIndex: cardIndex + 1,
            }))
        } else {
            new Audio("./completed.wav").play()

            let batch = getBatchFromDecks(this.props.decks)
            if (batch === null) this.setState({ cards: [] })
            else
                this.setState({
                    cards: batch.cards,
                    cardIndex: 0,
                    deckIndex: batch.deckIndex,
                })
        }
    }

    render() {
        if (this.state.cards.length === 0) {
            return (
                <div className="card">
                    <div className="front">You have no cards to learn</div>
                </div>
            )
        }

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
                </div>
                <div className="card">
                    <div className="front" key={"front-" + card.id}>
                        <Editor
                            value={card.front}
                            editable={false}
                            placeholder={"No question present"}
                        />
                    </div>
                    <div className="back" key={"back-" + card.id}>
                        <Editor
                            value={card.back}
                            editable={false}
                            placeholder={"No answer present"}
                        />
                    </div>
                </div>

                <Footer
                    onOk={this.onOk}
                    isNew={true}
                    onEdit={() => this.setState({ showEditModal: true })}
                />
                {this.state.showEditModal && (
                    <EditCardModal
                        card={card}
                        onClose={(updated) => {
                            if (updated) {
                                this.props.dispatcher.fetch(
                                    `/decks/${
                                        this.props.decks[this.state.deckIndex]
                                            .id
                                    }/cards/${card.id}`,
                                    {
                                        method: "PUT",
                                        body: JSON.stringify({
                                            front: card.front,
                                            back: card.back,
                                        }),
                                    }
                                )
                                this.props.onDeckUpdate()
                            }
                            this.setState({
                                showEditModal: false,
                            })
                        }}
                        onDelete={() => {
                            this.props.decks[this.state.deckIndex].deleteCard(
                                card.id
                            )
                            this.setState({ showEditModal: false })
                            this.goToNextCard()
                        }}
                        onTogglePaused={() => {
                            this.props.decks[this.state.deckIndex].togglePause(
                                card.id
                            )
                            this.setState({ showEditModal: false })
                            this.goToNextCard()
                        }}
                    />
                )}
            </>
        )
    }
}
