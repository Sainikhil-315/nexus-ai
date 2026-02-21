"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Github, Boxes } from "lucide-react";
import { useState } from "react";

export function Hero() {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-background to-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-primary/10 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="px-4 py-1.5 gap-2 border-primary/20">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm">AI-Powered Backend Builder</span>
          </Badge>

          {/* Main heading with gradient */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
            What will you{" "}
            <span className="gradient-text inline-block">
              ship
            </span>{" "}
            today?
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Create production-ready backends and deploy instantly by chatting with AI.
            No setup, no configuration—just describe and deploy.
          </p>

          {/* Input section */}
          <div className="w-full max-w-3xl">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-primary/50 via-primary/30 to-primary/50 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
              <div className="relative bg-card border border-border rounded-2xl p-2 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Let's build a REST API for a task manager with authentication..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="border-0 bg-background/50 backdrop-blur h-12 text-base focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                  <Button 
                    size="lg" 
                    className="custom-gradient text-white hover:opacity-90 transition-opacity h-12 px-6 gap-2 font-semibold"
                  >
                    Build now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick start options */}
            <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <span>or start from</span>
              <Button variant="outline" size="sm" className="gap-2 h-8">
                <Github className="h-3.5 w-3.5" />
                GitHub
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-8">
                <Boxes className="h-3.5 w-3.5" />
                Template
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
}