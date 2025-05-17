import "./ImgComp.css"
import { useState } from "react"

export default function ImgComp({ url }) {

    const [isLoading, setIsLoading] = useState(true)

    return (
        <div
            className="img-container"
            style={{
                position: "relative",
                overflow: "hidden",
            }}
        >
            {isLoading
                ? <div className={`spinner on`} style={{
                    width: "25px",
                    height: "25px",
                    border: "4px solid #ddd",
                    borderTop: "4px solid rgb(0, 92, 230)",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                }}> </div>
                : <div className={`spinner off`}></div>}
            <img
                src={url}
                onLoad={() => setIsLoading(false)}
                style={{ opacity: isLoading ? 0 : 1 }}
            />
        </div>

    )
}