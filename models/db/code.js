const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CodeSchema = new Schema({
    code: {
      type: String,
      default: ''
    },
});

// 코드 저장
CodeSchema.statics.createCode = async function(data){
  return this.create({code : data})
}

// 코드 읽어오기
CodeSchema.statics.getCode = async function(codeId){
  return await this.findById(mongoose.Types.ObjectId(codeId))
}
module.exports = mongoose.model('Code', CodeSchema);