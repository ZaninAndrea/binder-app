import React from "react"
import EditCardModal from "../blocks/EditCardModal"
import Editor from "../editor"
import MoreIcon from "@material-ui/icons/MoreHoriz"
import DeleteIcon from "@material-ui/icons/Delete"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import InboxIcon from "@material-ui/icons/Inbox"
import SchoolIcon from "@material-ui/icons/School"
import WarningIcon from "@material-ui/icons/Warning"
import Archive from "@material-ui/icons/Archive"
import Download from "@material-ui/icons/SaveAlt"
import fileDialog from "file-dialog"
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom"

function downloadJson(name, cards) {
    let a = document.createElement("a")
    a.download = name + ".json"
    a.href =
        "data:application/json;base64," +
        Buffer.from(JSON.stringify(cards)).toString("base64")
    a.click()
}

class MinimalLoader extends React.Component {
    constructor() {
        super()

        this.state = { counter: 0 }
        this.interval = setInterval(
            () =>
                this.setState(({ counter }) => ({
                    counter: (counter + 1) % 3,
                })),
            700
        )
    }

    componentWillUnmount = () => {
        clearInterval(this.interval)
    }

    render() {
        switch (this.state.counter) {
            case 0:
                return ".  "
            case 1:
                return ".. "
            case 2:
                return "..."
            default:
                return ""
        }
    }
}

