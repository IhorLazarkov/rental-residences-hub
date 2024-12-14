import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./LoginForm.css"
import { useModal } from "../../context/Modal";

export default function LoginFormModal() {
    const dispatch = useDispatch()
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { closeModal } = useModal()

    const onSubmit = (e) => {
        e.preventDefault()
        setError('')
        dispatch(
            sessionActions.login({
                credential,
                password
            }))
            .then((res) => {
                console.log('res :>> ', res);
                if (res.ok)
                    closeModal()
                else
                    setError(res.message);
            });
    };

    return (
        <>
            <form
                id="login-form"
                onSubmit={onSubmit}>
                <h2>Log In</h2>
                {error && <span className="error">{error}</span>}
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
                        className={credential !== '' && password !== '' ? "primary" : "disabled"}
                    >
                        Login
                    </button>
                </section>
                <a href="">Demo User</a>
            </form>
        </>
    );
}