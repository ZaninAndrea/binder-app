import React from "react"
import EditCardModal from "../blocks/EditCardModal"

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

        return (
            <>
                {this.state.editCard && (
                    <EditCardModal
                        card={this.state.editCard}
                        onClose={this.onCloseEditModal}
                    />
                )}
                <h1 className="deckName">{deck.name}</h1>
                <div className="cardsList">
                    <div
                        key="new-card"
                        id="new-card"
                        onClick={() =>
                            this.setState({
                                editCard: deck.addCard({ front: "", back: "" }),
                            })
                        }
                    >
                        New Card
                    </div>
                    {deck.cards.map(card => (
                        <div
                            key={card.id}
                            onClick={() => this.setState({ editCard: card })}
                        >
                            {card.front}
                        </div>
                    ))}
                </div>
            </>
        )
    }
}
