import { LoginUser } from "../../api/auth";
import AuthForm, { AuthTitles } from "./AuthForm";

export default function LoginPage() {
    return <AuthForm authAction={LoginUser} title={AuthTitles.SignIn} />;
}
