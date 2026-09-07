import React, { useState, useEffect } from 'react';

export default function CountdownTimer() {
  // Set target date to upcoming Christmas holiday booking kickoff
  const targetDate = new Date('2026-12-01T07:00:00-06:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // Active sessions underway
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 my-3 text-center">
      <div className="bg-holiday-pinedark/90 border border-holiday-gold/40 rounded-xl px-3 py-2 min-w-[62px] sm:min-w-[74px] shadow-lg">
        <span className="block text-xl sm:text-2xl font-extrabold text-holiday-gold font-heading leading-tight">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-medium">Days</span>
      </div>

      <span className="text-holiday-gold text-lg font-bold">:</span>

      <div className="bg-holiday-pinedark/90 border border-holiday-gold/40 rounded-xl px-3 py-2 min-w-[62px] sm:min-w-[74px] shadow-lg">
        <span className="block text-xl sm:text-2xl font-extrabold text-holiday-gold font-heading leading-tight">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-medium">Hours</span>
      </div>

      <span className="text-holiday-gold text-lg font-bold">:</span>

      <div className="bg-holiday-pinedark/90 border border-holiday-gold/40 rounded-xl px-3 py-2 min-w-[62px] sm:min-w-[74px] shadow-lg">
        <span className="block text-xl sm:text-2xl font-extrabold text-holiday-gold font-heading leading-tight">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-medium">Mins</span>
      </div>

      <span className="text-holiday-gold text-lg font-bold">:</span>

      <div className="bg-holiday-pinedark/90 border border-holiday-gold/40 rounded-xl px-3 py-2 min-w-[62px] sm:min-w-[74px] shadow-lg">
        <span className="block text-xl sm:text-2xl font-extrabold text-holiday-goldlight font-heading leading-tight">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-medium">Secs</span>
      </div>
    </div>
  );
}
