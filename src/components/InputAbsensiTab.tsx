import React, { useEffect, useMemo, useState } from "react";
import { AttendanceStatus, SIKOWALIDatabase } from "../types";
import { AlertTriangle, CalendarDays, CheckCircle, FileText, Save, Thermometer, UserCheck } from "lucide-react";

interface InputAbsensiTabProps {
  db: SIKOWALIDatabase;
  onUpdateAttendanceDay: (payload: { date: string; status: AttendanceStatus; note?: string }) => Promise<void>;
  onSelectStudent?: (studentId: string) => Promise<void>;
}

const statusOptions: {
  value: AttendanceStatus;
  label: string;
  icon: React.ElementType;
  className: string;
}[] = [
  { value: "hadir", label: "Hadir", icon: UserCheck, className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { value: "sakit", label: "Sakit", icon: Thermometer, className: "border-amber-200 bg-amber-50 text-amber-700" },
  { value: "izin", label: "Izin", icon: FileText, className: "border-sky-200 bg-sky-50 text-sky-700" },
  { value: "alpha", label: "Alpha", icon: AlertTriangle, className: "border-rose-200 bg-rose-50 text-rose-700" },
];

const statusLabels: Record<AttendanceStatus, string> = {
  hadir: "Hadir",
  sakit: "Sakit",
  izin: "Izin",
  alpha: "Alpha",
};

const statusBadge: Record<AttendanceStatus, string> = {
  hadir: "bg-emerald-50 text-emerald-700 border-emerald-200",
  sakit: "bg-amber-50 text-amber-700 border-amber-200",
  izin: "bg-sky-50 text-sky-700 border-sky-200",
  alpha: "bg-rose-50 text-rose-700 border-rose-200",
};

function todayISO() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().split("T")[0];
}

function monthName(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", { month: "long" });
}

function displayDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InputAbsensiTab({ db, onUpdateAttendanceDay, onSelectStudent }: InputAbsensiTabProps) {
  const [date, setDate] = useState(todayISO());
  const [status, setStatus] = useState<AttendanceStatus>("hadir");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const dailyRecords = useMemo(() => {
    return (db.attendanceDaily || [])
      .filter((record) => record.studentId === db.student.id)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [db.attendanceDaily, db.student.id]);

  const selectedDateRecord = dailyRecords.find((record) => record.date === date);
  const selectedMonth = monthName(date);
  const selectedMonthRecords = dailyRecords.filter((record) => monthName(record.date).toLowerCase() === selectedMonth.toLowerCase());
  const monthRecap = db.attendance.find((record) => record.month.toLowerCase() === selectedMonth.toLowerCase());

  useEffect(() => {
    if (selectedDateRecord) {
      setStatus(selectedDateRecord.status);
      setNote(selectedDateRecord.note || "");
    } else {
      setStatus("hadir");
      setNote("");
    }
  }, [db.student.id, selectedDateRecord?.date, selectedDateRecord?.status, selectedDateRecord?.note]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await onUpdateAttendanceDay({ date, status, note });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in select-none">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Input Absensi Harian (Hak Akses Guru)</h3>
          <p className="text-xs text-slate-500">Pilih murid dan tanggal, lalu simpan status kehadiran per hari.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-50 transition-all text-xs px-4 py-2 rounded-xl h-9 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {saving ? "Menyimpan..." : "Simpan Absensi"}
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl flex items-center gap-2.5">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <p className="font-bold">Berhasil! Absensi harian tersimpan dan rekap bulanan diperbarui otomatis.</p>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-600 bg-slate-50 border px-3 py-1.5 rounded-xl">Kelas: {db.student.className}</span>
            {(db.visibleStudents || []).length > 1 ? (
              <select
                value={db.student.id}
                onChange={(e) => onSelectStudent?.(e.target.value)}
                className="text-xs font-semibold text-slate-600 bg-slate-50 border px-3 py-1.5 rounded-xl"
              >
                {(db.visibleStudents || []).map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
              </select>
            ) : (
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 border px-3 py-1.5 rounded-xl">Siswa: {db.student.name}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <CalendarDays className="w-4 h-4" />
            Absensi Perhari
          </div>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-4">
          <label className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:ring-1 focus:ring-emerald-500 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            />
          </label>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status Kehadiran</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const active = status === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value)}
                    className={`h-12 rounded-xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                      active ? option.className : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <label className="block space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Catatan Opsional</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={255}
            placeholder="Contoh: surat sakit diterima, izin keluarga, atau keterangan lain."
            className="w-full resize-none bg-slate-50 focus:bg-white border border-slate-200 focus:ring-1 focus:ring-emerald-500 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          />
        </label>

        <div className="grid sm:grid-cols-5 gap-2">
          {statusOptions.map((option) => {
            const total = selectedMonthRecords.filter((record) => record.status === option.value).length;
            return (
              <div key={option.value} className={`rounded-xl border p-3 ${option.className}`}>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{option.label}</p>
                <p className="text-2xl font-black">{total}</p>
              </div>
            );
          })}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Persentase</p>
            <p className="text-2xl font-black">{monthRecap?.persentase ?? 0}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Riwayat Absensi Harian {selectedMonth}</h4>
          <span className="text-xs font-semibold text-slate-600 bg-slate-50 border px-3 py-1.5 rounded-xl">{selectedMonthRecords.length} hari tercatat</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Tanggal</th>
                <th className="px-5 py-3.5 w-32">Status</th>
                <th className="px-5 py-3.5">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedMonthRecords.length ? selectedMonthRecords.map((record) => (
                <tr key={`${record.studentId}-${record.date}`} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-bold text-slate-800">{displayDate(record.date)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center border rounded-full px-2.5 py-1 text-[11px] font-black ${statusBadge[record.status]}`}>
                      {statusLabels[record.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-semibold">{record.note || "-"}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-slate-400 font-bold">
                    Belum ada absensi harian pada bulan ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
