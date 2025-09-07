import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motivationalQuotes } from "@/lib/motivationalQuotes";

export default function MotivationHeader() {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
    
    // Change quote every 30 seconds
    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[newIndex]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Developer! ☀️";
    if (hour < 17) return "Good Afternoon, Developer! 🌤️";
    if (hour < 20) return "Good Evening, Developer! 🌅";
    return "Good Night, Developer! 🌙";
  };

  return (
    <Card className="mb-6" data-testid="motivation-header">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground mb-2" data-testid="text-greeting">
            {getGreeting()}
          </div>
          <div className="text-muted-foreground italic" data-testid="text-motivational-quote">
            "{currentQuote.text}" - {currentQuote.author}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
