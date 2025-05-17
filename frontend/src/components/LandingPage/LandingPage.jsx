import { useEffect, useState } from "react";
import "./LandingPage.css"
import { useSelector } from "react-redux";
import SpotCard from "../SpotCard/SpotCard";
import Filtering from "../Filtering/Filtering";
import { IoFilter } from "react-icons/io5";

export default function LandingPage() {

    const spots = useSelector(state => state.spots)
    const [isLoading, setIsLoading] = useState(true)
    const [isFilterVisisble, setFilterVisibility] = useState(false)

    useEffect(() => {
        if (Object.values(spots).length > 0)
            setIsLoading(false)
    }, [spots]);

    return (
        <>
            <div id="filter-tab">
                <Filtering visible={isFilterVisisble} />
                <IoFilter
                    id="filter-hide-open"
                    onClick={() => setFilterVisibility(prev => !prev)}
                    style={{
                        transform: isFilterVisisble ? "rotate(180deg)" : ""
                    }}
                />
            </div>
            <main id="spots-container">
                {isLoading
                    ? <h1>Loading ...</h1>
                    : <>
                        {Object.values(spots).length === 0 && <h3>No spots found</h3>}
                        {!spots.newSpot && Object.values(spots).map(spot => {
                            return <SpotCard key={spot.id}
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