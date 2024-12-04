import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";

export default function SignupFormModal() {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [username, setUserName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const {closeModal} = useModal()

    if (sessionUser) return <Navigate to="/" replace={true} />

    const onSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors);
                }
            });
        }
        return setErrors({
            confirmPassword: "Confirm Password field must be the same as the Password field"
        });
    };
    return (
        <>
            <h1>Sign up</h1>
            <form method="POST" onSubmit={onSubmit}>
                <label htmlFor="username">User name
                    <input type="text" name="username" id="username" onChange={(e) => setUserName(e.target.value)} />
                    {errors.username && <p>{errors.username}</p>}
                </label>
                <label htmlFor="firstName">First Name
                    <input type="text" name="firstName" id="firstName" onChange={(e) => setFirstName(e.target.value)} />
                    {errors.firstName && <p>{errors.firstName}</p>}
                </label>
                <label htmlFor="lastName">Last Name
                    <input type="text" name="lastName" id="lastName" onChange={(e) => setLastName(e.target.value)} />
                    {errors.firstName && <p>{errors.lastName}</p>}
                </label>
                <label htmlFor="email"> email
                    <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p>{errors.email}</p>}
                </label>
                <label htmlFor="password">password
                    <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p>{errors.password}</p>}
                </label>
                <label htmlFor="confirPassword">confirm password
                    <input type="password" name="confirPassword" id="confirPassword" onChange={(e) => setConfirmPassword(e.target.value)} />
                    {errors.confirmPassowrd && <p>{errors.confirmPassowrd}</p>}
                </label>
                <button type="submit">Sign up</button>
            </form>
        </>
    );
}