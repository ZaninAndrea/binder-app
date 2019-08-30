import React from "react"
import ReviewPage from "../pages/ReviewPage"
import LearnPage from "../pages/LearnPage"
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
            />
        )

        return (
            <div className="main">
                <Route path="/review" component={reviewPathComponent} exact />
                <Route path="/learn" component={learnPathComponent} exact />
                <Route path="/deck/:deckId" component={deckPage} />
            </div>
        )
    }
}

export default Main
