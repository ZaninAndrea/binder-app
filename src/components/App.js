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
import { create as jsondifferCreate, formatters } from "jsondiffpatch"
import clonedeep from "lodash.clonedeep"

const theme = createMuiTheme({
    props: {
        // Name of the component ⚛️
        MuiButtonBase: {
            // The properties to apply
            disableRipple: true, // No more ripple, on the whole application 💣!
        },
    },
})

class PatchDispatcher {
    constructor(serverUrl, token) {
        if (!window.navigator)
            alert(
                "Your browser is not supported, you may have issues with synchronization"
            )
        this.queue = []
        this.emptying = false
        this.token = token
        this.serverUrl = serverUrl
        this.offline = !window.navigator.onLine

        this.unloadListener = window.addEventListener("beforeunload", (e) => {
            if (this.queue.length !== 0) {
                e.preventDefault()
                e.returnValue = ""
            }
        })
        this.onlineListener = window.addEventListener("online", () => {
            this.offline = false

            if (this.queue.length !== 0) this.empty()
        })
        this.offlineListener = window.addEventListener("offline", () => {
            this.offline = true
        })
    }

    extend(arr) {
        this.queue = this.queue.concat(arr)

        if (this.queue.length !== 0 && !this.emptying && !this.offline)
            this.empty()
    }

    async empty() {
        this.emptying = true

        if (this.queue.length === 0) {
            this.emptying = false
            return
        }

        const patch = this.queue.shift()

        await fetch(`${this.serverUrl}/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.token,
            },
            body: JSON.stringify([patch]),
        }).catch((e) => {
            if (e.message === "Failed to fetch") this.queue.unshift(patch)
            else throw e
        })

        if (!this.offline) this.empty()
    }
}

class App extends React.Component {
    state = {
        decks: [],
        bearer: null,
        open: false,
    }

    componentWillMount() {
        let bearer = localStorage.getItem("bearer")
        let version = localStorage.getItem("version")
        if (version !== "v3") {
            bearer = null
            localStorage.removeItem("bearer")
        }

        if (bearer) {
            this.setBearer(bearer, window.location.pathname)
        }
        localStorage.setItem("version", "v3")
    }

    setBearer = async (bearer, redirectTo = "/") => {
        this.setState({ bearer, redirectTo })
        localStorage.setItem("bearer", bearer)

        let data = await fetch("https://binderbackend.baida.dev:8080/user", {
            headers: {
                Authorization: "Bearer " + bearer,
            },
        }).then((res) => res.json())
        let metadata = await fetch(
            "https://binderbackend.baida.dev:8080/user/metadata",
            {
                headers: {
                    Authorization: "Bearer " + bearer,
                },
            }
        ).then((res) => res.json())

        this.differ = jsondifferCreate({
            arrays: { detectMove: false },
            textDiff: { minLength: Infinity },
        })
        this.dispatcher = new PatchDispatcher(
            "https://binderbackend.baida.dev:8080",
            bearer
        )

        this.cloudData = clonedeep(data)
        this.setState({
            decks: data.decks.map((deck) => new Deck(deck, this.updateDecks)),
            metadata: metadata,
        })
    }

    logOut = () => {
        localStorage.removeItem("bearer")
        this.setState({ bearer: null, redirectTo: "/login", decks: [] })
    }

    deleteUser = async () => {
        await fetch("https://binderbackend.baida.dev:8080/user", {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + this.state.bearer,
            },
        })

        this.logOut()
    }

    updateDecks = (refresh = true) => {
        const current = JSON.parse(
            JSON.stringify({
                decks: this.state.decks,
            })
        )

        const delta = this.differ.diff(this.cloudData, current)
        const patch = formatters.jsonpatch.format(delta)

        this.dispatcher.extend(patch)
        this.cloudData = clonedeep(current)

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
                        createNewDeck={this.createNewDeck}
                        openSettings={() =>
                            this.setState({ redirectTo: "/settings" })
                        }
                    />
                </Desktop>
                <Mobile>
                    <Header
                        openSettings={() =>
                            this.setState({ redirectTo: "/settings" })
                        }
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
                    logOut={this.logOut}
                    metadata={this.state.metadata}
                    deleteUser={this.deleteUser}
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
