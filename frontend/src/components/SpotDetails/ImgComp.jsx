import { useState } from "react"

export default function ImgComp({ url }) {

    const [isLoading, setIsLoading] = useState(true)

    return (
        <img
            src={url}
            onLoad={() => setIsLoading(false)}
            style={{opacity: isLoading ? 0 : 1}}
        />
    )
}