import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

const ENCRYPTION_KEY = process.env.COOKIE_SECRET; // Must be 256 bits (32 characters)
const IV_LENGTH = 16;

function encrypt(text) {
  let iv = randomBytes(IV_LENGTH);
  let cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
 
  encrypted = Buffer.concat([encrypted, cipher.final()]);
 
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}


function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export {
  encrypt,
  decrypt
}