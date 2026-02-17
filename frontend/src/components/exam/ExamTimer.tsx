import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";

interface ExamTimerProps {
   duration: number; // in seconds
   onTimeUp: () => void;
}

export function ExamTimer({ duration, onTimeUp }: ExamTimerProps) {
   const [timeLeft, setTimeLeft] = useState(duration);

   useEffect(() => {
      if (timeLeft <= 0) {
         onTimeUp();
         return;
      }

      const timerId = setInterval(() => {
         setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerId);
   }, [timeLeft, onTimeUp]);

   const formatTime = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes
         .toString()
         .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };

   const getVariant = () => {
      if (timeLeft < 300) return "destructive"; // Last 5 mins
      if (timeLeft < 900) return "secondary"; // Last 15 mins
      return "default";
   };

   return (
      <Badge variant={getVariant()} className="text-lg px-4 py-2 flex items-center gap-2">
         <Clock className="w-4 h-4" />
         {formatTime(timeLeft)}
      </Badge>
   );
}
