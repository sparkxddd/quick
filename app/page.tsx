"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/ui/Hero";
import { GlassCard } from "@/components/ui/GlassCard";
import { Wrench, Zap, Hammer, Star, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <Hero />

      {/* Services Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Top Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional services tailored to your needs. High quality, verified experts, and satisfaction guaranteed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Wrench className="w-8 h-8 text-blue-500" />}
              title="Plumbing"
              desc="Leak repairs, pipe fitting, and more."
              delay={0.1}
            />
            <ServiceCard
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              title="Electrical"
              desc="Wiring, switch repairs, and installation."
              delay={0.2}
            />
            <ServiceCard
              icon={<Hammer className="w-8 h-8 text-orange-500" />}
              title="Repairs"
              desc="Furniture assembly and general fixes."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <TrustItem
              icon={<Star className="w-10 h-10 text-yellow-400" />}
              title="Top Rated Pros"
              desc="All workers are verified and rated 4.5+"
              delay={0.1}
            />
            <TrustItem
              icon={<Clock className="w-10 h-10 text-blue-400" />}
              title="Instant Booking"
              desc="Get help in as little as 30 minutes."
              delay={0.2}
            />
            <TrustItem
              icon={<ShieldCheck className="w-10 h-10 text-green-400" />}
              title="Quality Guarantee"
              desc="Service warranty on all repairs."
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <Link href={`/book?service=${title.toLowerCase()}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
      >
        <GlassCard hoverEffect className="h-full flex flex-col items-start gap-4 p-8 bg-card/50">
          <div className="p-3 bg-white shadow-sm rounded-xl dark:bg-slate-800">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{desc}</p>
          </div>
          <div className="mt-auto flex items-center text-primary font-semibold text-sm group">
            Book Now <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
}

function TrustItem({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex flex-col items-center gap-4"
    >
      <div className="p-4 bg-background rounded-full shadow-lg mb-2">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </motion.div>
  );
}
