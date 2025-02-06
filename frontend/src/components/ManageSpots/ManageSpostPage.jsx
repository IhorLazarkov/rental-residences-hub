import { useDispatch, useSelector } from "react-redux";
import "./ManageSpot.css"
import { useEffect, useState } from "react";
import { loadCurrentSpots } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";
import { Navigate, NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteConfirmatinModal from "../DeleteConfirmationModal/DeleteConfirmatinModal";

export default function ManageSpostPage() {

    const dispatch = useDispatch()
    const [toRedirect, setRedirect] = useState('')
    const spots = useSelector(state => state.spots)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(loadCurrentSpots()).then(() => setIsLoaded(true))
    }, [dispatch])

    const onUpdate = (spotId) => {
        setRedirect(`/spots/${spotId}/edit`);
    }

    if (toRedirect !== '') return <Navigate to={toRedirect} replace={true} />

    return (
        <main>
            <h3>Manage Spots</h3>
            <div id="spots-container">
                {!isLoaded
                    ? <h3>Loading ...</h3>
                    : <>
                        {Object.values(spots).length === 0 && <NavLink to="/spots/new">Create a New Spot</NavLink>}
                        {Object.values(spots).map(spot => {

                            const preview = spot.SpotImages.find(i => i.preview)
                            const rating = parseInt(spot.avgRating)

                            return <div key={spot.id}>

                                <SpotCard
                                    key={spot.id}
                                    id={spot.id}
                                    name={spot.name}
                                    previewImage={preview.url}
                                    city={spot.city}
                                    state={spot.state}
                                    price={spot.price}
                                    avgRating={rating}
                                />

                                <div className="manage-spot-actions">
                                    <button onClick={() => onUpdate(spot.id)} className="secondary">Update</button>
                                    <OpenModalButton
                                        className='critical'
                                        buttonText="Delete"
                                        modalComponent={<DeleteConfirmatinModal
                                            action="deleteSpot"
                                            spotId={spot.id}
                                            title="Confirm Delete"
                                            message="Are you sure you want to delete this spot?"
                                            confirmMessage="Yes (Delete Spot)"
                                            abortMessage="No (Keep Spot)"
                                        />}
                                    />
                                </div>
                            </div>
                        })}
                    </>
                }
            </div>
        </main>
    );
}
