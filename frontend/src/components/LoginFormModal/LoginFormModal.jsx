import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./LoginForm.css"
import { useModal } from "../../context/Modal";

export default function LoginFormModal() {
    const dispatch = useDispatch()
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState('')
    const { closeModal } = useModal()

    const onSubmit = (e) => {
        e.preventDefault()
        setErrors('')
        dispatch(
            sessionActions.login({
                credential,
                password
            }))
            .then((res) => {
                if (res.ok)
                    closeModal()
                else
                    setErrors(res.statusText);
            });
    };

    return (
        <>
            <h1>Log In</h1>
            <form method="POST">
                <div>
                    <label htmlFor="username">Username or Email</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        onChange={(e) => setCredential(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                {errors && <span className="error">{errors}</span>}
                <button
                    type="submit"
                    onClick={onSubmit}
                >
                    Login
                </button>
            </form>
        </>
    );
}