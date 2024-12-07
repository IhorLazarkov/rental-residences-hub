import "./SpotCard.css"
import { IoIosStar } from "react-icons/io";

export default function SpotCard({ previewImage, city, state, price, avgRating, name }) {
    return (
        <div className="spot-card">
            <img src={previewImage} alt="picture of an apartment" title={name} />
            <div className="spot-card-info">
                <div className="subcontainer">
                    <span className="address">{city}, {state}</span>
                    <span className="rating"><IoIosStar style={{ fontSize: "13px" }} /> {avgRating}.0</span>
                </div>
                <div className="price">${price} night</div>
            </div>
        </div>
    )
}