import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import './SignupForm.css';

export default function SignupFormModal() {
    const dispatch = useDispatch()
    // const sessionUser = useSelector(state => state.session.user)
    const [username, setUserName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal()
    const [isEnabled, setEnabled] = useState(false);
    const clSubmitButton = !isEnabled ? "disabled" : "primary"
    // if (sessionUser) return <Navigate to="/" replace={true} />

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
            ).then((res) => {
                if (!res.ok) {
                    setErrors(res.errors);
                } else {
                    closeModal()
                }
            });
        }
    };

    useEffect(() => {
        setEnabled(username.length > 4 || password.length > 6)
    }, [username, password])

    return (
        <form
            onSubmit={onSubmit}
            id="signup-form">
            <h2>Sign Up</h2>
            {Object.entries(errors).map(([key, message]) => {
                return <span
                    key={key}
                    className="error"
                >{message}</span>
            })}
            <input type="text" onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder="First Name" />
            <input type="text" onChange={(e) => setLastName(e.target.value)} value={lastName} placeholder="Last Name" />
            <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" />
            <input type="text" onChange={(e) => setUserName(e.target.value)} value={username} placeholder="Username" />
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" />
            <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} placeholder="Confirm Password" />
            <button className={clSubmitButton} type="submit">Sign up</button>
        </form>
    );
}