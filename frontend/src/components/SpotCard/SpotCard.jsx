import "./SpotCard.css"

export default function SpotCard({ url, description, avgRating, previewImage }) {
    return (
        <div className="spot-card">
            <img src={url} alt="picture of an apartment" />
            <p>{description}</p>
            <div>{avgRating}</div>
        </div>
    )
}