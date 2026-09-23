import React, { useState, useEffect, useMemo } from "react";
import { 
  Calendar, Clock, Check, X, Sparkles, Sun, Sunset, Moon, 
  ArrowRight, ShieldCheck, ChevronRight
} from "lucide-react";

export const TIME_SLOTS = [
  { time: "08:00 AM", hour: 8, minute: 0, period: "Morning", periodLabel: "Morning" },
  { time: "09:00 AM", hour: 9, minute: 0, period: "Morning", periodLabel: "Morning" },
  { time: "10:00 AM", hour: 10, minute: 0, period: "Morning", periodLabel: "Morning" },
  { time: "11:00 AM", hour: 11, minute: 0, period: "Morning", periodLabel: "Morning" },
  { time: "12:00 PM", hour: 12, minute: 0, period: "Afternoon", periodLabel: "Afternoon" },
  { time: "01:00 PM", hour: 13, minute: 0, period: "Afternoon", periodLabel: "Afternoon" },
  { time: "02:00 PM", hour: 14, minute: 0, period: "Afternoon", periodLabel: "Afternoon" },
  { time: "03:00 PM", hour: 15, minute: 0, period: "Afternoon", periodLabel: "Afternoon" },
  { time: "04:00 PM", hour: 16, minute: 0, period: "Evening", periodLabel: "Evening" },
  { time: "05:00 PM", hour: 17, minute: 0, period: "Evening", periodLabel: "Evening" },
  { time: "06:00 PM", hour: 18, minute: 0, period: "Evening", periodLabel: "Evening" },
  { time: "07:00 PM", hour: 19, minute: 0, period: "Evening", periodLabel: "Evening" },
  { time: "08:00 PM", hour: 20, minute: 0, period: "Evening", periodLabel: "Night" },
  { time: "09:00 PM", hour: 21, minute: 0, period: "Evening", periodLabel: "Night" },
];

/**
 * Format slot for storage & display
 */
export function formatSlotLabel(day, timeStr) {
  if (!day || !timeStr) return "";
  if (day.isToday) return `Today, ${timeStr}`;
  if (day.isTomorrow) return `Tomorrow, ${timeStr}`;
  return `${day.fullDateStr}, ${timeStr}`;
}

/**
 * Validate if a previously stored slot is still in the future
 */
export function isSlotValid(slotString) {
  if (!slotString || typeof slotString !== "string") return false;

  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

  if (slotString.startsWith("Today,")) {
    const timePart = slotString.replace("Today,", "").trim();
    const matched = TIME_SLOTS.find(s => s.time === timePart);
    if (!matched) return false;
    return (matched.hour * 60 + matched.minute) > currentTotalMinutes;
  }

  return true;
}

