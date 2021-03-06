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
            .filter((deck) => !deck.archived)
            .map((deck) => deck.cardsToReview().length)
            .reduce((a, b) => a + b, 0)

        const cardsToLearn = this.props.decks
            .filter((deck) => !deck.archived)
            .map((deck) => deck.cardsToLearn().length)
            .reduce((a, b) => a + b, 0)

        return (
            <div className="sidebar">
                <div id="flipcardHeader">
                    <NavLink to="/" id="flipcardTitle">
                        <img
                            src="/full_logo.png"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                    </NavLink>
                    <ExitToApp id="logoutButton" onClick={this.props.logout} />
                </div>
                <NavLink to="/review" activeClassName="active">
                    <InboxIcon /> Smart Review ( {cardsToReview} )
                </NavLink>
                <NavLink to="/learn" activeClassName="active">
                    <SchoolIcon /> Learn ( {cardsToLearn} )
                </NavLink>
                <br />
                <p className="title">BINDERS</p>
                {this.props.decks
                    .filter((deck) => !deck.archived)
                    .map((deck) => (
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
                    <LibraryAddIcon /> New Binder
                </a>

                <p className="title">ARCHIVED BINDERS</p>
                {this.props.decks
                    .filter((deck) => !!deck.archived)
                    .map((deck) => (
                        <NavLink
                            to={"/deck/" + deck.id}
                            activeClassName="active"
                            key={deck.id}
                            className="deck"
                        >
                            <LibraryBooksIcon /> {deck.name}
                        </NavLink>
                    ))}
            </div>
        )
    }
}

export default Sidebar
