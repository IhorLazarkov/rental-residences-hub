import { useDispatch, useSelector } from "react-redux";
import "./ManageSpot.css"
import { useEffect, useState } from "react";
import { deleteSpot, loadCurrentSpots } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";

export default function ManageSpostPage() {

    const dispatch = useDispatch()
    const { Spots } = useSelector(state => state.spots)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(loadCurrentSpots()).then(() => setIsLoaded(true))
    }, [dispatch])

    const onDelete = (id) => {
        dispatch(deleteSpot(id))
    }

    return (<>
        {!isLoaded
            ? <h3>Loading ...</h3>
            : <ul id="spots-container">
                {Spots.map(spot => {
                    return <div className="manage-spot-wrapper">
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
                            <button onClick={() => onUpdate(spot.id)} className="secondary"><FaRegEdit style={{ fontSize: "18px" }}/>Update</button>
                            <button onClick={() => onDelete(spot.id)} className="critical"><AiOutlineDelete style={{ fontSize: "18px" }}/>Delete</button>
                        </div>
                    </div>
                })}
            </ul>
        }
    </>
    );
};
