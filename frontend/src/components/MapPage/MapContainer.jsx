import { useDispatch, useSelector } from "react-redux";
import { getKey } from "../../store/map";
import Maps from "./Maps";
import { useEffect } from "react";

export default function MapContainer({lng, lat}) {
    const dispatch = useDispatch();
    const apiKey = useSelector(state => state.map.key)

    useEffect(() => {
        if (!apiKey) {
            dispatch(getKey()).then(() => {
                console.log({ apiKey });
            })
        }
    }, [dispatch, apiKey]);

    if (!apiKey) return null;

    return (
        <Maps apiKey={apiKey} lat={lat} lng={lng}/>
    );
}