export default class DeckPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            editCard: null,
            anchorEl: null,
            wantsToDelete: false,
            name: this.props.deck && this.props.deck.name,
            loadingDeck: false,
            redirectTo: "",
        }
    }

    onTogglePaused = (cardId) => {
        this.props.deck.togglePause(cardId)
    }
    onDeleteCard = (cardId) => {
        this.props.deck.deleteCard(cardId)
        this.setState({ redirectTo: "/deck/" + this.props.deck.id })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.deck) this.setState({ name: nextProps.deck.name })
    }

    loadDeck = () => {
        fileDialog({ accept: "application/json" }).then((files) => {
            this.setState({ loadingDeck: true })

            const file = files[0]
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    let loaded = JSON.parse(e.target.result)

                    if (!loaded.length) {
                        throw new Error("not array")
                    }

                    for (let card of loaded) {
                        await this.props.deck.addCard(card.front, card.back)
                    }

                    this.setState({
                        loadingDeck: false,
                    })
                } catch (e) {
                    console.log(e)
                }
            }
            reader.readAsText(file)
        })
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

        if (!this.props.deck) return ""

        const { deck } = this.props
        const cardsRepeatedOnce = deck.cards.filter(
            (c) => c.lastRepetition !== null
        )
        const activeCards = cardsRepeatedOnce.filter((c) => !c.paused).length
        const totalCards = deck.cards.length
        const activeRate =
            totalCards === 0
                ? 100
                : Math.round((100 * activeCards) / totalCards)

        const { reps, correct } = cardsRepeatedOnce.reduce(
            ({ reps, correct }, { totalRepetitions, correctRepetitions }) => ({
                reps: reps + totalRepetitions,
                correct: correct + correctRepetitions,
            }),
            { reps: 0, correct: 0 }
        )

        const recallAccuracy =
            reps === 0 ? 100 : Math.round((100 * correct) / reps)

        const nCardsToLearn = deck.cardsToLearn().length

        const deckComponent = () => (
            <>
                <h1 className="deckName">
                    <input
                        value={this.state.name}
                        onChange={(e) =>
                            this.setState({
                                name: e.target.value,
                            })
                        }
                        onBlur={() => {
                            deck.name = this.state.name

                            this.props.dispatcher.fetch("/decks/" + deck.id, {
                                method: "PUT",
                                body: JSON.stringify({
                                    name: this.state.name,
                                }),
                            })
                            this.props.onDeckUpdate()
                        }}
                    />
                    <div
                        onClick={(e) =>
                            this.setState({
                                anchorEl: e.currentTarget,
                            })
                        }
                    >
                        <MoreIcon />
                    </div>
                    <Menu
                        id="deck-menu"
                        anchorEl={this.state.anchorEl}
                        open={!!this.state.anchorEl}
                        onClose={() => this.setState({ anchorEl: null })}
                    >
                        <MenuItem
                            onClick={() => {
                                this.props.redirectTo(
                                    `/deck/${this.props.deck.id}/learn`
                                )
                                this.setState({ anchorEl: null })
                            }}
                            disabled={!nCardsToLearn}
                        >
                            <SchoolIcon />
                            Learn {!!nCardsToLearn && `( ${nCardsToLearn} )`}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                this.props.redirectTo(
                                    `/deck/${this.props.deck.id}/review`
                                )
                                this.setState({ anchorEl: null })
                            }}
                        >
                            <InboxIcon />
                            Smart Review
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                deck.archived = !deck.archived

                                this.props.dispatcher.fetch(
                                    "/decks/" + deck.id,
                                    {
                                        method: "PUT",
                                        body: JSON.stringify({
                                            archived: deck.archived,
                                        }),
                                    }
                                )
                                this.props.onDeckUpdate()
                            }}
                        >
                            <Archive />
                            {deck.archived ? "Restore" : "Archive"}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                downloadJson(
                                    this.state.name,
                                    this.props.deck.cards.map(
                                        ({ front, back }) => ({ front, back })
                                    )
                                )
                            }}
                        >
                            <Download />
                            Download
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                let shouldDelete = false
                                this.setState(
                                    ({ wantsToDelete }) => {
                                        if (wantsToDelete) {
                                            shouldDelete = true
                                            return {
                                                anchorEl: null,
                                            }
                                        } else
                                            return {
                                                wantsToDelete: true,
                                            }
                                    },
                                    () => {
                                        if (shouldDelete)
                                            this.props.deleteDeck()
                                    }
                                )
                            }}
                            style={
                                this.state.wantsToDelete
                                    ? {
                                          color: "var(--primary-color)",
                                      }
                                    : {}
                            }
                        >
                            {this.state.wantsToDelete ? (
                                <>
                                    <WarningIcon />
                                    Confirm
                                </>
                            ) : (
                                <>
                                    <DeleteIcon />
                                    Delete
                                </>
                            )}
                        </MenuItem>
                    </Menu>
                </h1>
                <div className="stats">
                    <div className="stats-learned">
                        <div className="bar">
                            <div
                                className="fill"
                                style={{
                                    width: `${activeRate}%`,
                                }}
                            />
                        </div>
                        <span className="text">
                            {activeCards}/{totalCards} cards active
                        </span>
                    </div>
                    <div className="stats-recall">
                        <div className="bar">
                            <div
                                className="fill"
                                style={{
                                    width: `${recallAccuracy}%`,
                                }}
                            />
                        </div>
                        <span className="text">
                            {recallAccuracy}% right reviews
                        </span>
                    </div>
                </div>
                <div className="cardsList">
                    {deck.cards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() =>
                                this.setState({
                                    redirectTo: `/deck/${deck.id}/edit/${card.id}`,
                                })
                            }
                        >
                            <Editor
                                value={card.front}
                                editable={false}
                                placeholder={"No question"}
                                showSummary
                            />
                        </div>
                    ))}
                    <div
                        key="new-card"
                        id="new-card"
                        onClick={async () =>
                            this.setState({
                                redirectTo: `/deck/${deck.id}/edit/${
                                    (await deck.addCard()).id
                                }`,
                            })
                        }
                    >
                        New Card
                    </div>{" "}
                    {deck.cards.length === 0 && (
                        <div
                            key="load-deck"
                            id="new-card"
                            onClick={this.loadDeck}
                        >
                            {this.state.loadingDeck ? (
                                <MinimalLoader />
                            ) : (
                                "Load Deck"
                            )}
                        </div>
                    )}
                </div>
            </>
        )

        const editModal = ({
            match: {
                params: { deckId, cardId },
            },
        }) => {
            const card = deck.cards.filter(({ id }) => id === cardId)[0]

            // Close dialog if
            if (card === undefined) {
                this.setState({ redirectTo: "/deck/" + deck.id })
                return ""
            }

            return (
                <>
                    <EditCardModal
                        card={card}
                        onClose={(updated) => {
                            if (updated) {
                                this.props.dispatcher.fetch(
                                    `/decks/${this.props.deck.id}/cards/${cardId}`,
                                    {
                                        method: "PUT",
                                        body: JSON.stringify({
                                            front: card.front,
                                            back: card.back,
                                        }),
                                    }
                                )
                                this.props.onDeckUpdate()
                            }
                            this.setState({
                                redirectTo: "/deck/" + this.props.deck.id,
                            })
                        }}
                        onDelete={() => this.onDeleteCard(cardId)}
                        onTogglePaused={() => this.onTogglePaused(cardId)}
                    />
                    {deckComponent()}
                </>
            )
        }

        return (
            <>
                <Router>
                    <Route path="/deck/:deckId" exact render={deckComponent} />
                    <Route
                        path={"/deck/:deckId/edit/:cardId"}
                        render={editModal}
                    />
                </Router>
            </>
        )
    }
}
