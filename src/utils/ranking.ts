export const getLeagueByFFTPadelRank = (gender: "male" | "female", ranking: number) => {
    if (gender === "male") {
        if (ranking <= 500) return "legend"; // p1000
        if (ranking <= 1000) return "premium"; // p500
        if (ranking <= 3000) return "gold"; // p250
        if (ranking <= 10000) return "silver"; // p100
        return "bronze";
    } else {
        if (ranking <= 100) return "diamant";
        if (ranking <= 200) return "rubis";
        if (ranking <= 800) return "emeraude";
        if (ranking <= 1500) return "saphir";
        return "quartz";
    }
}

// League is caped to gold/emeraude when using the quizz
export const getLeagueByQuizScore = (gender: "male" | "female", quizzScore: number) => {
    if (gender === "male") {
        if (quizzScore <= 10) return "bronze";
        if (quizzScore <= 15) return "silver"; 
        return "gold";
    } else {
        if (quizzScore <= 10) return "quartz";
        if (quizzScore <= 15) return "saphir"; 
        return "emeraude";
    }
};
