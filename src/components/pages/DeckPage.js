import React from "react"
import EditCardModal from "../blocks/EditCardModal"
import Markdown from "../utils/Markdown"
import MoreIcon from "@material-ui/icons/MoreHoriz"
import DeleteIcon from "@material-ui/icons/Delete"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import InboxIcon from "@material-ui/icons/Inbox"
import SchoolIcon from "@material-ui/icons/School"
import WarningIcon from "@material-ui/icons/Warning"
import Loop from "@material-ui/icons/Loop"
import Archive from "@material-ui/icons/Archive"
import Download from "@material-ui/icons/SaveAlt"
import fileDialog from "file-dialog"

function downloadJson(name, cards) {
    let a = document.createElement("a")
    a.download = name + ".json"
    a.href = "data:application/json;base64," + btoa(JSON.stringify(cards))
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
        }
    }

    onCloseEditModal = () => {
        this.setState({ editCard: null })
        this.props.updateDecks()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.deck) this.setState({ name: nextProps.deck.name })
    }

    loadDeck = () => {
        fileDialog({ accept: "application/json" }).then(files => {
            this.setState({ loadingDeck: true })

            const file = files[0]
            const reader = new FileReader()
            reader.onload = e => {
                try {
                    let loaded = JSON.parse(e.target.result)

                    if (!loaded.length) {
                        throw new Error("not array")
                    }

                    for (let card of loaded) {
                        this.props.deck.addCard(card.front, card.back)
                    }

                    this.props.updateDecks()

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
        if (!this.props.deck) return ""

        const { deck } = this.props
        const cardsReapetedOnce = deck.cards.filter(
            ({ repetitions }) => repetitions.length !== 0
        )
        const learnedCards = cardsReapetedOnce.length
        const totalCards = deck.cards.length
        const learnedRate =
            totalCards === 0
                ? 100
                : Math.round((100 * learnedCards) / totalCards)

        const { reps, correct } = cardsReapetedOnce.reduce(
            ({ reps, correct }, { repetitions }) => ({
                reps: reps + repetitions.length,
                correct:
                    correct +
                    repetitions.filter(({ quality }) => quality >= 4).length,
            }),
            { reps: 0, correct: 0 }
        )

        const recallAccuracy =
            reps === 0 ? 100 : Math.round((100 * correct) / reps)

        const nCardsToReview = deck.cardsToReview().length
        const nCardsToLearn = deck.cardsToLearn().length

        return (
            <>
                {this.state.editCard && (
                    <EditCardModal
                        card={this.state.editCard}
                        onClose={this.onCloseEditModal}
                    />
                )}
                <h1 className="deckName">
                    <input
                        value={this.state.name}
                        onChange={e =>
                            this.setState({
                                name: e.target.value,
                            })
                        }
                        onBlur={e => {
                            deck.name = this.state.name
                            this.props.updateDecks()
                        }}
                    />
                    <div
                        onClick={e =>
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
                            disabled={!nCardsToReview}
                        >
                            <InboxIcon />
                            Smart Review{" "}
                            {!!nCardsToReview && `( ${nCardsToReview} )`}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                this.props.redirectTo(
                                    `/deck/${this.props.deck.id}/cram`
                                )
                                this.setState({ anchorEl: null })
                            }}
                        >
                            <Loop />
                            Cram review
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                deck.archived = !deck.archived
                                this.props.updateDecks(true)
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
                                    width: `${learnedRate}%`,
                                }}
                            />
                        </div>
                        <span className="text">
                            {learnedCards}/{totalCards} cards learned
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
                    {deck.cards.map(card => (
                        <div
                            key={card.id}
                            onClick={() => this.setState({ editCard: card })}
                        >
                            {card.front && (
                                <Markdown
                                    source={card.front
                                        .split("\n")[0]
                                        .replace(new RegExp("^#+", "g"), "")
                                        .trim()}
                                />
                            )}
                        </div>
                    ))}
                    <div
                        key="new-card"
                        id="new-card"
                        onClick={() =>
                            this.setState({
                                editCard: deck.addCard("", ""),
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
    }
}
