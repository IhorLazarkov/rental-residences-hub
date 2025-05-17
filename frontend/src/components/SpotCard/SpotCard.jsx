import "./SpotCard.css"
import { IoIosStar } from "react-icons/io";
import { NavLink } from "react-router-dom";
import ImgComp from "../SpotDetails/ImgComp";

export default function SpotCard({ id, previewImage, city, state, price, avgRating, name }) {

    const rating = parseFloat(avgRating) === 0 ? "New" : avgRating

    return (
        <NavLink to={`/${id}`} className="spot-card">

            <ImgComp url={previewImage} />

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