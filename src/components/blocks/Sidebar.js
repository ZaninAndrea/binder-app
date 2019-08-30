import React from "react"
import { NavLink } from "react-router-dom"
import InboxIcon from "@material-ui/icons/Inbox"
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks"
import LibraryAddIcon from "@material-ui/icons/LibraryAdd"
import SchoolIcon from "@material-ui/icons/School"
import ExitToApp from "@material-ui/icons/ExitToApp"

class Sidebar extends React.Component {
    render() {
        const cardsToReview = this.props.decks
            .map(deck => deck.cardsToReview().length)
            .reduce((a, b) => a + b, 0)

        const cardsToLearn = this.props.decks
            .map(deck => deck.cardsToLearn().length)
            .reduce((a, b) => a + b, 0)

        return (
            <div className="sidebar">
                <div id="flipcardHeader">
                    <span id="flipcardTitle">Flipcards</span>
                    <ExitToApp id="logoutButton" onClick={this.props.logout} />
                </div>
                <NavLink to="/review" activeClassName="active">
                    <InboxIcon /> Review ( {cardsToReview} )
                </NavLink>
                <NavLink to="/learn" activeClassName="active">
                    <SchoolIcon /> Learn ( {cardsToLearn} )
                </NavLink>
                {/* <NavLink to="/settings" activeClassName="active">
                    <SettingsIcon /> Settings
                </NavLink> */}
                <br />
                <p className="title">DECKS</p>
                {this.props.decks.map(deck => (
                    <NavLink
                        to={"/deck/" + deck.id}
                        activeClassName="active"
                        key={deck.id}
                        className="deck"
                    >
                        <LibraryBooksIcon /> {deck.name}
                    </NavLink>
                ))}
                <a onClick={this.props.createNewDeck}>
                    <LibraryAddIcon /> New Deck
                </a>
            </div>
        )
    }
}

export default Sidebar
