import React from "react"
import ReviewPage from "../pages/ReviewPage"
import LearnPage from "../pages/LearnPage"
import DeckPage from "../pages/DeckPage"
import HomePage from "../pages/HomePage"
import SettingsPage from "../pages/SettingsPage"
import { Route } from "react-router-dom"

class Main extends React.Component {
    render() {
        const reviewPathComponent = () => (
            <ReviewPage
                decks={this.props.decks.filter((deck) => !deck.archived)}
                trackAction={this.props.trackAction}
            />
        )
        const settingsComponent = () => (
            <SettingsPage
                logOut={this.props.logOut}
                metadata={this.props.metadata}
                deleteUser={this.props.deleteUser}
            />
        )

        const learnPathComponent = () => (
            <LearnPage
                decks={this.props.decks.filter((deck) => !deck.archived)}
                trackAction={this.props.trackAction}
            />
        )

        const getCurrentDeck = (match) => {
            let currentDeck = this.props.decks.filter(
                (deck) => deck.id === match.params.deckId
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
                trackAction={this.props.trackAction}
            />
        )
        const homeComponent = () => (
            <HomePage
                decks={this.props.decks}
                achievements={this.props.achievements}
                stats={this.props.stats}
            />
        )

        return (
            <div className="main">
                <Route path="/" render={homeComponent} exact />
                <Route path="/review" render={reviewPathComponent} exact />
                <Route path="/settings" render={settingsComponent} exact />
                <Route path="/learn" render={learnPathComponent} exact />
                <Route
                    path={["/deck/:deckId", "/deck/:deckId/edit/:cardId"]}
                    render={deckPage}
                    exact
                />
                <Route
                    path="/deck/:deckId/learn"
                    render={({ match }) => {
                        const deck = this.props.decks.filter(
                            (deck) => deck.id === match.params.deckId
                        )
                        if (deck.length === 0) return ""

                        return (
                            <LearnPage
                                decks={deck}
                                backTo={`/deck/${match.params.deckId}`}
                                trackAction={this.props.trackAction}
                            />
                        )
                    }}
                />
                <Route
                    path="/deck/:deckId/review"
                    render={({ match }) => {
                        const deck = this.props.decks.filter(
                            (deck) => deck.id === match.params.deckId
                        )
                        if (deck.length === 0) return ""

                        return (
                            <ReviewPage
                                decks={deck}
                                backTo={`/deck/${match.params.deckId}`}
                                trackAction={this.props.trackAction}
                            />
                        )
                    }}
                />
            </div>
        )
    }
}

export default Main
