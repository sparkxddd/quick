"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { ModernButton } from '@/components/ui/ModernButton';
import { MapPin, Phone, MessageSquare, CheckCircle, Circle } from 'lucide-react';

export default function TrackingPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Col: Status & Driver Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <GlassCard>
                            <h2 className="text-xl font-bold mb-4">Arriving in 12 mins</h2>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
                                <div className="h-full w-2/3 bg-primary animate-pulse" />
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">👷‍♂️</div>
                                <div>
                                    <h3 className="font-bold text-lg">Mike R.</h3>
                                    <p className="text-muted-foreground">Expert Plumber</p>
                                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                                        ⭐ 4.9 (124 jobs)
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <ModernButton variant="outline" className="flex-1 gap-2">
                                    <MessageSquare size={18} /> Message
                                </ModernButton>
                                <ModernButton variant="primary" className="flex-1 gap-2">
                                    <Phone size={18} /> Call
                                </ModernButton>
                            </div>
                        </GlassCard>

                        <GlassCard>
                            <h3 className="font-bold mb-4">Timeline</h3>
                            <div className="space-y-6 relative pl-4 border-l border-border ml-2">
                                <TimelineItem
                                    status="Booking Confirmed"
                                    time="10:30 AM"
                                    active
                                    completed
                                />
                                <TimelineItem
                                    status="Pro Assigned"
                                    time="10:32 AM"
                                    active
                                    completed
                                />
                                <TimelineItem
                                    status="Mike is on the way"
                                    time="10:35 AM"
                                    active
                                />
                                <TimelineItem
                                    status="Arrived at location"
                                    time="Est. 10:50 AM"
                                />
                                <TimelineItem
                                    status="Job Completed"
                                    time="-"
                                />
                            </div>
                        </GlassCard>
                    </div>

                    {/* Right Col: Map */}
                    <div className="lg:col-span-2">
                        <GlassCard className="h-[600px] w-full p-0 overflow-hidden relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {/* Mock Map */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center" />

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute" />
                                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white relative z-10" />
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg shadow-lg text-xs font-bold whitespace-nowrap">
                                        Mike is here
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-1/4 left-1/4">
                                <MapPin className="text-red-500 w-8 h-8 drop-shadow-lg" />
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ status, time, active, completed }: { status: string, time: string, active?: boolean, completed?: boolean }) {
    return (
        <div className={`relative ${active ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center ${completed ? 'bg-primary' : active ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}>
                {completed && <CheckCircle size={10} className="text-white" />}
            </div>
            <div>
                <p className="font-medium text-sm">{status}</p>
                <p className="text-xs text-muted-foreground">{time}</p>
            </div>
        </div>
    );
}
