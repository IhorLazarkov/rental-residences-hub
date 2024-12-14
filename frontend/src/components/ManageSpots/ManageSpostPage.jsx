import { useDispatch, useSelector } from "react-redux";
import "./ManageSpot.css"
import { useEffect, useState } from "react";
import { deleteSpot, loadCurrentSpots } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";
import { Navigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteConfirmatinModal from "../DeleteConfirmationModal/DeleteConfirmatinModal";

export default function ManageSpostPage() {

    const dispatch = useDispatch()
    const [toRedirect, setRedirect] = useState('')
    const { Spots } = useSelector(state => state.spots)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(loadCurrentSpots()).then(() => setIsLoaded(true))
    }, [dispatch])

    const onUpdate = (spotId) => {
        setRedirect(`/spots/${spotId}/edit`);
    }

    if (toRedirect !== '') return <Navigate to={toRedirect} replace={true} />

    return (<>
        {!isLoaded
            ? <h3>Loading ...</h3>
            : <ul id="spots-container">
                {Spots.length === 0 && <h2>No spots to show</h2>}
                {Spots.map(spot => {
                    return <div key={spot.id} className="manage-spot-wrapper">
                        <SpotCard
                            key={spot.id}
                            id={spot.id}
                            name={spot?.name}
                            previewImage={spot.SpotImages[0].url}
                            city={spot?.city}
                            state={spot?.state}
                            price={spot?.price}
                            avgRating={spot?.avgRating}
                        />
                        <div className="manage-spot-actions">
                            <button onClick={() => onUpdate(spot.id)} className="secondary">Update</button>
                            <OpenModalButton
                                className='critical'
                                spotId={spot.id}
                                buttonText="Delete"
                                modalComponent={<DeleteConfirmatinModal
                                    spotId={spot.id}
                                    title="Confirm Delete"
                                    message="Are you sure you want to delete this spot?"
                                    confirmMessage="Yes (Delete Spot)"
                                    abortMessage="No (Keep Spot)"
                                />}
                            />
                            {/* <button onClick={() => onDelete(spot.id)} className="critical">Delete</button> */}
                        </div>
                    </div>
                })}
            </ul>
        }
    </>
    );
}
