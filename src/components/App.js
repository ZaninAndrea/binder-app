import React from "react"
import "../stylesheets/App.css"
import Sidebar from "./blocks/Sidebar"
import Main from "./blocks/Main"
import MobileSidebar from "./blocks/MobileSidebar"
import Header from "./blocks/Header"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"
import Deck from "../controller/deck"
import LoginPage from "./pages/LoginPage"
import useMediaQuery from "@material-ui/core/useMediaQuery"

let starterDB = require("../controller/db")

function Mobile({ children }) {
    const isMobile = useMediaQuery("(max-width:866px)")

    if (isMobile) return <>{children}</>
    else return ""
}
function Desktop({ children }) {
    const isDesktop = useMediaQuery("(min-width:867px)")

    if (isDesktop) return <>{children}</>
    else return ""
}

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

        let { decks } = await fetch("http://localhost:5000/user", {
            headers: {
                Authorization: "Bearer " + bearer,
            },
        }).then(res => res.json())

        if (!decks) {
            await fetch("http://localhost:5000/user", {
                body: JSON.stringify({
                    decks: starterDB.decks,
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
            decks: decks.map(deck => new Deck(deck, this.updateDecks)),
        })
    }

    logout = () => {
        localStorage.removeItem("bearer")
        this.setState({ bearer: null, redirectTo: "/login", decks: [] })
    }

    updateDecks = () =>
        fetch("http://localhost:5000/user", {
            body: JSON.stringify({
                decks: this.state.decks,
            }),
            headers: {
                "content-type": "application/json",
                Authorization: "Bearer " + this.state.bearer,
            },
            method: "POST",
        })

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
                    />
                </Desktop>
                <Mobile>
                    <Header
                        logout={this.logout}
                        openSidebar={() => this.setState({ open: true })}
                    />
                    <MobileSidebar
                        decks={this.state.decks}
                        updateDecks={this.updateDecks}
                        open={this.state.open}
                        onClose={() => this.setState({ open: false })}
                    />
                </Mobile>
                <Main
                    decks={this.state.decks}
                    updateDecks={this.updateDecks}
                    isMobile={false}
                />
            </>
        )
        const notLoggedInComponent = () => (
            <LoginPage setBearer={this.setBearer} />
        )

        return (
            <Router>
                <div className="App">
                    {!this.state.bearer && <Redirect to="/login" />}
                    <Route path="/" exact component={loggedInComponent} />
                    <Route
                        path={[
                            "/review",
                            "/learn",
                            "/settings",
                            "/deck",
                            "/new-deck",
                        ]}
                        component={loggedInComponent}
                    />
                    <Route path="/login" component={notLoggedInComponent} />
                </div>
            </Router>
        )
    }
}

export default App
