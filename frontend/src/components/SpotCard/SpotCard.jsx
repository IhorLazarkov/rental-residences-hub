import "./SpotCard.css"

export default function SpotCard({ url, description, rates }) {
    return (
        <div className="spot-card">
            <img src={url} alt="picture of an apartment" />
            <p>{description}</p>
            <div>{rates}</div>
        </div>
    )
}