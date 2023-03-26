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
import clonedeep from "lodash.clonedeep"
import dayjs from "dayjs"
import * as utc from "dayjs/plugin/utc"
import * as timezone from "dayjs/plugin/timezone"
import { updateAchievements } from "../controller/achievements"
dayjs.extend(utc)
dayjs.extend(timezone)

const theme = createMuiTheme({
    props: {
        MuiButtonBase: {
            disableRipple: true,
        },
    },
})

class BackgroundDispatcher {
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

        this.onlineListener = window.addEventListener("online", () => {
            this.offline = false

            if (this.queue.length !== 0) this.empty()
        })
        this.offlineListener = window.addEventListener("offline", () => {
            this.offline = true
        })
    }

    fetch(path, options = {}) {
        return new Promise((resolve, reject) => {
            options.headers = options.headers || {}
            options.headers["Authorization"] = "Bearer " + this.token

            this.queue.push({ path, options, resolve, reject })

            if (this.queue.length !== 0 && !this.emptying && !this.offline)
                this.empty()
        })
    }

    async empty() {
        this.emptying = true

        if (this.queue.length === 0) {
            this.emptying = false
            return
        }

        const request = this.queue.shift()

        let response = await fetch(
            `${this.serverUrl}${request.path}`,
            request.options
        ).catch((e) => {
            if (e.message === "Failed to fetch") this.queue.unshift(request)
            else request.reject(e)
        })
        request.resolve(response)

        if (!this.offline) this.empty()
    }
}

class App extends React.Component {
    state = {
        loading: true,
        decks: [],
        stats: {
            repetitions: 0,
            correctRepetitions: 0,
            activeDays: 0,
            dailyRepetitionsCleared: 0,
            today: {
                date: null,
                repetitions: 0,
                correctRepetitions: 0,
                active: false,
                repetitionsCleared: false,
            },
        },
        achievements: {
            TOTAL_REPETITIONS: 0,
            SINGLE_DAY_REPETITIONS: 0,
            ACTIVE_DAYS: 0,
        },
        bearer: null,
        open: false,
    }

    trackAction = (name, data) => {
        if (name === "learnedCard" || name === "reviewedCard") {
            const date = dayjs()
                .subtract(this.state.userData.endOfDay, "hours")
                .tz(this.state.userData.timezone)
                .format("YYYY-MM-DD")
            this.setState(({ userData }) => {
                return {
                    userData: {
                        ...userData,
                        statistics: {
                            ...userData.statistics,
                            dailyRepetitions: {
                                ...userData.statistics.dailyRepetitions,
                                [date]: userData.statistics.dailyRepetitions[
                                    date
                                ]
                                    ? userData.statistics.dailyRepetitions[
                                          date
                                      ] + 1
                                    : 1,
                            },
                        },
                    },
                }
            })
        }

        // TODO: Update this to new system
        this.setState((oldState) => {
            let stats = clonedeep(oldState.stats)

            if (stats.today.date !== dayjs().format("DD-MM-YYYY")) {
                stats.today = {
                    date: dayjs().format("DD-MM-YYYY"),
                    repetitions: 0,
                    correctRepetitions: 0,
                    active: false,
                    repetitionsCleared: false,
                }
            }

            if (name === "learnedCard" || name === "reviewedCard") {
                stats.repetitions++
                stats.today.repetitions++

                if (data.correct) {
                    stats.correctRepetitions++
                    stats.today.correctRepetitions++
                }

                if (!stats.today.active) {
                    stats.today.active = true
                    stats.activeDays++
                }
            } else if (
                name === "clearedRepetitions" &&
                !stats.today.repetitionsCleared
            ) {
                stats.today.repetitionsCleared = true
                stats.dailyRepetitionsCleared++
            }

            let achievements = updateAchievements(stats, oldState.achievements)
            return { stats, achievements }
        })
    }

