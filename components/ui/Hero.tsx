"use client";

import { motion } from "framer-motion";
import { ModernButton } from "./ModernButton";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { useGeolocation } from "../hooks/useGeolocation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Hero() {
    const router = useRouter();
    const { location, loading, error, requestLocation } = useGeolocation();
    const [address, setAddress] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);

    // Reverse Geocode when location updates
    useEffect(() => {
        if (location) {
            setIsFetchingAddress(true);
            // Use OpenStreetMap Nominatim for free reverse geocoding (Demo purposes)
            // In production, use Google Maps Geocoding API server-side to hide keys
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.display_name) {
                        // Simplify address: city, suburb, etc.
                        const parts = data.display_name.split(', ');
                        const simpleDetails = parts.slice(0, 3).join(', ');
                        setAddress(simpleDetails);
                    } else {
                        setAddress(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
                    }
                })
                .catch(() => {
                    setAddress(`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
                })
                .finally(() => setIsFetchingAddress(false));
        }
    }, [location]);

    const handleLocationClick = () => {
        requestLocation();
    };

    return (
        <section className="relative w-full overflow-hidden bg-background pt-24 pb-32 lg:pt-32 lg:pb-40">
            {/* Background gradients */}
            <div className="absolute top-0 left-1/2 -ml-[40rem] w-[80rem] h-[30rem] bg-gradient-to-tr from-primary/20 to-accent/20 blur-[100px] rounded-full opacity-50 -z-10 animate-float" />
            <div className="absolute bottom-0 right-1/2 -mr-[40rem] w-[80rem] h-[40rem] bg-gradient-to-bl from-accent/20 to-primary/10 blur-[100px] rounded-full opacity-50 -z-10" />

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6 border border-accent/20">
                        #1 Trusted Service Marketplace
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
                >
                    Book Trusted Pros <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        Anytime, Anywhere.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
                >
                    Expert plumbers, electricians, and technicians at your doorstep in minutes.
                    Experience the new standard of home services.
                </motion.p>

                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="glass-card max-w-3xl mx-auto p-4 flex flex-col md:flex-row items-center gap-4 rounded-2xl"
                >
                    <div className="flex-1 w-full bg-white/50 dark:bg-slate-800/50 rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-primary/50 transition-colors">
                        <MapPin
                            className={`text-muted-foreground cursor-pointer hover:text-primary transition-colors ${loading ? 'animate-pulse text-primary' : ''}`}
                            size={20}
                            onClick={handleLocationClick}
                        />
                        <input
                            type="text"
                            placeholder={loading || isFetchingAddress ? "Detecting location..." : "Enter location"}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="flex-1 w-full bg-white/50 dark:bg-slate-800/50 rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-primary/50 transition-colors">
                        <Search className="text-muted-foreground" size={20} />
                        <select
                            className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground appearance-none cursor-pointer"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            <option value="" disabled>Select Service</option>
                            <option value="emergency">🚨 Emergency Service</option>
                            <option value="towing">🚛 Towing Service</option>
                            <option value="mechanic">🔧 Mechanic</option>
                            <option value="plumbing">� Plumbing</option>
                            <option value="plumbing">🪠 Plumbing</option>
                            <option value="electrical">⚡ Electrical</option>
                            <option value="cleaning">🧹 Cleaning</option>
                            <option value="hvac">❄️ AC & Heating</option>
                            <option value="moving">📦 Moving</option>
                        </select>
                    </div>
                    <ModernButton
                        size="lg"
                        className="w-full md:w-auto shrink-0"
                        onClick={() => {
                            if (selectedService) {
                                router.push(`/search?service=${selectedService}&location=${encodeURIComponent(address || '')}`);
                            } else {
                                alert("Please select a service first!");
                            }
                        }}
                    >
                        Search Now
                    </ModernButton>
                </motion.div>

                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
            </div>
        </section>
    );
}
