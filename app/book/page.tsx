"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ModernButton } from '@/components/ui/ModernButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowLeft, Calendar, Clock, Upload, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function BookingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const serviceType = searchParams.get('service') || 'General Request';
    const providerName = searchParams.get('provider') || '';
    const priceStr = searchParams.get('price') || '0';
    const location = searchParams.get('location') || ''; // Add address param

    const [step, setStep] = useState(1);
    const [bookingType, setBookingType] = useState<'instant' | 'scheduled'>('instant');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const payload = {
                service_type: serviceType,
                provider_name: providerName || undefined,
                address_text: location || "User's current location",
                description: description,
                price: parseFloat(priceStr),
                type: bookingType
            };

            console.log("Attempting booking to: http://10.0.2.2:3001/api/bookings");
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch('http://10.0.2.2:3001/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response && response.ok) {
                const data = await response.json();
                console.log("Booking success:", data);
                alert("Booking confirmed! Redirecting to tracking...");
                router.push('/tracking');
            } else {
                const errorText = await response.text();
                throw new Error(`Server returned ${response.status}: ${errorText}`);
            }

        } catch (error: any) {
            console.error("Booking Error Details:", error);
            const errorMsg = error.message || JSON.stringify(error) || 'Unknown error';
            alert(`Error creating booking: ${errorMsg}\n\nMake sure the backend is running on port 3001.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <ModernButton
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent hover:text-primary gap-2"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={20} /> Back
                </ModernButton>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-6">Book {serviceType}</h1>

                            {/* Progress */}
                            <div className="flex items-center gap-4 mb-8 text-sm font-medium text-muted-foreground">
                                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : ''}`}>
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${step >= 1 ? 'border-primary bg-primary/10' : 'border-border'}`}>1</span>
                                    Details
                                </div>
                                <div className="h-[2px] w-12 bg-border" />
                                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : ''}`}>
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${step >= 2 ? 'border-primary bg-primary/10' : 'border-border'}`}>2</span>
                                    Schedule
                                </div>
                                <div className="h-[2px] w-12 bg-border" />
                                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : ''}`}>
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center border ${step >= 3 ? 'border-primary bg-primary/10' : 'border-border'}`}>3</span>
                                    Confirm
                                </div>
                            </div>
                        </div>

                        <GlassCard className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Describe the issue</label>
                                <textarea
                                    className="w-full min-h-[120px] rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                    placeholder="e.g. My kitchen sink is leaking..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Add Photos/Video (Optional)</label>
                                <div className="border-2 border-dashed border-input rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/5 transition-colors cursor-pointer">
                                    <Upload size={32} className="mb-2" />
                                    <span>Click to upload</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    className={`relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${bookingType === 'instant' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:bg-accent/5'}`}
                                    onClick={() => setBookingType('instant')}
                                >
                                    <div className={`mt-1 ${bookingType === 'instant' ? 'text-primary' : 'text-muted-foreground'}`}>
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Instant Service</div>
                                        <div className="text-sm text-muted-foreground">Arrives in ~30 mins</div>
                                    </div>
                                </div>
                                <div
                                    className={`relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${bookingType === 'scheduled' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input hover:bg-accent/5'}`}
                                    onClick={() => setBookingType('scheduled')}
                                >
                                    <div className={`mt-1 ${bookingType === 'scheduled' ? 'text-primary' : 'text-muted-foreground'}`}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <div className="font-semibold">Schedule for Later</div>
                                        <div className="text-sm text-muted-foreground">Choose date & time</div>
                                    </div>
                                </div>
                            </div>

                            <ModernButton size="lg" className="w-full" onClick={handleConfirm} disabled={loading}>
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </ModernButton>
                        </GlassCard>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <GlassCard className="sticky top-24 space-y-4">
                            <h3 className="font-semibold text-lg">Booking Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Service</span>
                                    <span className="font-medium">{serviceType} {providerName && `(by ${providerName})`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Base Rate</span>
                                    <span className="font-medium">${priceStr}/hr</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Est. Time</span>
                                    <span className="font-medium">1 Hour</span>
                                </div>
                            </div>
                            <div className="h-[1px] bg-border my-4" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Est. Total</span>
                                <span>${priceStr}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                                *Final price may vary based on actual work required.
                            </p>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BookingContent />
        </Suspense>
    );
}
