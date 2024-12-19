export const savePlaylist = async (url: string): Promise<boolean> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/playlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({playlistUrl: url}),
    credentials: "include"
  })
  return response.ok
}