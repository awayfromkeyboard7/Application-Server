const fetch = require('node-fetch');

module.exports.getResult = async function (code) {
  const res = await fetch(process.env.JG_SERVER, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    }, 
    body: JSON.stringify({
      clientId: process.env.JG_CLIENT_ID,
      clientSecret: process.env.JG_CLIENT_SECRET,
      script: code,
      stdin: "3 4\n0 0",
      language: "python3",
      versionIndex: 3
    })
  })
  const data = await res.json();
  console.log(data)
  return data
}