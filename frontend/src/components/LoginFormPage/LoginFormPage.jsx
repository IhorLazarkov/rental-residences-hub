import { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";

export default function LoginFormPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(login({
            credential: username,
            password
        }))
    }

    return (
        <form >
            <input
                type="text"
                name="username"
                onChange={(e) => setUsername(e.target.value)} />
            <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)} />
            <button
                type="submit"
                onClick={onSubmit}
            >
                Login
            </button>
        </form>
    );
}