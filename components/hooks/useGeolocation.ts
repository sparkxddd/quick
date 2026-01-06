import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export interface LocationData {
    latitude: number;
    longitude: number;
    timestamp: number;
    accuracy: number;
}

export interface UseLocationResult {
    location: LocationData | null;
    error: string | null;
    loading: boolean;
    requestLocation: () => Promise<void>;
}

export const useGeolocation = (): UseLocationResult => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const requestLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            // Check permissions
            const permissionStatus = await Geolocation.checkPermissions();

            if (permissionStatus.location === 'denied' || permissionStatus.location === 'prompt') {
                const request = await Geolocation.requestPermissions();
                if (request.location === 'denied') {
                    throw new Error('Location permission denied');
                }
            }

            // Get current position
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000
            });

            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: position.timestamp,
                accuracy: position.coords.accuracy,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to fetch location');
            console.error('Location Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on mount (optional, can be disabled)
    useEffect(() => {
        requestLocation();
    }, []);

    return { location, error, loading, requestLocation };
};
