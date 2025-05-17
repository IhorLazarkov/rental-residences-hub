import "./SpotCard.css"
import { useEffect, useRef, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { NavLink } from "react-router-dom";

export default function SpotCard({ spot }) {

    const imgRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const { id, previewImage, city, state, price, avgRating, name } = spot

    const rating = parseFloat(avgRating) === 0 ? "New" : avgRating

    return (
        <NavLink to={`/${id}`} className="spot-card">
            <img
                ref={imgRef}
                src={previewImage}
                loading="lazy"
                style={{ opacity: isLoading ? 0 : 1 }}
                onLoad={() => setIsLoading(false)}
                alt={`picture of ${name}`}
                title={name} />
            <div className="spot-card-info">
                <div className="subcontainer">
                    <span className="address">{city}, {state}</span>
                    <span className="rating">
                        <IoIosStar style={{ fontSize: "13px" }} />
                        {avgRating === null ? "New" : rating}
                    </span>
                </div>
                <div><span className="price">${price}</span> night</div>
            </div>
        </NavLink>
    )
}