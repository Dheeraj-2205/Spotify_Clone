async function getToken () {
  const clientId = '759884d040d349538fa760f5fc776b08';
  const clientSecret = '2515dd0e369e482da00e5304388f3812';

  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await result.json();
  return data.access_token;
}

async function refreshToken () {
  let newToken = await getToken();
  localStorage.setItem('spotify_token', newToken);
  location.reload();
}

async function getPlaylists(category, limit, TOKEN) {
  let response = await fetch(`https://api.spotify.com/v1/browse/categories/${category}/playlists?country=IN&offset=0&limit=${limit}`, {
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  let data = await response.json();
  return data.playlists.items;
}

export { refreshToken, getPlaylists };