import { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import "./LoginForm.css"
import { Navigate } from "react-router-dom";

export default function LoginFormPage() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [credential, setCredential] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    if (sessionUser) return <Navigate to="/" replace={true} />

    const onSubmit = (e) => {
        e.preventDefault()
        setErrors({})
        dispatch(login({
            credential,
            password
        })).catch(
            async (res) => {
                const data = await res.json();
                if (data?.errors) setErrors(data.errors);
            }
        );
    };

    return (
        <>
            <h1>Log In</h1>
            <form >
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
                {errors.credential && <p>{errors.credential}</p>}
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