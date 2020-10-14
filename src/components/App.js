import React from "react"
import "../stylesheets/App.css"
import Sidebar from "./blocks/Sidebar"
import Main from "./blocks/Main"
import MobileSidebar from "./blocks/MobileSidebar"
import Header from "./blocks/Header"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import Deck from "../controller/deck"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import { Mobile, Desktop } from "./utils/MobileDesktop"
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/styles"

const theme = createMuiTheme({
    props: {
        // Name of the component ⚛️
        MuiButtonBase: {
            // The properties to apply
            disableRipple: true, // No more ripple, on the whole application 💣!
        },
    },
    transitions: {
        // So we have `transition: none;` everywhere
        create: () => "none",
    },
})

let starterDB = require("../controller/db")

class App extends React.Component {
    state = {
        decks: [],
        bearer: null,
        open: false,
    }

    componentWillMount() {
        const bearer = localStorage.getItem("bearer")
        if (bearer) this.setBearer(bearer, window.location.pathname)
    }

    setBearer = async (bearer, redirectTo = "/") => {
        this.setState({ bearer, redirectTo })
        localStorage.setItem("bearer", bearer)

        let { decks } = await fetch("https://binder.caprover.baida.dev/user", {
            headers: {
                Authorization: "Bearer " + bearer,
            },
        }).then((res) => res.json())

        if (!decks) {
            await fetch("https://binder.caprover.baida.dev/user", {
                body: JSON.stringify({
                    decks: [],
                }),
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + bearer,
                },
                method: "POST",
            })

            decks = starterDB.decks
        }

        this.setState({
            decks: decks.map((deck) => new Deck(deck, this.updateDecks)),
        })
    }

    logout = () => {
        localStorage.removeItem("bearer")
        this.setState({ bearer: null, redirectTo: "/login", decks: [] })
    }

    updateDecks = (refresh = true) => {
        fetch("https://binder.caprover.baida.dev/user", {
            body: JSON.stringify({
                decks: this.state.decks,
            }),
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + this.state.bearer,
            },
            method: "POST",
        })

        if (refresh) this.forceUpdate()
    }

    deleteDeck = (deletedId) => () => {
        this.setState(
            ({ decks }) => ({
                decks: decks.filter(
                    ({ id }) => id.toString() !== deletedId.toString()
                ),
                redirectTo: "/",
            }),
            () => this.updateDecks(false)
        )
    }

    createNewDeck = () => {
        const newId = (
            this.state.decks.reduce(
                (acc, curr) => Math.max(acc, parseInt(curr.id)),
                -1
            ) + 1
        ).toString()
        this.setState(
            ({ decks }) => ({
                decks: [
                    ...decks,
                    new Deck(
                        { id: newId, name: "Unnamed deck", cards: [] },
                        this.props.updateDecks
                    ),
                ],
                redirectTo: "/deck/" + newId,
            }),
            () => this.updateDecks(false)
        )
    }

    render() {
        if (this.state.redirectTo) {
            let address = this.state.redirectTo
            this.setState({ redirectTo: "" })
            return (
                <Router>
                    <Redirect push to={address} />
                </Router>
            )
        }

        const loggedInComponent = () => (
            <>
                <Desktop>
                    <Sidebar
                        decks={this.state.decks}
                        updateDecks={this.updateDecks}
                        logout={this.logout}
                        createNewDeck={this.createNewDeck}
                    />
                </Desktop>
                <Mobile>
                    <Header
                        logout={this.logout}
                        openSidebar={() => this.setState({ open: true })}
                        redirectTo={(location) =>
                            this.setState({ redirectTo: location })
                        }
                    />
                    <MobileSidebar
                        decks={this.state.decks}
                        updateDecks={this.updateDecks}
                        createNewDeck={this.createNewDeck}
                        open={this.state.open}
                        onClose={() => this.setState({ open: false })}
                    />
                </Mobile>
                <Main
                    decks={this.state.decks}
                    updateDecks={this.updateDecks}
                    isMobile={false}
                    deleteDeck={this.deleteDeck}
                    redirectTo={(location) =>
                        this.setState({ redirectTo: location })
                    }
                />
            </>
        )
        const logInPage = () => <LoginPage setBearer={this.setBearer} />
        const signUpPage = () => <SignupPage setBearer={this.setBearer} />

        return (
            <ThemeProvider theme={theme}>
                <Router>
                    <div className="App">
                        {!this.state.bearer && <Redirect to="/login" />}
                        <Route path="/" exact render={loggedInComponent} />
                        <Route
                            path={["/review", "/learn", "/settings", "/deck"]}
                            render={loggedInComponent}
                        />
                        <Route path="/login" render={logInPage} />
                        <Route path="/signup" render={signUpPage} />
                    </div>
                </Router>
            </ThemeProvider>
        )
    }
}

export default App
