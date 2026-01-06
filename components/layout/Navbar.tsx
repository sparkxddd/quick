"use client";

import Link from 'next/link';
import { ModernButton } from '../ui/ModernButton';
import { Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
        >
            <div className="container mx-auto">
                <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                            <Wrench size={20} />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Quickfix</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="/services" className="hover:text-primary transition-colors">Services</Link>

                        <Link href="/track" className="hover:text-primary transition-colors">Track Order</Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <ModernButton variant="ghost" size="sm" className="hidden md:flex">
                            Log In
                        </ModernButton>
                        <ModernButton variant="primary" size="sm">
                            Sign Up
                        </ModernButton>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
