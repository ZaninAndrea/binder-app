import React from "react"
import Drawer from "@material-ui/core/Drawer"
import { NavLink } from "react-router-dom"
import InboxIcon from "@material-ui/icons/Inbox"
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks"
import LibraryAddIcon from "@material-ui/icons/LibraryAdd"
import SchoolIcon from "@material-ui/icons/School"
import Close from "@material-ui/icons/Close"

export default class MobileSidebar extends React.Component {
    render() {
        const cardsToLearn = this.props.decks
            .filter((deck) => !deck.archived)
            .map((deck) => deck.cardsToLearn().length)
            .reduce((a, b) => a + b, 0)

        return (
            <Drawer open={this.props.open} onClose={this.props.onClose}>
                <div className="drawer sidebar">
                    <div id="flipcardHeader">
                        <Close id="logoutButton" onClick={this.props.onClose} />
                    </div>
                    <NavLink
                        to="/review"
                        activeClassName="active"
                        onClick={() => this.props.onClose()}
                    >
                        <InboxIcon /> Smart Review
                    </NavLink>
                    <NavLink
                        to="/learn"
                        activeClassName="active"
                        className={cardsToLearn ? "" : "disabled-link"}
                        onClick={(e) => {
                            if (cardsToLearn === 0) e.preventDefault()
                            else this.props.onClose()
                        }}
                    >
                        <SchoolIcon /> Learn{" "}
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
                                onClick={() => this.props.onClose()}
                            >
                                <LibraryBooksIcon /> {deck.name}
                            </NavLink>
                        ))}
                    <a
                        onClick={() => {
                            this.props.createNewDeck()
                            this.props.onClose()
                        }}
                    >
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
            </Drawer>
        )
    }
}
