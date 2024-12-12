export default function ReviewTile({ name, review, date, stars }) {

    const initialDate = new Date(date)
    const MONTHS = ["Jan", "Feb", "March",
        "April", "May", "June", "July",
        "August", "Sepember", "Ocober",
        "November", "December"]
    const month = MONTHS[initialDate.getMonth()]
    const day = initialDate.getDay()

    return (
        <div className="review-tile">
            <span className="reviewer">{name}</span>
            <span className="udpatedAt">{month} {day} {stars}.0</span>
            <p>{review}</p>
        </div>
    )
}
