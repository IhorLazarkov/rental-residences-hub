import './Feedback.css';
import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa';
import { useCallback, useEffect, useRef, useState } from 'react';
import { csrfFetch } from '../../store/csrf';
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbFaceIdError } from "react-icons/tb";

export default function Feedback({ visible }) {

    let message = ""
    const [isVisible, setVisible] = useState(visible);
    const [stars, setStars] = useState(0)
    const [isEnabled, setEnabled] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failed, setFailed] = useState(false)
    const [errorTitle, setErrorTitle] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const refTextArea = useRef()

    const onSubmit = useCallback(async (e) => {
        e.preventDefault()
        message = refTextArea.current.value
        try {
            const res = await csrfFetch('/api/feedback', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating: stars, message })
            })
            if (res.ok) {
                setVisible(false);
                setSuccess(true);
            }
        } catch (error) {
            const { title, errors: { message } } = await error.json()
            setVisible(false);
            setFailed(true);
            setErrorTitle(title);
            setErrorMessage(message);
        }
    })

    useEffect(() => {
        stars === 0 ? setEnabled(false) : setEnabled(true)
    }, [stars])

    return (
        <>
            {isVisible &&
                <form id='feedback-container' onSubmit={onSubmit}>
                    <h2 className='header'>Feedback</h2>
                    <div className='sub-text'>How was your experience?</div>
                    <textarea ref={refTextArea} rows="30" cols="28" autoCorrect='on' autoFocus></textarea>
                    <div className='stars-container'>
                        {Array.from({ length: stars }, (v, i) => i + 1).map(star => {
                            return <FaStar key={star} onClick={() => setStars(star - 1)} />
                        })}
                        {Array.from({ length: 5 - stars }, (v, i) => i + stars + 1).map(star => {
                            return <CiStar key={star} onClick={() => setStars(star)} />
                        })}
                    </div>
                    <button className={isEnabled ? "primary" : "disabled"}>Submit</button>
                </form>
            }
            {success &&
                <div style={{ margin: "10% auto", textAlign: "center" }}>
                    <h1>Success !</h1>
                    <FaRegCircleCheck style={{ fontSize: "100px", color: "#008000" }} />
                </div>
            }
            {failed &&
                <div style={{ margin: "10% auto", textAlign: "center" }}>
                    <h1>{errorTitle}</h1>
                    <p>{errorMessage}</p>
                    <TbFaceIdError style={{ fontSize: "100px", color: "#ff0000" }} />
                </div>
            }
        </>
    )
}