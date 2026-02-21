

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Rocket, Paperclip, Mic, TrendingUp, Clock, Activity } from "lucide-react";

const quickStartItems = [
  "Todo App",
  "Blog Platform",
  "CRM Dashboard",
  "E-commerce Store",
];

const stats = [
  {
    label: "TOTAL DEPLOYS",
    value: "1,248",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    label: "AVG. BUILD TIME",
    value: "2m 14s",
    icon: Clock,
    color: "text-blue-500",
  },
  {
    label: "SYSTEM UPTIME",
    value: "99.9%",
    icon: Activity,
    color: "text-purple-500",
  },
];

const HomePage = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Pipeline Status Badge */}
      <div className="flex justify-center pt-4">
        <Badge variant="secondary" className="gap-2 px-4 py-1.5">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium">PIPELINE ACTIVE</span>
        </Badge>
      </div>

      {/* Main Heading */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">
          What do you want to{" "}
          <span className="gradient-text">ship today?</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Describe your vision. Our autonomous agents will architect, build, and
          deploy your full-stack application instantly.
        </p>
      </div>

      {/* Input Card */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardContent className="p-6 space-y-4">
          <Textarea
            placeholder="E.g., Build a SaaS dashboard for tracking crypto portfolio with real-time charts and Stripe subscription integration..."
            className="min-h-[120px] resize-none border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Mic className="h-4 w-4" />
              </Button>
            </div>

            <Button className="custom-gradient text-white gap-2">
              <Rocket className="h-4 w-4" />
              Start Build
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Templates */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {quickStartItems.map((item) => (
          <Button
            key={item}
            variant="secondary"
            size="sm"
            className="rounded-full"
            onClick={() => setPrompt(`Build a ${item}`)}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;