import React from "react"
import ReviewPage from "../pages/ReviewPage"
import LearnPage from "../pages/LearnPage"
import CramPage from "../pages/CramPage"
import DeckPage from "../pages/DeckPage"
import { Route } from "react-router-dom"

class Main extends React.Component {
    render() {
        const reviewPathComponent = () => (
            <ReviewPage decks={this.props.decks} />
        )
        const learnPathComponent = () => <LearnPage decks={this.props.decks} />
        const deckPage = ({ match }) => (
            <DeckPage
                deck={this.props.decks[match.params.deckId]}
                updateDecks={this.props.updateDecks}
                deleteDeck={this.props.deleteDeck(match.params.deckId)}
                setBackToPage={this.props.setBackToPage}
                redirectTo={this.props.redirectTo}
            />
        )

        return (
            <div className="main">
                <Route path="/review" component={reviewPathComponent} exact />
                <Route path="/learn" component={learnPathComponent} exact />
                <Route path="/deck/:deckId" component={deckPage} exact />
                <Route
                    path="/deck/:deckId/learn"
                    component={({ match }) => {
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
                    component={({ match }) => {
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
                    path="/deck/:deckId/cram"
                    component={({ match }) => {
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
