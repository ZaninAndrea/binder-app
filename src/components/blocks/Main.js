import React from "react"
import ReviewPage from "../pages/ReviewPage"
import LearnPage from "../pages/LearnPage"
import CramPage from "../pages/CramPage"
import DeckPage from "../pages/DeckPage"
import HomePage from "../pages/HomePage"
import { Route } from "react-router-dom"

class Main extends React.Component {
    render() {
        const reviewPathComponent = () => (
            <ReviewPage
                decks={this.props.decks.filter(deck => !deck.archived)}
            />
        )
        const learnPathComponent = () => (
            <LearnPage
                decks={this.props.decks.filter(deck => !deck.archived)}
            />
        )

        const getCurrentDeck = match => {
            let currentDeck = this.props.decks.filter(
                deck => deck.id === match.params.deckId
            )
            currentDeck = currentDeck.length === 0 ? null : currentDeck[0]

            return currentDeck
        }

        const deckPage = ({ match }) => (
            <DeckPage
                deck={getCurrentDeck(match)}
                updateDecks={this.props.updateDecks}
                deleteDeck={this.props.deleteDeck(match.params.deckId)}
                redirectTo={this.props.redirectTo}
            />
        )
        const homeComponent = () => <HomePage decks={this.props.decks} />

        return (
            <div className="main">
                <Route path="/" render={homeComponent} exact />
                <Route path="/review" render={reviewPathComponent} exact />
                <Route path="/learn" render={learnPathComponent} exact />
                <Route path="/deck/:deckId" render={deckPage} exact />
                <Route
                    path="/deck/:deckId/learn"
                    render={({ match }) => {
                        if (!this.props.decks[match.params.deckId]) return ""

                        return (
                            <LearnPage
                                decks={[this.props.decks[match.params.deckId]]}
                                backTo={`/deck/${match.params.deckId}`}
                            />
                        )
                    }}
                    exact
                />
                <Route
                    path="/deck/:deckId/review"
                    render={({ match }) => {
                        if (!this.props.decks[match.params.deckId]) return ""

                        return (
                            <ReviewPage
                                decks={[this.props.decks[match.params.deckId]]}
                                backTo={`/deck/${match.params.deckId}`}
                            />
                        )
                    }}
                    exact
                />
                <Route
                    path="/deck/:deckId/cram"
                    render={({ match }) => {
                        if (!this.props.decks[match.params.deckId]) return ""

                        return (
                            <CramPage
                                decks={[this.props.decks[match.params.deckId]]}
                                backTo={`/deck/${match.params.deckId}`}
                            />
                        )
                    }}
                    exact
                />
            </div>
        )
    }
}

export default Main
