import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Filter,
  Download,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { SchoolEvent } from '../data/schoolData';

interface AcademicCalendarProps {
  events: SchoolEvent[];
  lang: 'en' | 'am';
}

export const AcademicCalendar: React.FC<AcademicCalendarProps> = ({ events, lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [remindedEvents, setRemindedEvents] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'upcoming' | 'all'>('upcoming');

  const categories = [
    { id: 'all', labelEn: 'All Events', labelAm: 'ሁሉም ኩነቶች' },
    { id: 'Exam', labelEn: 'Exams & ESSLCE', labelAm: 'ፈተናዎች' },
    { id: 'Holiday', labelEn: 'National Holidays', labelAm: 'የበዓላት እረፍት' },
    { id: 'Academic', labelEn: 'Academic Milestones', labelAm: 'የትምህርት መርሃ-ግብር' },
    { id: 'PTA', labelEn: 'PTA & Parents', labelAm: 'የወላጆች ህብረት' },
    { id: 'Sports', labelEn: 'Athletics & Sports', labelAm: 'ስፖርት' },
    { id: 'Club', labelEn: 'Clubs & STEM', labelAm: 'ክበባት' }
  ];

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesGrade = selectedGrade === 'all' || ev.targetGrades.includes(selectedGrade);
    return matchesCategory && matchesGrade;
  });

  const toggleReminder = (id: string) => {
    setRemindedEvents((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const downloadICS = (ev: SchoolEvent) => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hailemariam Mamo Secondary School//Debre Berhan//EN
BEGIN:VEVENT
SUMMARY:${ev.title}
DESCRIPTION:${ev.description}
LOCATION:${ev.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ev.id}-hailemariam-mamo.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Calendar Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {lang === 'am' ? 'የትምህርት ቤት ዓመታዊ መቁጠሪያና ኩነቶች' : 'Academic Event Calendar & Key Dates'}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {lang === 'am'
                ? '2017 ዓ.ም የኢትዮጵያ የትምህርት ዘመን • ፈተናዎች፣ የብሄራዊ በዓላት ቀናት እና የተማሪዎች መርሃ-ግብር'
                : 'Ethiopian Academic Year 2017 E.C. (2024/2025) • Examination schedules, holidays, and campus events'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Academic Year 2017 E.C.</span>
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="pt-5 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {lang === 'am' ? c.labelAm : c.labelEn}
              </button>
            ))}
          </div>

          {/* Grade Level Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Filter Grade:</span>
            <select
              value={String(selectedGrade)}
              onChange={(e) =>
                setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Grades (9-12)</option>
              <option value="9">Grade 9 Only</option>
              <option value="10">Grade 10 Only</option>
              <option value="11">Grade 11 Only</option>
              <option value="12">Grade 12 Only (ESSLCE)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Feed / List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-700">No events found for this filter combination.</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting &quot;All Events&quot; or resetting the grade filter.</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isReminded = remindedEvents[ev.id];
            return (
              <div
                key={ev.id}
                className={`bg-white rounded-2xl p-5 md:p-6 border transition-all hover:shadow-md ${
                  ev.isImportant
                    ? 'border-emerald-300 ring-1 ring-emerald-200/60 bg-gradient-to-r from-emerald-50/30 via-white to-white'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Date Stamp & Main Info */}
                  <div className="flex items-start space-x-4">
                    {/* Date Block */}
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-sm border border-slate-800">
                      <span className="text-[10px] md:text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {new Date(ev.date).toLocaleString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-xl md:text-2xl font-black font-mono leading-tight">
                        {new Date(ev.date).getDate()}
                      </span>
                      <span className="text-[9px] text-slate-400 leading-none">
                        {new Date(ev.date).getFullYear()}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            ev.category === 'Exam'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : ev.category === 'Holiday'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : ev.category === 'Sports'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {ev.category}
                        </span>

                        {/* Ethiopian Calendar Badge */}
                        <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                          🇪🇹 {ev.ethiopianDate}
                        </span>

                        {ev.isImportant && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            High Priority
                          </span>
                        )}
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-slate-900">
                        {lang === 'am' ? ev.titleAmharic : ev.title}
                      </h3>
                      {lang === 'am' && (
                        <p className="text-xs text-slate-500 font-medium">{ev.title}</p>
                      )}

                      <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
                        {lang === 'am' ? ev.descriptionAmharic : ev.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{ev.time}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{ev.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          Target: {ev.targetGrades.length === 4 ? 'All Secondary (9-12)' : `Grades ${ev.targetGrades.join(', ')}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Remind Me & Export to Calendar */}
                  <div className="flex md:flex-col items-center gap-2 pt-2 md:pt-0 self-end md:self-start flex-shrink-0">
                    <button
                      onClick={() => toggleReminder(ev.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isReminded
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Set alert notification"
                    >
                      {isReminded ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                      <span>{isReminded ? 'Reminder Set' : 'Remind Me'}</span>
                    </button>

                    <button
                      onClick={() => downloadICS(ev)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                      title="Download calendar event file (.ics)"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Export (.ics)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Notice about Ethiopian MoE Academic Terms */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block mb-1">
            Official Ethiopian Ministry of Education School Calendar Regulations
          </strong>
          <p>
            Examinations and holidays strictly adhere to the North Shewa Zone Education Bureau and Federal Ministry of Education guidelines. Semester 1 concludes in January/Tir, followed by a 1-week break. Semester 2 runs from Yekatit to Sene with the Grade 12 National University Entrance Examination (ESSLCE) administered in late Sene/Hamle.
          </p>
        </div>
      </div>
    </div>
  );
};
