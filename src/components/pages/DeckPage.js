import React from "react"
import EditCardModal from "../blocks/EditCardModal"
import Markdown from "../utils/Markdown"
import MoreIcon from "@material-ui/icons/MoreHoriz"

export default class DeckPage extends React.Component {
    state = {
        editCard: null,
    }

    onCloseEditModal = () => {
        this.setState({ editCard: null })
        this.props.updateDecks()
    }

    render() {
        if (!this.props.deck) return ""

        const { deck } = this.props
        const cardsReapetedOnce = deck.cards.filter(
            ({ repetitions }) => repetitions.length !== 0
        )
        const learnedCards = cardsReapetedOnce.length
        const totalCards = deck.cards.length
        const learnedRate =
            totalCards === 0
                ? 100
                : Math.round((100 * learnedCards) / totalCards)

        const { reps, correct } = cardsReapetedOnce.reduce(
            ({ reps, correct }, { repetitions }) => ({
                reps: reps + repetitions.length,
                correct:
                    correct +
                    repetitions.filter(({ quality }) => quality >= 4).length,
            }),
            { reps: 0, correct: 0 }
        )

        const recallAccuracy =
            reps === 0 ? 100 : Math.round((100 * correct) / reps)

        return (
            <>
                {this.state.editCard && (
                    <EditCardModal
                        card={this.state.editCard}
                        onClose={this.onCloseEditModal}
                    />
                )}
                <h1 className="deckName">
                    <input
                        defaultValue={this.props.deck.name}
                        onBlur={e => {
                            deck.name = e.target.value
                            this.props.updateDecks()
                        }}
                    />
                    <div>
                        <MoreIcon />
                    </div>
                </h1>
                <div className="stats">
                    <div className="stats-learned">
                        <div className="bar">
                            <div
                                className="fill"
                                style={{
                                    width: `${learnedRate}%`,
                                }}
                            />
                        </div>
                        <span className="text">
                            {learnedCards}/{totalCards} cards learned
                        </span>
                    </div>
                    <div className="stats-recall">
                        <div className="bar">
                            <div
                                className="fill"
                                style={{
                                    width: `${recallAccuracy}%`,
                                }}
                            />
                        </div>
                        <span className="text">{recallAccuracy}% accuracy</span>
                    </div>
                </div>
                <div className="cardsList">
                    {deck.cards.map(card => (
                        <div
                            key={card.id}
                            onClick={() => this.setState({ editCard: card })}
                        >
                            <Markdown source={card.front} />
                        </div>
                    ))}
                    <div
                        key="new-card"
                        id="new-card"
                        onClick={() =>
                            this.setState({
                                editCard: deck.addCard({
                                    front: "",
                                    back: "",
                                }),
                            })
                        }
                    >
                        New Card
                    </div>
                </div>
            </>
        )
    }
}
