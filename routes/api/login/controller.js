const client_id = process.env.GITHUB_CLIENT_ID;

export function githubLogin(req, res) {
  const url = `https://github.com/login/oauth/authorize?client_id=${client_id}`
  res.json({url: url}); // redirect issue
}