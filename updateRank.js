const cron = require('node-cron');
const db = require('./lib/db');
const User = require("./models/db/user");
const Ranking = require("./models/db/ranking");
db.connect();

async function updateRank() {
    try {
        const result = await User.totalRankUpdate();
        await Ranking.updateRanking(result);
    } catch(e) {
        throw new Error(e)
    }
}

const task = cron.schedule('*/5 * * * *', () => {
    updateRank();
}, {
    schedule: false
});

task.start();