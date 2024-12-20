
import { useEffect, useState } from "react";
import "./LandingPage.css"
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";

export default function LandingPage() {
    const [isLoading, setIsLoading] = useState(true)
    const { Spots } = useSelector(state => state.spots)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSpots()).then(() => {
            setIsLoading(false)
        })
    }, [dispatch]);

    return (
        <>
            <hr />
            <main>
                {isLoading
                    ? <h1>Welcome! Loading ...</h1>
                    : <div id="spots-container">
                        {Spots.map(spot => {
                            return <SpotCard
                                key={spot.id}
                                id={spot.id}
                                name={spot?.name}
                                previewImage={spot?.previewImage}
                                city={spot?.city}
                                state={spot?.state}
                                price={spot?.price}
                                avgRating={spot?.avgRating}
                            />
                        })}
                    </div>
                }
            </main>
        </>
    );
}