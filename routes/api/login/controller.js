const client_id = process.env.GITHUB_CLIENT_ID;

exports.githubLogin = (req, res) => {
  console.log("HERE");
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}`
  res.json({url: url}); // redirect issue
  // res.redirect(url);
}