export default function SlotPickerModal({ isOpen, onClose, onSelectSlot, currentSlot }) {
  // Dynamic clock state
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!isOpen) return;
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const currentTotalMinutes = useMemo(() => {
    return now.getHours() * 60 + now.getMinutes();
  }, [now]);

  const formattedCurrentTime = useMemo(() => {
    return now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }, [now]);

  // Generate 7 consecutive days
  const days = useMemo(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const isToday = i === 0;
      const isTomorrow = i === 1;

      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const label = isToday ? "Today" : isTomorrow ? "Tomorrow" : dayName;
      const dateNum = d.getDate();
      const monthStr = d.toLocaleDateString("en-US", { month: "short" });
      const fullDateStr = `${dayName}, ${dateNum} ${monthStr}`;

      let availableSlotsCount = TIME_SLOTS.length;
      if (isToday) {
        availableSlotsCount = TIME_SLOTS.filter(s => (s.hour * 60 + s.minute) > currentTotalMinutes).length;
      }

      list.push({
        index: i,
        label,
        dayName,
        dateNum,
        monthStr,
        fullDateStr,
        isToday,
        isTomorrow,
        availableSlotsCount,
        hasAvailableSlots: availableSlotsCount > 0,
      });
    }
    return list;
  }, [now, currentTotalMinutes]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [periodFilter, setPeriodFilter] = useState("ALL"); // ALL | Morning | Afternoon | Evening

  // Pre-select slot on open
  useEffect(() => {
    if (!isOpen) return;

    const todayHasSlots = days[0]?.hasAvailableSlots;
    let initialDayIndex = todayHasSlots ? 0 : 1;
    let initialTime = "";

    if (currentSlot && typeof currentSlot === "string") {
      if (currentSlot.startsWith("Today,")) {
        const t = currentSlot.replace("Today,", "").trim();
        const slotObj = TIME_SLOTS.find(s => s.time === t);
        if (slotObj && todayHasSlots && (slotObj.hour * 60 + slotObj.minute) > currentTotalMinutes) {
          initialDayIndex = 0;
          initialTime = t;
        }
      } else if (currentSlot.startsWith("Tomorrow,")) {
        const t = currentSlot.replace("Tomorrow,", "").trim();
        initialDayIndex = 1;
        initialTime = t;
      } else {
        const foundDay = days.find(d => currentSlot.includes(d.fullDateStr) || currentSlot.includes(`${d.dateNum} ${d.monthStr}`));
        if (foundDay) {
          initialDayIndex = foundDay.index;
          const matchedTime = TIME_SLOTS.find(s => currentSlot.includes(s.time));
          if (matchedTime) initialTime = matchedTime.time;
        }
      }
    }

    if (!initialTime) {
      if (initialDayIndex === 0) {
        const firstAvailable = TIME_SLOTS.find(s => (s.hour * 60 + s.minute) > currentTotalMinutes);
        initialTime = firstAvailable ? firstAvailable.time : "";
      } else {
        initialTime = "10:00 AM";
      }
    }

    setSelectedDayIndex(initialDayIndex);
    setSelectedTime(initialTime);
  }, [isOpen, currentSlot, days, currentTotalMinutes]);

  const activeDay = days[selectedDayIndex] || days[0];

  const displayedSlots = useMemo(() => {
    return TIME_SLOTS.filter(s => {
      if (periodFilter === "ALL") return true;
      if (periodFilter === "Morning") return s.period === "Morning";
      if (periodFilter === "Afternoon") return s.period === "Afternoon";
      if (periodFilter === "Evening") return s.period === "Evening";
      return true;
    });
  }, [periodFilter]);

  const handleConfirm = () => {
    if (!selectedTime || !activeDay) return;
    const finalFormatted = formatSlotLabel(activeDay, selectedTime);
    onSelectSlot(finalFormatted);
    onClose();
  };

  const getPeriodIcon = (period, isSelected) => {
    if (period === "Morning") {
      return <Sun className={`w-3.5 h-3.5 ${isSelected ? "text-amber-200" : "text-amber-500"}`} />;
    }
    if (period === "Afternoon") {
      return <Sun className={`w-3.5 h-3.5 ${isSelected ? "text-orange-200" : "text-orange-500"}`} />;
    }
    return <Sunset className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-200" : "text-purple-500"}`} />;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4 transition-all duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-[490px] rounded-t-[28px] sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden border border-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Glow Header Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-10 bg-gradient-to-b from-purple-500/15 via-indigo-500/5 to-transparent pointer-events-none blur-xl" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 leading-tight tracking-tight">
                Select Date & Time
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Verified technician arrival window
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body — Completely Hidden Scrollbars */}
        <div 
          className="px-6 py-5 overflow-y-auto space-y-5 flex-1 bg-white no-scrollbar scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          
          {/* 1. Date Selection Cards Strip */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                Select Date
              </span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                {activeDay.label}, {activeDay.dateNum} {activeDay.monthStr}
              </span>
            </div>

            {/* Horizontal Scrollable Strip with zero scrollbars */}
            <div 
              className="flex gap-2.5 overflow-x-auto pb-1 pt-1 -mx-2 px-2 snap-x no-scrollbar scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {days.map((day) => {
                const isSelected = selectedDayIndex === day.index;
                const isTodayClosed = day.isToday && !day.hasAvailableSlots;

                return (
                  <button
                    key={day.index}
                    type="button"
                    disabled={isTodayClosed}
                    onClick={() => {
                      if (isTodayClosed) return;
                      setSelectedDayIndex(day.index);
                      if (day.isToday) {
                        const currentSlotObj = TIME_SLOTS.find(s => s.time === selectedTime);
                        if (!currentSlotObj || (currentSlotObj.hour * 60 + currentSlotObj.minute) <= currentTotalMinutes) {
                          const firstValid = TIME_SLOTS.find(s => (s.hour * 60 + s.minute) > currentTotalMinutes);
                          if (firstValid) setSelectedTime(firstValid.time);
                        }
                      }
                    }}
                    className={`snap-start min-w-[92px] sm:min-w-[98px] py-3 px-2 rounded-2xl border text-center transition-all duration-200 flex-shrink-0 relative flex flex-col items-center justify-center ${
                      isTodayClosed
                        ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-50"
                        : isSelected
                        ? "border-transparent bg-gradient-to-b from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/25 ring-2 ring-purple-400/40 scale-[1.02]"
                        : "border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-purple-300 text-slate-700 hover:shadow-2xs cursor-pointer"
                    }`}
                  >
                    <span className={`text-[10px] uppercase tracking-wider font-extrabold block ${
                      isSelected ? "text-purple-200" : isTodayClosed ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {day.label}
                    </span>

                    <span className={`text-xl font-black mt-0.5 tracking-tight ${
                      isSelected ? "text-white" : isTodayClosed ? "text-slate-400" : "text-slate-900"
                    }`}>
                      {day.dateNum}
                    </span>

                    <span className={`text-[11px] font-medium block ${
                      isSelected ? "text-purple-100" : isTodayClosed ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {day.monthStr}
                    </span>

                    {/* Micro Tag Status */}
                    {day.isToday && (
                      <span className={`mt-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isTodayClosed
                          ? "bg-slate-200 text-slate-500"
                          : isSelected
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {isTodayClosed ? "Closed" : `${day.availableSlotsCount} Left`}
                      </span>
                    )}

                    {!day.isToday && (
                      <span className={`mt-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isSelected ? "bg-white/20 text-white" : "text-slate-400"
                      }`}>
                        Available
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Sleek Real-Time Status Pill for Today */}
          {activeDay.isToday && (
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50 border border-purple-100/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                </span>
                <span className="font-semibold text-slate-800">
                  Live Clock: <span className="font-extrabold text-purple-900">{formattedCurrentTime}</span>
                </span>
              </div>
              <span className="text-[11px] font-medium text-purple-700 bg-white/80 px-2 py-0.5 rounded-md shadow-2xs border border-purple-100">
                Next slots open
              </span>
            </div>
          )}

          {/* 3. Refined Segmented Control Filter Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                Select Start Time
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {[
                { id: "ALL", label: "All Slots", icon: <Sparkles className="w-3 h-3 text-purple-600" /> },
                { id: "Morning", label: "Morning", icon: <Sun className="w-3 h-3 text-amber-500" /> },
                { id: "Afternoon", label: "Afternoon", icon: <Sun className="w-3 h-3 text-orange-500" /> },
                { id: "Evening", label: "Evening", icon: <Sunset className="w-3 h-3 text-indigo-500" /> },
              ].map((tab) => {
                const isActive = periodFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPeriodFilter(tab.id)}
                    className={`py-1.5 px-1 rounded-lg transition-all text-center flex items-center justify-center gap-1 font-bold truncate ${
                      isActive
                        ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-900/5 font-extrabold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Designer-Grade Time Slots Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {displayedSlots.map((slot) => {
              const slotMinutes = slot.hour * 60 + slot.minute;
              const isPast = activeDay.isToday && slotMinutes <= currentTotalMinutes;
              const isSelected = selectedTime === slot.time && !isPast;

              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={isPast}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-150 relative flex flex-col justify-between ${
                    isPast
                      ? "border-slate-100 bg-slate-50/60 text-slate-300 cursor-not-allowed select-none opacity-45"
                      : isSelected
                      ? "border-transparent bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400/50 scale-[1.02]"
                      : "border-slate-200/90 bg-white text-slate-800 hover:border-purple-400 hover:bg-purple-50/30 cursor-pointer active:scale-95 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center">
                      {getPeriodIcon(slot.period, isSelected)}
                    </div>

                    {isPast ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-200/80 text-slate-400">
                        Past
                      </span>
                    ) : isSelected ? (
                      <span className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-slate-400">
                        {slot.periodLabel}
                      </span>
                    )}
                  </div>

                  <div>
                    <p className={`font-extrabold text-xs sm:text-sm tracking-tight ${
                      isSelected ? "text-white" : isPast ? "text-slate-400 line-through" : "text-slate-900"
                    }`}>
                      {slot.time}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {displayedSlots.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs font-medium">
              No time slots in this filter.
            </div>
          )}

        </div>

        {/* Modal Sticky Footer Bar */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Selected Window
            </span>
            <p className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              {selectedTime ? (
                <span>{formatSlotLabel(activeDay, selectedTime)}</span>
              ) : (
                <span className="text-slate-400 font-normal text-xs">Choose a slot above</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedTime || (activeDay.isToday && !activeDay.hasAvailableSlots)}
              className={`flex-1 sm:flex-initial py-2.5 px-5 font-bold rounded-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md ${
                selectedTime
                  ? "bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer active:scale-98 shadow-purple-500/25"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>Confirm Slot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
