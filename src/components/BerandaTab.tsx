import React from "react";
import { Sparkles, TrendingDown, BookOpen, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { SIKOWALIDatabase, Role } from "../types";

interface BerandaTabProps {
  db: SIKOWALIDatabase;
  setTab: (tab: string) => void;
  role: Role;
}

export default function BerandaTab({ db, setTab, role }: BerandaTabProps) {
  // Compute key states dynamically so edits reflect immediately
  const { student, scores, attendance } = db;
  const user = db.currentUser;
  const parentName = user?.name || student.parentName || "Orang Tua";

  // Overall academic averages
  const avgScore = scores.length > 0
    ? parseFloat((scores.reduce((acc, curr) => acc + curr.rataRata, 0) / scores.length).toFixed(1))
    : 0;

  // Weighted attendance
  const totalHadir = attendance.reduce((acc, curr) => acc + curr.hadir, 0);
  const totalDays = attendance.reduce((acc, curr) => acc + curr.hadir + curr.sakit + curr.izin + curr.alpha, 0);
  const attendancePercentage = totalDays > 0 ? Math.round((totalHadir / totalDays) * 100) : 0;

  // Subjects needing attention (score below average/KKM)
  const alertSubjects = scores.filter(s => s.rataRata < s.kkm);

  const scopedStudents = db.visibleStudents || [student];
  const unreadCount = (db.notifications || []).filter((item) => !item.isRead).length;
  const latestNotifications = (db.notifications || []).slice(0, 3);
  const topAnnouncement = db.announcements?.[0];
  const attentionSubjectNames = alertSubjects.map((item) => item.subject).join(", ");

  return (
    <div className="space-y-6 animate-fade-in">
      {role === "orangtua" && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="portal-soft-card p-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Orang Tua</p>
            <p className="text-base font-black text-slate-900 mt-1">{parentName}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.email || user?.phone || "Kontak belum diisi"}</p>
          </div>
          <div className="portal-soft-card p-4 md:col-span-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Anak Terhubung</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {scopedStudents.map((item) => (
                <span key={item.id} className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold">
                  {item.name} <span className="text-emerald-600">({item.className})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Student Profile & Overview Box layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 portal-soft-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 text-slate-100 flex items-center justify-center font-bold text-lg rounded-xl shadow-inner">
                AB
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{student.name}</h3>
                <p className="text-xs text-slate-500">Kelas: {student.className} • NIS: {student.nis}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span id="overall-average-rating" className="text-2xl font-black text-emerald-500 leading-none">{avgScore}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">RATA-RATA NILAI</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Rerata Nilai</span>
              <p className="text-lg font-bold text-slate-800">{avgScore}</p>
            </div>
            <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Kehadiran</span>
              <p className="text-lg font-bold text-slate-800">{attendancePercentage}%</p>
            </div>
            <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Notifikasi Baru</span>
              <p className="text-lg font-bold text-slate-800 text-orange-600">{unreadCount} Belum dibaca</p>
            </div>
            <div className="space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold">Perlu Perhatian</span>
              <p className="text-lg font-bold text-red-600">{alertSubjects.length} Mapel</p>
            </div>
          </div>
        </div>

        {/* School Agenda Box widget */}
        <div className="portal-soft-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">AGENDA SEKOLAH</h4>
              <Calendar className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <div className="flex gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <div>
                  <p className="font-semibold text-slate-700">{topAnnouncement?.title || "Belum ada agenda baru"}</p>
                  <p className="text-[10px] text-slate-400">{topAnnouncement?.date || "-"}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                <div>
                  <p className="font-semibold text-slate-700">{db.announcements?.[1]?.title || "Agenda sekolah berikutnya"}</p>
                  <p className="text-[10px] text-slate-400">{db.announcements?.[1]?.date || "-"}</p>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => setTab("pengumuman")} className="w-full flex items-center justify-between mt-4 text-xs font-semibold text-emerald-600 border border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/10 px-3 py-2 rounded-xl transition-all">
            Semua Pengumuman
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      { (role === "Admin" || role === "Administrator" || role === "Guru" || role === "kepalasekolah") && (
        <div className="portal-soft-card rounded-2xl p-5">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Daftar Murid</h3>
          <ul className="list-disc list-inside space-y-1 text-slate-800">
            {scopedStudents.map(s => (
              <li key={s.id}>{s.name} - {s.className} (NIS: {s.nis})</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main charts and alerts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal ratings representation */}
        <div className="portal-soft-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Perkembangan Nilai Mata Pelajaran</h3>
            <button onClick={() => setTab("rapor")} className="text-xs font-semibold text-emerald-600 hover:underline">
              Semua Nilai
            </button>
          </div>
          <div className="space-y-3.5">
            {scores.map((s) => {
              const isLow = s.rataRata < s.kkm;
              return (
                <div key={s.subject} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{s.subject}</span>
                    <span className={`font-semibold ${isLow ? "text-red-500" : "text-emerald-500"}`}>
                      {s.rataRata} <span className="text-[10px] text-slate-400 font-normal">(KKM {s.kkm})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isLow ? "bg-red-500" : "bg-emerald-500"}`}
                      style={{ width: `${s.rataRata}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Notification Streams card */}
        <div className="portal-soft-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Aktivitas & Notifikasi Terbaru</h3>
            <button onClick={() => setTab("notifikasi")} className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline">
              Tandai dibaca
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {latestNotifications.map((item) => (
              <div key={item.id} className="py-2.5 flex items-start gap-3">
                <span className={`p-1.5 rounded-lg shrink-0 ${item.type === "urgent" ? "bg-red-50 text-red-600" : item.type === "warning" ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}>
                  {item.type === "info" ? <BookOpen className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-700">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.description}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block ${item.type === "urgent" ? "text-red-600 bg-red-50" : item.type === "warning" ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"}`}>{item.isRead ? "Dibaca" : "Baru"}</span>
                </div>
              </div>
            ))}
            {latestNotifications.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400 font-semibold">Belum ada notifikasi baru.</div>
            )}
          </div>
        </div>
      </div>

      {/* SIKOWALI AI Interactive Alert Toaster Banner */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 bg-emerald-500/10 w-44 h-44 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500 rounded-xl text-slate-950 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-400 tracking-wider uppercase">PERINGATAN SIKOWALI AI</h4>
            <p className="text-sm font-bold text-slate-100">{alertSubjects.length > 0 ? `${student.name} perlu pendampingan pada ${attentionSubjectNames}.` : `${student.name} berada dalam kondisi akademik stabil.`}</p>
            <p className="text-xs text-slate-300">
              {alertSubjects.length > 0 ? "Analisis AI menyarankan pendampingan belajar terarah berdasarkan nilai yang masih di bawah KKM." : "Pantau terus nilai, absensi, dan catatan perilaku agar perkembangan tetap terukur."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <button 
            onClick={() => setTab("analisisAI")} 
            className="flex-1 md:flex-none text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all px-4 py-2 rounded-xl text-center cursor-pointer"
          >
            Lihat Analisis Lengkap
          </button>
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 md:flex-none text-xs font-bold border border-slate-700 hover:bg-slate-800 hover:border-slate-500 transition-all px-4 py-2 rounded-xl text-center cursor-pointer text-slate-200"
          >
            Hubungi Guru (WhatsApp)
          </a>
        </div>
      </div>
    </div>
  );
}
