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

export { getPlaylists };