import { useState } from 'react';
import './Banner.css';
import { CiWarning } from "react-icons/ci";
import { IoMdCloseCircleOutline } from "react-icons/io";

function Banner() {

    const [isVisible, setVisible] = useState(true)

    if (!isVisible) return (<></>)

    return (
        <>
            <div id="banner_container">
                <div className='content'>
                    <CiWarning
                        fontSize={"40px"}
                        color={"yellow"}
                        fontWeight={"700"} />
                    <span className="message">
                        There will be maintenance on April 12 - 13, 2025
                    </span>
                </div>
                <IoMdCloseCircleOutline
                    fontSize={"30px"}
                    cursor={"pointer"}
                    onClick={() => { setVisible(false) }}
                />
            </div>
        </>
    )
}

export default Banner