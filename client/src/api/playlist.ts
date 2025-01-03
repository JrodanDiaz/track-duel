import { getSavedPlaylistsSchema } from "../schemas"

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

//add query parameter since GET requests cannot have bodies apparently
export const getSavedPlaylists = async ({offset}: {offset: number}): Promise<[noSavedPlaylists: boolean | undefined, playlists: string[] | undefined, errorMessage: string | undefined]> => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/playlist?offset=${offset}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  })

  const result = getSavedPlaylistsSchema.safeParse(await response.json())
  if(!result.success) {
    console.log(`Error parsing playlist response: ${result.error}`);
    return [undefined, undefined, "Error parsing response"]
  }

  if("errorMessage" in result.data) {
    return [response.status === 404, undefined, result.data.errorMessage]
  }

  return [false, result.data, undefined]

}