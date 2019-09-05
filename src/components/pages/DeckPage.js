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

export default class DeckPage extends React.Component {
    state = {
        editCard: null,
        anchorEl: null,
        wantsToDelete: false,
    }

    onCloseEditModal = () => {
        this.setState({ editCard: null })
        this.props.updateDecks()
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
                        defaultValue={this.props.deck.name}
                        onBlur={e => {
                            deck.name = e.target.value
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
                                this.props.setBackToPage(
                                    `/deck/${this.props.deck.id}`
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
                                this.props.setBackToPage(
                                    `/deck/${this.props.deck.id}`
                                )
                                this.setState({ anchorEl: null })
                            }}
                            disabled={!nCardsToReview}
                        >
                            <InboxIcon />
                            Review {!!nCardsToReview && `( ${nCardsToReview} )`}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                this.props.redirectTo(
                                    `/deck/${this.props.deck.id}/cram`
                                )
                                this.props.setBackToPage(
                                    `/deck/${this.props.deck.id}`
                                )
                                this.setState({ anchorEl: null })
                            }}
                        >
                            <Loop />
                            Cram review
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                let shouldDelete = false
                                this.setState(
                                    ({ wantsToDelete }) => {
                                        if (wantsToDelete) {
                                            shouldDelete = true
                                            return { anchorEl: null }
                                        } else return { wantsToDelete: true }
                                    },
                                    () => {
                                        if (shouldDelete)
                                            this.props.deleteDeck()
                                    }
                                )
                            }}
                            style={
                                this.state.wantsToDelete
                                    ? { color: "var(--primary-color)" }
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
                        <span className="text">{recallAccuracy}% accuracy</span>
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
                                editCard: deck.addCard({
                                    front: "",
                                    back: "",
                                }),
                            })
                        }
                    >
                        New Card
                    </div>
                </div>
            </>
        )
    }
}
