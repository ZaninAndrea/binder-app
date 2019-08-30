import React from "react"

export default class DeckPage extends React.Component {
    render() {
        if (!this.props.deck) return ""

        const { deck } = this.props

        return (
            <>
                <h1 className="deckName">{deck.name}</h1>
                <div className="cardsList">
                    <div key="new-card" id="new-card">
                        New Card
                    </div>
                    {deck.cards.map(({ front, id }) => (
                        <div key={id}>{front}</div>
                    ))}
                </div>
            </>
        )
    }
}
