import { RegisterUser } from "../../api/auth";
import AuthForm, { AuthTitles } from "./AuthForm";
export default function RegisterPage() {
    return (
        <>
            <AuthForm authAction={RegisterUser} title={AuthTitles.Register} />
        </>
    );
}
