"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ModernButton } from '@/components/ui/ModernButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Users, Briefcase, DollarSign, TrendingUp, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex flex-col gap-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                            <p className="text-muted-foreground">Overview of platform activity</p>
                        </div>
                        <div className="flex gap-3">
                            <ModernButton variant="outline">Export Data</ModernButton>
                            <ModernButton>Generate Report</ModernButton>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="Total Revenue"
                            value="$12,450"
                            trend="+12%"
                            icon={<DollarSign className="text-green-500" />}
                        />
                        <StatsCard
                            title="Active Jobs"
                            value="45"
                            trend="+5"
                            icon={<Briefcase className="text-blue-500" />}
                        />
                        <StatsCard
                            title="Total Users"
                            value="1,240"
                            trend="+8%"
                            icon={<Users className="text-purple-500" />}
                        />
                        <StatsCard
                            title="Growth"
                            value="15%"
                            trend="+2%"
                            icon={<TrendingUp className="text-orange-500" />}
                        />
                    </div>

                    {/* Recent Jobs Table */}
                    <GlassCard>
                        <h2 className="text-xl font-bold mb-6">Recent Job Requests</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 rounded-lg">
                                    <tr>
                                        <th className="px-6 py-3 rounded-l-lg">Job ID</th>
                                        <th className="px-6 py-3">Customer</th>
                                        <th className="px-6 py-3">Service</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3 rounded-r-lg">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <TableRow
                                        id="#JOB-1234"
                                        customer="Alice Smith"
                                        service="Plumbing"
                                        status="Completed"
                                        amount="$85.00"
                                    />
                                    <TableRow
                                        id="#JOB-1235"
                                        customer="Bob Jones"
                                        service="Electrical"
                                        status="In Progress"
                                        amount="$120.00"
                                    />
                                    <TableRow
                                        id="#JOB-1236"
                                        customer="Charlie Brown"
                                        service="Repair"
                                        status="Pending"
                                        amount="$45.00"
                                    />
                                    <TableRow
                                        id="#JOB-1237"
                                        customer="David Wilson"
                                        service="Plumbing"
                                        status="Cancelled"
                                        amount="$0.00"
                                    />
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
    return (
        <GlassCard hoverEffect className="p-6 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                <h3 className="text-2xl font-bold mb-2">{value}</h3>
                <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                    {trend} from last month
                </span>
            </div>
            <div className="p-3 bg-secondary/50 rounded-xl">
                {icon}
            </div>
        </GlassCard>
    );
}

function TableRow({ id, customer, service, status, amount }: { id: string, customer: string, service: string, status: string, amount: string }) {
    const statusStyles: Record<string, string> = {
        "Completed": "bg-green-500/10 text-green-500",
        "In Progress": "bg-blue-500/10 text-blue-500",
        "Pending": "bg-yellow-500/10 text-yellow-500",
        "Cancelled": "bg-red-500/10 text-red-500",
    };

    return (
        <tr className="border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
            <td className="px-6 py-4 font-medium">{id}</td>
            <td className="px-6 py-4">{customer}</td>
            <td className="px-6 py-4">{service}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-500"}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 font-bold">{amount}</td>
            <td className="px-6 py-4">
                <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
                    <MoreHorizontal size={16} />
                </button>
            </td>
        </tr>
    );
}
