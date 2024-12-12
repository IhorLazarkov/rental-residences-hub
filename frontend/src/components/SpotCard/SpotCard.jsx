import "./SpotCard.css"
import { IoIosStar } from "react-icons/io";
import { NavLink } from "react-router-dom";

export default function SpotCard({ id, previewImage, city, state, price, avgRating, name }) {
    return (
        <NavLink to={`/${id}`} className="spot-card">
            <img src={previewImage} alt="picture of an apartment" title={name} />
            <div className="spot-card-info">
                <div className="subcontainer">
                    <span className="address">{city}, {state}</span>
                    <span className="rating"><IoIosStar style={{ fontSize: "13px" }} />
                        {avgRating === 0 ? "New" : avgRating + ".0"}
                    </span>
                </div>
                <div><span className="price">${price}</span> night</div>
            </div>
        </NavLink>
    )
}