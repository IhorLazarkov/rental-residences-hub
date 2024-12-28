import { useEffect, useState } from "react";
import "./LandingPage.css"
import { useDispatch, useSelector } from "react-redux";
import { getSpots } from "../../store/spots";
import SpotCard from "../SpotCard/SpotCard";
import Filtering from "../Filtering/Filtering";

export default function LandingPage() {

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const spots = useSelector(state => state.spots)

    useEffect(() => {
        dispatch(getSpots()).then(() => {
            setIsLoading(false)
        })
    }, [dispatch]);

    return (
        <>
            <Filtering />
            <main id="spots-container">
                {isLoading
                    ? <h1>Loading ...</h1>
                    : <>
                        {Object.values(spots).length === 0 && <h3>No spots found</h3>}
                        {Object.values(spots).map(spot => {
                            return <SpotCard
                                key={spot.id}
                                id={spot.id}
                                name={spot.name}
                                previewImage={spot.previewImage}
                                city={spot.city}
                                state={spot.state}
                                price={spot.price}
                                avgRating={spot.avgRating}
                            />
                        })}
                    </>
                }
            </main>
        </>
    );
}