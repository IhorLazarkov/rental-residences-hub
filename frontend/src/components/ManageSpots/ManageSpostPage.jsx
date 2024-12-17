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
    const { Spots } = useSelector(state => state.spots)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(loadCurrentSpots()).then(() => setIsLoaded(true))
    }, [dispatch])

    const onUpdate = (spotId) => {
        setRedirect(`/spots/${spotId}/edit`);
    }

    if (toRedirect !== '') return <Navigate to={toRedirect} replace={true} />

    return (
        <div className="manage-spots-container">
            <h1>Manage Spots</h1>
            {!isLoaded
                ? <h3>Loading ...</h3>
                : <>
                    {Spots.length === 0 && <NavLink to="/spots/new">Create a New Spot</NavLink>}
                    <ul id="spots-container">
                        {Spots.map(spot => {
                            const preview = spot.SpotImages.find(i => i.preview) || {url:""}
                            return <div key={spot.id} className="manage-spot-wrapper">
                                <SpotCard
                                    key={spot.id}
                                    id={spot.id}
                                    name={spot?.name}
                                    previewImage={preview.url}
                                    city={spot?.city}
                                    state={spot?.state}
                                    price={spot?.price}
                                    avgRating={spot?.avgRating}
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
                    </ul>
                </>
            }
        </div>
    );
}
