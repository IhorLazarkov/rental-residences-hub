// frontend/src/components/Maps/Maps.js
import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const Maps = ({ apiKey, lat = 38.9072, lng = 77.0369 }) => {

    const position = { lat, lng }
    const containerStyle = {
        width: '100%',
        height: '100%',
    };

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
    });

    if (loadError) return <div>Map cannot loaded error: {loadError}</div>

    return (
        <>
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={position}
                    zoom={13}
                >
                    <Marker
                        position={position}
                    />
                </GoogleMap>
            )}
        </>
    );
};

export default React.memo(Maps);