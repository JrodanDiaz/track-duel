import { useNavigate } from "react-router-dom"
import { useUserContext } from "./UserContext"
import { useEffect } from "react"

export default function UnAuthGuard({element}: {element: JSX.Element}) {
    const user = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        checkToken()
    }, [user])

    const checkToken = () => {
        if(user.username && user.spotify_token) {
            navigate("/")
        }
    }

    return <>{element}</>
}