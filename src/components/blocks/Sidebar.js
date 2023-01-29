import React from "react"
import { NavLink } from "react-router-dom"
import InboxIcon from "@material-ui/icons/Inbox"
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks"
import LibraryAddIcon from "@material-ui/icons/LibraryAdd"
import SchoolIcon from "@material-ui/icons/School"
import SettingsIcon from "@material-ui/icons/Settings"

class Sidebar extends React.Component {
    render() {
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
                    <SettingsIcon
                        id="logoutButton"
                        onClick={this.props.openSettings}
                    />
                </div>
                <NavLink to="/review" activeClassName="active">
                    <InboxIcon /> Smart Review
                </NavLink>
                <NavLink
                    to="/learn"
                    activeClassName="active"
                    className={cardsToLearn ? "" : "disabled-link"}
                    onClick={(e) => {
                        if (cardsToLearn === 0) e.preventDefault()
                    }}
                >
                    <SchoolIcon /> Learn
                    {cardsToLearn ? `( ${cardsToLearn} )` : ""}
                </NavLink>
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
