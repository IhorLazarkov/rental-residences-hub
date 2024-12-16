import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./LoginForm.css"
import { useModal } from "../../context/Modal";

export default function LoginFormModal() {
    const dispatch = useDispatch()
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
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
                    setErrors({ message: "The provided credentials were invalid" })
            });
    };

    const onDemoLogin = (e) => {
        e.preventDefault();
        dispatch(
            sessionActions.login({
                credential: "Demo-lition",
                password: "password"
            })).then(res => {
                if (res.ok) closeModal();
            })
    }

    return (
        <>
            <form
                id="login-form"
                onSubmit={onSubmit}>
                <h2>Log In</h2>
                {Object.entries(errors).map(([key, message]) => <span className="error" key={key}>{message}</span>)}
                <section>
                    <label htmlFor="username">Username or Email</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username or Email"
                        onChange={(e) => setCredential(e.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)} />
                    <button
                        type="submit"
                        className={credential.length > 4 || password.length > 6
                            ? "primary"
                            : "disabled"}
                    >
                        Login
                    </button>
                </section>
                <a href="" onClick={onDemoLogin}>Log In as Demo User</a>
            </form>
        </>
    );
}