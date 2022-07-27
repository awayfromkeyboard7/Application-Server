const client_id = process.env.GITHUB_CLIENT_ID;

exports.githubLogin = (req, res) => {
  console.log('gitLogin request', req)
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}`
  console.log('gitLogin response', res);
  res.json({url: url}); // redirect issue
}