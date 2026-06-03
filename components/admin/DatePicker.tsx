"use client";

import { useState, useRef, useEffect } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DatePicker({ value, onChange, disabled, placeholder = "Select date" }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // View date represents the month/year currently being viewed in the calendar
  const initialDate = value ? new Date(value) : new Date();
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMode, setViewMode] = useState<"date" | "year">("date");
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update view when value changes externally
  useEffect(() => {
    if (value && !isOpen) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewMonth(d.getMonth());
        setViewYear(d.getFullYear());
      }
    }
  }, [value, isOpen]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleNextMonth = () => {
    if (viewMode === "year") {
      setViewYear(y => y + 12);
    } else {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear(y => y + 1);
      } else {
        setViewMonth(m => m + 1);
      }
    }
  };

  const handlePrevMonth = () => {
    if (viewMode === "year") {
      setViewYear(y => y - 12);
    } else {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear(y => y - 1);
      } else {
        setViewMonth(m => m - 1);
      }
    }
  };

  const handleSelectDate = (day: number) => {
    const paddedMonth = (viewMonth + 1).toString().padStart(2, "0");
    const paddedDay = day.toString().padStart(2, "0");
    onChange(`${viewYear}-${paddedMonth}-${paddedDay}`);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  
  // Format display value
  let displayValue = "";
  if (value) {
    const [y, m, d] = value.split("-");
    if (y && m && d) {
      const monthName = MONTHS[parseInt(m, 10) - 1]?.slice(0, 3) || "";
      displayValue = `${monthName} ${parseInt(d, 10)}, ${y}`;
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-900 outline-none min-h-[38px] flex items-center justify-between transition-colors ${
          disabled 
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
            : "bg-white border-gray-200 hover:border-gray-300 text-gray-900"
        }`}
      >
        <span className={displayValue ? "text-gray-900" : "text-gray-400"}>
          {displayValue || placeholder}
        </span>
        <FiCalendar className={`w-4 h-4 ${disabled ? "text-gray-300" : "text-gray-400"}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-medium text-sm text-gray-900 flex items-center justify-center gap-1">
              {viewMode === "date" ? (
                <>
                  <span>{MONTHS[viewMonth]}</span>
                  <button
                    type="button"
                    onClick={() => setViewMode("year")}
                    className="hover:bg-gray-100 px-1.5 py-0.5 rounded transition-colors"
                  >
                    {viewYear}
                  </button>
                </>
              ) : (
                <span>
                  {Math.floor(viewYear / 12) * 12} - {Math.floor(viewYear / 12) * 12 + 11}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {viewMode === "date" ? (
            <>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider py-1">
                    {d}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for offset */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                
                {/* Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const paddedMonth = (viewMonth + 1).toString().padStart(2, "0");
                  const paddedDay = day.toString().padStart(2, "0");
                  const dateStr = `${viewYear}-${paddedMonth}-${paddedDay}`;
                  const isSelected = value === dateStr;
                  
                  const isToday = new Date().toISOString().split("T")[0] === dateStr;
                  
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDate(day)}
                      className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full text-xs transition-colors ${
                        isSelected 
                          ? "bg-gray-900 text-white font-medium shadow-sm" 
                          : isToday
                            ? "bg-gray-100 text-gray-900 font-medium hover:bg-gray-200"
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const yearStart = Math.floor(viewYear / 12) * 12;
                const year = yearStart + i;
                const isSelected = viewYear === year;
                
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => {
                      setViewYear(year);
                      setViewMode("date");
                    }}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                      isSelected 
                        ? "bg-gray-900 text-white shadow-sm" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
