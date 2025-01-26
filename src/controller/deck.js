import dayjs from "dayjs/esm/index.js"
import {
    createEmptyCard,
    formatDate,
    FSRS,
    generatorParameters,
    Rating,
    Grades,
    State,
} from "ts-fsrs"

const f = new FSRS({
    request_retention: 0.9,
    maximum_interval: 36500,
    w: [
        0.351, 1.0322, 2.7665, 13.8047, 6.9274, 0.7638, 2.1923, 0.001, 2.1606,
        0.1401, 1.6333, 2.004, 0.001, 0.3529, 2.589, 0.1048, 3.6259, 0.0076,
        0.2189,
    ],
})

function qualityToRating(quality) {
    if (quality < 2) {
        return Rating.Again
    } else if (quality === 2) {
        return Rating.Hard
    } else {
        return Rating.Easy
    }
}

const FACTOR = 19 / 81
const DECAY = -0.5
function computeErrorProbability(fsrs, now) {
    let delta = (now - fsrs.last_review) / (24 * 3600 * 1000)
    return Math.pow(1 + FACTOR * (delta / fsrs.stability), DECAY)
}

export function computeHalfLife(fsrs) {
    return (fsrs.stability * (Math.pow(0.5, 1 / DECAY) - 1)) / FACTOR
}

function decodeFSRS(card) {
    let fsrsCard = createEmptyCard()
    fsrsCard.difficulty = card.fsrs.Difficulty
    fsrsCard.due = new Date(card.fsrs.Due)
    fsrsCard.elapsed_days = card.fsrs.ElapsedDays
    fsrsCard.lapses = card.fsrs.Lapses
    fsrsCard.last_review = card.fsrs.LastReview
        ? new Date(card.fsrs.LastReview)
        : undefined
    fsrsCard.reps = card.fsrs.Reps
    fsrsCard.scheduled_days = card.fsrs.ScheduledDays
    fsrsCard.stability = card.fsrs.Stability
    fsrsCard.state = card.fsrs.State

    return fsrsCard
}

