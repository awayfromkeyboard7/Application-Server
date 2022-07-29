const jwt = require('jsonwebtoken');

require("dotenv").config();

const SECRETKEY = process.env.JWT_SECRET;
const EXPIRESIN = process.env.EXPIRESIN;
const ISSUER = process.env.ISSUER;

exports.verify = async (token) => {
  try {
    const payload = await new Promise(
      (resolve, reject) => {
        jwt.verify(token, SECRETKEY, (e, decoded) => {
          if (e) reject(e);
          resolve(decoded);
        });
      }
    );
  
    if (payload !== undefined) {
      return { 
        gitId: payload.gitId,
        nodeId: payload.nodeId,
        avatarUrl: payload.avatarUrl
      }
    }
  } catch(e) {
    console.log(`INVALID JWT TOKEN`);
    return false;
  }
}

// exports.verify = async (token) => {
//   return new Promise(
//     (resolve, reject) => {
//       jwt.verify(token, SECRETKEY, (e, decoded) => {
//         if (e) reject(e);
//         resolve(decoded);
//       });
//     }
//   );
// }