    componentWillMount() {
        let bearer = localStorage.getItem("bearer")
        let version = localStorage.getItem("version")
        if (version !== "v4") {
            bearer = null
            localStorage.removeItem("bearer")
        }

        if (bearer) {
            this.setBearer(bearer, window.location.pathname)
        } else {
            this.setState({ loading: false })
        }

        localStorage.setItem("version", "v4")
    }

    setBearer = async (bearer, redirectTo = "/") => {
        localStorage.setItem("bearer", bearer)

        let userData = await fetch(
            "https://binderbackend.baida.dev:8051/users",
            {
                headers: {
                    Authorization: "Bearer " + bearer,
                },
            }
        ).then((res) => res.json())
        let decksData = await fetch(
            "https://binderbackend.baida.dev:8051/decks",
            {
                headers: {
                    Authorization: "Bearer " + bearer,
                },
            }
        ).then((res) => res.json())

        this.dispatcher = new BackgroundDispatcher(
            "https://binderbackend.baida.dev:8051",
            bearer
        )
        this.unloadListener = window.addEventListener(
            "beforeunload",
            (e) => {
                if (this.queue.length !== 0) {
                    e.preventDefault()
                    e.returnValue =
                        "Binder is still synchronizing, if you leave now some changes will be lost"
                }
            },
            {
                capture: true,
            }
        )

        this.setState({
            bearer,
            redirectTo,
            decks: decksData.map(
                (deck) => new Deck(deck, this.dispatcher, this.onDeckUpdate)
            ),
            userData: userData,
            loading: false,
        })
    }

    logOut = () => {
        localStorage.removeItem("bearer")
        this.dispatcher = null
        this.setState({
            bearer: null,
            redirectTo: "/login",
            decks: [],
            userData: null,
        })
    }

    deleteUser = async () => {
        await fetch("https://binderbackend.baida.dev:8051/users", {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + this.state.bearer,
            },
        })

        this.logOut()
    }

    deleteDeck = (deletedId) => () => {
        this.dispatcher.fetch("/decks/" + deletedId, {
            method: "DELETE",
        })

        this.setState(({ decks }) => ({
            decks: decks.filter(
                ({ id }) => id.toString() !== deletedId.toString()
            ),
            redirectTo: "/",
        }))
    }

    createNewDeck = async () => {
        const id = await this.dispatcher
            .fetch("/decks", {
                method: "POST",
                body: JSON.stringify({
                    name: "Unnamed deck",
                }),
            })
            .then((res) => res.text())

        this.setState(({ decks }) => ({
            decks: [
                ...decks,
                new Deck(
                    { id, name: "Unnamed deck", cards: [] },
                    this.dispatcher,
                    this.onDeckUpdate
                ),
            ],
            redirectTo: "/deck/" + id,
        }))
    }

    onDeckUpdate = () => {
        this.forceUpdate()
    }

    render() {
        if (this.state.loading) return ""

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
                        createNewDeck={this.createNewDeck}
                        open={this.state.open}
                        onClose={() => this.setState({ open: false })}
                    />
                </Mobile>
                <Main
                    decks={this.state.decks}
                    achievements={this.state.achievements}
                    stats={this.state.stats}
                    dispatcher={this.dispatcher}
                    onDeckUpdate={this.onDeckUpdate}
                    isMobile={false}
                    deleteDeck={this.deleteDeck}
                    redirectTo={(location) =>
                        this.setState({ redirectTo: location })
                    }
                    logOut={this.logOut}
                    userData={this.state.userData}
                    deleteUser={this.deleteUser}
                    trackAction={this.trackAction}
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
                        {this.state.bearer && (
                            <Route path="/" exact render={loggedInComponent} />
                        )}
                        {this.state.bearer && (
                            <Route
                                path={[
                                    "/review",
                                    "/learn",
                                    "/settings",
                                    "/deck",
                                ]}
                                render={loggedInComponent}
                            />
                        )}
                        <Route path="/login" render={logInPage} />
                        <Route path="/signup" render={signUpPage} />
                    </div>
                </Router>
            </ThemeProvider>
        )
    }
}

export default App
