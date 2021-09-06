const supermemo2 = require("./supermemo2.js")
const dayjs = require("dayjs")

function shuffle(a) {
    var j, x, i
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
}

const maskArray = (arr, indexes) => [...new Set(indexes)].map((id) => arr[id])

class Deck {
    constructor(deck, updateDecks) {
        const now = new Date()
        this.cards = deck.cards
        this.id = deck.id
        this.name = deck.name
        this.archived = !!deck.archived
        this.updateDecks = updateDecks

        this.indexesToReview = shuffle(
            this.cards
                .filter(
                    ({ nextRepeat, isRepeatAgain, paused }) =>
                        ((nextRepeat !== null && new Date(nextRepeat) <= now) ||
                            isRepeatAgain) &&
                        !paused
                )
                .map((card) => card.id)
        )

        this.indexesToLearn = shuffle(
            this.cards
                .filter(
                    ({ nextRepeat, paused }) => nextRepeat === null && !paused
                )
                .map((card) => card.id)
        )

        this.currentIndex = null
    }

    saveDB() {
        this.updateDecks()
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            cards: this.cards,
            archived: this.archived,
        }
    }

    grade(quality) {
        let card = this.getCurrentCard()
        this.indexesToReview.shift()
        let { isRepeatAgain, factor, schedule } = supermemo2(
            quality,
            card.lastSchedule,
            card.factor
        )

        // add a bit of randomness to the scheduling to decluster the repetitions
        const jitter = 1 + (Math.random() - 0.5) * 0.2
        schedule = Math.round(schedule * jitter)

        this.cards = this.cards.map((entry) =>
            entry.id === card.id
                ? {
                      ...entry,
                      repetitions: [
                          ...entry.repetitions,
                          { quality, date: new Date() },
                      ],
                      factor,
                      lastSchedule: entry.isRepeatAgain
                          ? entry.lastSchedule
                          : schedule,
                      isRepeatAgain,
                      nextRepeat: entry.isRepeatAgain
                          ? entry.nextRepeat
                          : dayjs(new Date()).add(schedule, "days").toDate(),
                  }
                : entry
        )
        this.saveDB()

        if (isRepeatAgain) {
            this.indexesToReview.push(this.currentIndex)
        }
    }

    learn() {
        // learning a card counts as a grade 4 recollection
        this.indexesToReview.unshift(this.indexesToLearn.shift())
        this.grade(4)
    }

    getCurrentCard() {
        return this.currentIndex !== null
            ? this.cards.filter(
                  (card) => card.id.toString() === this.currentIndex.toString()
              )[0]
            : null
    }

    cardsToReview() {
        return maskArray(this.cards, this.indexesToReview)
    }

    cardsToLearn() {
        return maskArray(this.cards, this.indexesToLearn)
    }

    hasCardsToReview() {
        return this.indexesToReview.length > 0
    }

    hasCardsToLearn() {
        return this.indexesToLearn.length > 0
    }

    nextCardToReview() {
        this.currentIndex = this.hasCardsToReview()
            ? this.indexesToReview[0]
            : null

        return { ...this.getCurrentCard(), isNew: false }
    }

    nextCardToLearn() {
        this.currentIndex = this.hasCardsToLearn()
            ? this.indexesToLearn[0]
            : null

        return { ...this.getCurrentCard(), isNew: true }
    }

    addCard(front = "", back = "") {
        const newCard = {
            id:
                this.cards.reduce(
                    (acc, curr) => Math.max(acc, parseInt(curr.id)),
                    0
                ) + 1,
            repetitions: [],
            lastSchedule: null,
            nextRepeat: null,
            factor: 2.5,
            isRepeatAgain: false,
            front,
            back,
            paused: false,
        }
        this.cards.push(newCard)

        this.indexesToLearn.push(this.cards.length - 1)

        return newCard
    }

    deleteCard(id) {
        this.cards = this.cards.filter(
            (card) => card.id.toString() !== id.toString()
        )

        this.indexesToLearn = this.indexesToLearn.filter(
            (index) => index.toString() !== id.toString()
        )
        this.indexesToReview = this.indexesToReview.filter(
            (index) => index.toString() !== id.toString()
        )
    }

    togglePause(id) {
        let card = this.cards.filter(
            (card) => card.id.toString() === id.toString()
        )

        if (card.length === 0) return

        card = card[0]
        card.paused = !card.paused

        const now = new Date()
        if (card.nextRepeat === null && !card.paused)
            this.indexesToLearn.push(card.id)
        if (
            ((card.nextRepeat !== null && new Date(card.nextRepeat) <= now) ||
                card.isRepeatAgain) &&
            !card.paused
        )
            this.indexesToReview.push(card.id)
    }
}

export default Deck
