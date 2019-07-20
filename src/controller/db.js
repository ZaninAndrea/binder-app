// quality:
// 0 - did not remember 😭
// 1 - vague idea 😖
// 2 - recalled with important errors 🤔
// 3 - recalled with slight imperfection 😀
// 4 - recalled correctly 😁
// 5 - easy perfect recollection 😎

module.exports = [
    {
        id: 0,
        front: "mother",
        back: "madre / mamá",
        repetitions: [],
        lastSchedule: 1,
        nextRepeat: new Date(),
        factor: 2.5,
        isRepeatAgain: false,
    },
    {
        id: 1,
        front: "father",
        back: "padre / papá",
        repetitions: [],
        lastSchedule: 1,
        nextRepeat: new Date(),
        factor: 2.5,
        isRepeatAgain: false,
    },
    {
        id: 2,
        front: "brother",
        back: "hermano",
        repetitions: [],
        lastSchedule: 1,
        nextRepeat: new Date(),
        factor: 2.5,
        isRepeatAgain: false,
    },
]
