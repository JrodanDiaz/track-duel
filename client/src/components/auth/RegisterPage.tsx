import { RegisterUser } from "../../api/auth";
import AuthForm from "./AuthForm";
export default function RegisterPage() {
    return (
        <>
            <AuthForm authAction={RegisterUser} title="Register" />
        </>
    );
}
