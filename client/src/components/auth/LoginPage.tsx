import { LoginUser } from "../../api/auth";
import AuthForm from "./AuthForm";

export default function LoginPage() {
    return <AuthForm authAction={LoginUser} title="Sign In" />;
}
