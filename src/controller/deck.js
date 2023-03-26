const dayjs = require("dayjs")

function lerp(a, b, t) {
    return a * (1 - t) + b * t
}

function computeErrorProbability(previousRepetition, time, halfLife) {
    let reviewDelay = time - previousRepetition

    return 1 - Math.pow(2, -reviewDelay / halfLife)
}

function supermemo2(
    quality,
    reviewTime,
    lastHalfLife,
    lastFactor,
    previousRepetition
) {
    if (previousRepetition === null) {
        return { factor: 2.5, halfLife: 6.58 * 24 * 3600 * 1000 }
    }

    let errorProbability = computeErrorProbability(
        previousRepetition,
        reviewTime,
        lastHalfLife
    )
    let reviewUsefulness = errorProbability * 10
    reviewUsefulness = reviewUsefulness > 2 ? 2 : reviewUsefulness

    let factorUpdate = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    let newFac = lastFactor + factorUpdate * reviewUsefulness
    if (newFac < 1.3) {
        newFac = 1.3
    } else if (newFac > 2.5) {
        newFac = 2.5
    }

    let newHalfLife
    if (quality < 3) {
        newHalfLife = lastHalfLife / 2
    } else {
        newHalfLife = lastHalfLife * lerp(1, newFac * 2, reviewUsefulness)
    }

    return {
        factor: newFac,
        halfLife: newHalfLife,
    }
}

class Deck {
    constructor(deck, dispatcher, onDeckUpdate) {
        this.cards = deck.cards
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

        let { factor, halfLife } = supermemo2(
            quality,
            new Date(),
            card.halfLife,
            card.factor,
            card.repetitions.length > 0
                ? new Date(card.repetitions[card.repetitions.length - 1].date)
                : null
        )

        this.cards = this.cards.map((entry) =>
            entry.id === card.id
                ? {
                      ...entry,
                      repetitions: [
                          ...entry.repetitions,
                          { quality, date: new Date() },
                      ],
                      factor,
                      halfLife,
                  }
                : entry
        )
        this.dispatcher.fetch(`/decks/${this.id}/cards/${cardId}/repetition`, {
            method: "POST",
            body: JSON.stringify({ date: new Date(), quality }),
        })
        this.onDeckUpdate()
    }

    learn(cardId) {
        this.grade(4, cardId)
    }

    getBatchToReview() {
        let now = new Date()

        let probabilities = []
        for (let i in this.cards) {
            if (this.cards[i].halfLife === null || this.cards[i].paused) {
                continue
            }

            let previousRepetition = new Date(
                this.cards[i].repetitions[
                    this.cards[i].repetitions.length - 1
                ].date
            )
            let errorProbability = computeErrorProbability(
                previousRepetition,
                now,
                this.cards[i].halfLife
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
            .filter((c) => c.halfLife === null && !c.paused)
            .slice(0, 10)
    }

    getStrengthInNDays(days) {
        let time = dayjs().add(days, "day").toDate()

        let probabilities = []
        for (let i in this.cards) {
            if (this.cards[i].halfLife === null || this.cards[i].paused) {
                continue
            }

            let previousRepetition = new Date(
                this.cards[i].repetitions[
                    this.cards[i].repetitions.length - 1
                ].date
            )
            let errorProbability = computeErrorProbability(
                previousRepetition,
                time,
                this.cards[i].halfLife
            )

            probabilities.push(1 - errorProbability)
        }

        if (probabilities.length === 0) return 1

        let meanProbability =
            probabilities.reduce((a, b) => a + b, 0) / probabilities.length
        return meanProbability
    }

    cardsToLearn() {
        return this.cards.filter((c) => c.halfLife === null)
    }

    async addCard(front = "", back = "") {
        const cardId = await this.dispatcher
            .fetch(`/decks/${this.id}/cards`, {
                method: "POST",
                body: JSON.stringify({ front, back }),
            })
            .then((res) => res.text())

        const newCard = {
            id: cardId,
            repetitions: [],
            halfLife: null,
            factor: 2.5,
            front,
            back,
            paused: false,
        }
        this.cards.push(newCard)
        this.onDeckUpdate()

        return newCard
    }

    deleteCard(id) {
        this.cards = this.cards.filter(
            (card) => card.id.toString() !== id.toString()
        )

        this.dispatcher.fetch(`/decks/${this.id}/cards/${cardId}`, {
            method: "DELETE",
        })
        this.onDeckUpdate()
    }

    togglePause(id) {
        let card = this.cards.filter(
            (card) => card.id.toString() === id.toString()
        )

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
