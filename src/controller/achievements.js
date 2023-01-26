const achievementMilestones = {
    TOTAL_REPETITIONS: [
        10, 25, 50, 100, 250, 250, 500, 1000, 2500, 5000, 10000, 25000,
    ],
    ACTIVE_DAYS: [3, 7, 14, 30, 100, 365, 1000],
    SINGLE_DAY_REPETITIONS: [5, 20, 50, 100, 250],
}

function getAchievementStatus(stat, achievementName, currentLevel) {
    const missingMilestones = achievementMilestones[achievementName].filter(
        (milestone) => milestone > currentLevel
    )

    let unlockedLevel = currentLevel
    let nextMilestone = null
    for (let milestone of missingMilestones) {
        if (stat >= milestone) {
            unlockedLevel = milestone
        } else {
            nextMilestone = milestone
            break
        }
    }

    let progress = nextMilestone === null ? 1 : stat / nextMilestone

    return { unlockedLevel, nextMilestone, progress }
}

export function updateAchievements(stats, achievements) {
    const newAchievements = {}

    let status = getAchievementStatus(
        stats.repetitions,
        "TOTAL_REPETITIONS",
        achievements.TOTAL_REPETITIONS
    )
    newAchievements.TOTAL_REPETITIONS = status.unlockedLevel

    status = getAchievementStatus(
        stats.activeDays,
        "ACTIVE_DAYS",
        achievements.ACTIVE_DAYS
    )
    newAchievements.ACTIVE_DAYS = status.unlockedLevel

    status = getAchievementStatus(
        stats.today.repetitions,
        "SINGLE_DAY_REPETITIONS",
        achievements.SINGLE_DAY_REPETITIONS
    )
    newAchievements.SINGLE_DAY_REPETITIONS = status.unlockedLevel

    return newAchievements
}
