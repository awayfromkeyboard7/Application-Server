const mongoose = require('mongoose');
// const User = require('./user');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    gitId: {
      type: String,
      required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Problem',
    },
    mostLanguage: {
      type: String,
      default : ''
    },
    avatarUrl: {
        type: String,
    },
    ranking: {
      type: Number,
      default: false
    },
    winRate: {
      type: Number,
      default: 0
    }
  });

const RankingSchema = new Schema({
    type :{
        type: String,
        default: "all"
    },
    rank: {
        type: [UserSchema],
        defualt: []
      },
})

RankingSchema.statics.getRanking =async function(result){
  return await this.findOne({type: "all"})
}

RankingSchema.statics.updateRanking =async function(result){
  // console.log("passHere??????updateRank")
  // console.log(result)
  for await(let user of result){
    if(0<user["totalSolo"]+user["totalTeam"]){
      user["winRate"] = parseInt(user["winSolo"]+user["winTeam"]/user["totalSolo"]+user["totalTeam"]*100)
    }
    delete user["token"]
    delete user["problemHistory"]
    delete user["gameLogHistory"]
    delete user["following"]
    delete user["follower"]
    delete user["language"]
    delete user["totalSolo"]
    delete user["totalTeam"]
    delete user["winSolo"]
    delete user["winTeam"]
  }

  return this.findOneAndUpdate(
      { type: "all" },
      { 
        $set: { 
          rank : result,
        }
      },
      { 
        new: true
      }
    ).exec();
}
module.exports = mongoose.model('Ranking', RankingSchema);