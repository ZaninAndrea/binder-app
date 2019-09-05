import React from "react"
import Footer from "../blocks/Footer"
import Markdown from "../utils/Markdown"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import { NavLink } from "react-router-dom"
import { Desktop } from "../utils/MobileDesktop"

export default class LearnPage extends React.Component {
    state = {
        flipped: false,
        card: null,
        showFooter: false,
    }

    constructor(props) {
        super(props)

        const cards = this.props.decks
            .map(deck => deck.cards)
            .reduce((acc, arr) => [...acc, ...arr], [])
            .map(card => ({ ...card, score: 0, tries: 1 })) // this generates new cards so that we do not edit the original deck

        this.state = {
            cards,
            card: cards.length !== 0 && cards[0],
        }
    }

    onFlip = () =>
        this.setState({
            flipped: true,
            showFooter: true,
        })

    onGrade = grade => {
        // We are scoring the cards by average grade giving a malus to cards
        // reviewed less times

        this.state.card.score += grade
        this.state.card.tries++

        const nextCard = this.state.cards.reduce(
            (acc, curr) =>
                acc.score / acc.tries - 3 / acc.tries <=
                curr.score / curr.tries - 3 / curr.tries
                    ? acc
                    : curr,
            this.state.cards[0]
        )

        this.setState({ card: nextCard, flipped: false, showFooter: false })
    }

    render() {
        if (this.state.cards.length === 0) {
            return (
                <div className="card">
                    <div className="front">You have no cards to cram</div>
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
                                {/* TODO: average score bar */}
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
                    {this.state.showFooter && <Footer onGrade={this.onGrade} />}
                </>
            )
    }
}