class Deck {
    constructor(deck, dispatcher, onDeckUpdate) {
        this.cards = deck.cards.map((c) => ({
            ...c,
            lastRepetition: c.lastRepetition
                ? new Date(c.lastRepetition)
                : null,
            fsrs: decodeFSRS(c),
        }))
        this.id = deck.id
        this.name = deck.name
        this.archived = !!deck.archived
        this.dispatcher = dispatcher
        this.onDeckUpdate = onDeckUpdate
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            cards: this.cards,
            archived: this.archived,
        }
    }

    grade(quality, cardId) {
        let card = this.cards.filter((card) => card.id === cardId)[0]
        if (card === undefined) {
            throw new Error("Could not find card by id")
        }

        let fsrs = f.next(card.fsrs, new Date(), qualityToRating(quality)).card
        this.cards = this.cards.map((entry) =>
            entry.id === card.id
                ? {
                      ...entry,
                      correctRepetitions:
                          quality >= 3
                              ? entry.correctRepetitions + 1
                              : entry.correctRepetitions,
                      totalRepetitions: entry.totalRepetitions + 1,
                      lastRepetition: new Date(),
                      fsrs,
                  }
                : entry
        )
        this.onDeckUpdate()

        return this.dispatcher
            .fetch(`/decks/${this.id}/cards/${cardId}/repetition`, {
                method: "POST",
                body: JSON.stringify({ date: new Date(), quality }),
            })
            .then((res) => res.json())
    }

    learn(cardId) {
        this.grade(4, cardId)
    }

    getBatchToReview() {
        let now = new Date()

        let probabilities = []
        for (let i in this.cards) {
            if (this.cards[i].lastRepetition === null || this.cards[i].paused) {
                continue
            }

            let errorProbability = computeErrorProbability(
                this.cards[i].fsrs,
                now
            )

            probabilities.push({ probability: errorProbability, index: i })
        }
        probabilities.sort((a, b) => b.probability - a.probability)

        probabilities = probabilities.slice(0, 5)
        let cards = probabilities.map(({ index }) => this.cards[index])

        return {
            cards,
            highestProbability:
                probabilities.length > 0 ? probabilities[0].probability : 1,
        }
    }

    getBatchToLearn() {
        return this.cards
            .filter((c) => c.lastRepetition === null && !c.paused)
            .slice(0, 10)
    }

    getStrengthInNDays(days) {
        let time = dayjs().add(days, "day").toDate()

        let probabilities = []
        for (let i in this.cards) {
            if (this.cards[i].lastRepetition === null || this.cards[i].paused) {
                continue
            }

            let errorProbability = computeErrorProbability(
                this.cards[i].fsrs,
                time
            )

            probabilities.push(1 - errorProbability)
        }

        if (probabilities.length === 0) return 0

        let meanProbability =
            probabilities.reduce((a, b) => a + b, 0) / probabilities.length
        return meanProbability
    }

    // Computes the number of days it will take to halve the probability of
    // recalling a card
    getHalfLife() {
        const halfLifes = this.cards
            .filter((c) => c.lastRepetition !== null && !c.paused)
            .map((c) => computeHalfLife(c.fsrs))
        if (halfLifes.length === 0) return 0

        const targetStrength = this.getStrengthInNDays(0) / 2
        let upperBound = Math.max(...halfLifes)
        let lowerBound = Math.min(...halfLifes)

        // Binary search for the half life
        while (upperBound - lowerBound > 0.5) {
            const mid = (upperBound + lowerBound) / 2
            const strength = this.getStrengthInNDays(mid)

            if (strength >= targetStrength) {
                lowerBound = mid
            } else {
                upperBound = mid
            }
        }

        return Math.round((upperBound + lowerBound) / 2)
    }

    cardsToLearn() {
        return this.cards.filter((c) => c.lastRepetition === null)
    }

    async addCard(front = null, back = null) {
        const cardId = await this.dispatcher
            .fetch(`/decks/${this.id}/cards`, {
                method: "POST",
                body: JSON.stringify({ front, back }),
            })
            .then((res) => res.text())

        const newCard = {
            id: cardId,
            correctRepetitions: 0,
            totalRepetitions: 0,
            lastRepetition: null,
            fsrs: createEmptyCard(),
            front,
            back,
            paused: false,
        }
        this.cards.push(newCard)
        this.onDeckUpdate()

        return newCard
    }

    deleteCard(id) {
        this.cards = this.cards.filter((card) => card.id !== id)

        this.dispatcher.fetch(`/decks/${this.id}/cards/${id}`, {
            method: "DELETE",
        })
        this.onDeckUpdate()
    }

    async copyCard(cardId, targetDeck) {
        const newCard = await this.dispatcher
            .fetch(`/decks/${this.id}/cards/${cardId}/copy`, {
                method: "PUT",
                body: JSON.stringify({ newDeckId: targetDeck.id }),
            })
            .then((res) => res.json())
        newCard.lastRepetition = newCard.lastRepetition
            ? new Date(newCard.lastRepetition)
            : null
        newCard.fsrs = decodeFSRS(newCard)
        targetDeck.cards.push(newCard)
        targetDeck.onDeckUpdate()

        return newCard
    }

    async moveCard(cardId, targetDeck) {
        const newCard = await this.dispatcher
            .fetch(`/decks/${this.id}/cards/${cardId}/move`, {
                method: "PUT",
                body: JSON.stringify({ newDeckId: targetDeck.id }),
            })
            .then((res) => res.json())
        newCard.lastRepetition = newCard.lastRepetition
            ? new Date(newCard.lastRepetition)
            : null
        newCard.fsrs = decodeFSRS(newCard)
        targetDeck.cards.push(newCard)
        targetDeck.onDeckUpdate()

        this.cards = this.cards.filter((card) => card.id !== cardId)
        this.onDeckUpdate()

        return newCard
    }

    togglePause(id) {
        let card = this.cards.filter((card) => card.id === id)

        if (card.length === 0) return
        card[0].paused = !card[0].paused

        this.dispatcher.fetch(`/decks/${this.id}/cards/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                paused: card[0].paused,
            }),
        })
        this.onDeckUpdate()
    }
}

export default Deck

export function computeCardStrength(card) {
    if (card.lastRepetition === null) return 0

    let now = new Date()
    let errorProbability = computeErrorProbability(card.fsrs, now)

    return 1 - errorProbability
}
