import { useDispatch, useSelector } from "react-redux"
import "./ManageReviews.css"
import { useEffect, useState } from "react"
import { getCurrentReviews } from "../../store/review"
import ReviewTile from "../SpotDetails/ReviewTile"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import DeleteConfirmatinModal from "../DeleteConfirmationModal/DeleteConfirmatinModal"
import ReviewModalForm from "../ReviewModalForm/ReviewModalForm"

export default function ManageReviewsPage() {

    const dispatch = useDispatch()
    const { Reviews } = useSelector(state => state.reviews)
    const [currentReviews, setReviews] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(getCurrentReviews()).then(() => setIsLoaded(true))
    }, [dispatch])

    useEffect(() => {
        setReviews(Reviews)
    }, [Reviews])

    return (
        <main className="manage-reviews-container">
            {!isLoaded
                ? <h2>Loading ...</h2>
                : <>
                    {currentReviews.length === 0 && <h2>No Reviews</h2>}
                    {currentReviews.map(({ id: reviewId, spotId, Spot, review, updatedAt, stars }) => {
                        return <div key={reviewId}>
                            <h3>{Spot?.name}</h3>
                            <ReviewTile
                                key={reviewId}
                                review={review}
                                date={updatedAt}
                                stars={stars}
                            />
                            <div className="review-actions-container">
                                <OpenModalButton
                                    key={spotId + reviewId + 1}
                                    className="secondary"
                                    buttonText="Update"
                                    modalComponent={<ReviewModalForm
                                        action="updateCurrent"
                                        spotName={Spot?.name}
                                        reviewId={reviewId}
                                        reviewMessage={review}
                                        starsInit={stars} />
                                    } />
                                <OpenModalButton
                                    key={reviewId + spotId}
                                    className="critical"
                                    buttonText="Delete"
                                    modalComponent={<DeleteConfirmatinModal
                                        action="updateCurrent"
                                        reviewId={reviewId}
                                        title="Confirm Delete"
                                        message="Are you sure you want to delete this review?"
                                        confirmMessage="Yes (Delete Review)"
                                        abortMessage="No (Keep Review)"
                                    />}
                                />
                            </div>
                        </div>
                    })}
                </>
            }
        </main>
    )
}
