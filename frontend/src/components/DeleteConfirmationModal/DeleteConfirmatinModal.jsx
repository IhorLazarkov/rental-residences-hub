import { useDispatch } from "react-redux"
import { useModal } from "../../context/Modal"
import { deleteReview } from "../../store/review"
import { useState } from "react"
import "./DeleteConfirmation.css";

export default function DeleteConfirmatinModal({ reviewId, spotId, title, message, confirmMessage, abortMessage }) {

    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const [error, setError] = useState('')

    const onDelete = () => {
        dispatch(deleteReview({reviewId, spotId}))
            .then((res) => {
                if (!res.ok) {
                    console.log('res :>> ', res);
                    setError(res.statusText)
                } else
                    closeModal()
            })
    }

    return (
        <div className="confirm-modal-dialog-container">
            <h2>{title}</h2>
            <h3>{message}</h3>
            {error && <span class="error">Error: {error}</span>}
            <button className="critical" onClick={onDelete}>{confirmMessage}</button>
            <button className="secondary" onClick={closeModal}>{abortMessage}</button>
        </div>
    )
};
