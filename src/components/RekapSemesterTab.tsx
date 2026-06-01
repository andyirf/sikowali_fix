import React, { useEffect, useMemo, useState } from "react";
import { Award, CalendarDays, Download, FileText, Printer, RefreshCw, UserRound, UsersRound } from "lucide-react";
import { AttendanceRecord, BehaviourLog, SIKOWALIDatabase, Student, SubjectScore } from "../types";

interface RekapSemesterTabProps {
  db: SIKOWALIDatabase;
  sessionToken: string;
  onSelectStudent?: (studentId: string) => Promise<void>;
}

interface ClassReportItem {
  student: Student;
  scores: SubjectScore[];
  attendance: AttendanceRecord[];
  behaviour: BehaviourLog[];
}

const SEMESTER_MONTHS = {
  Ganjil: ["Juli", "Agustus", "September", "Oktober", "November", "Desember"],
  Genap: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
};

function normalizeSemester(value?: string) {
  return value?.toLowerCase() === "ganjil" ? "Ganjil" : "Genap";
}

function monthName(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", { month: "long" });
}

function isBehaviourInSemester(item: BehaviourLog, semester: "Ganjil" | "Genap") {
  const date = new Date(`${item.date}T00:00:00`);
  if (Number.isNaN(date.getTime())) return true;
  return SEMESTER_MONTHS[semester].includes(monthName(item.date));
}

function printPdf() {
  window.print();
}

function summarizeAttendance(attendance: AttendanceRecord[], semester: "Ganjil" | "Genap") {
  const semesterMonths = SEMESTER_MONTHS[semester];
  const rows = attendance.filter((item) => semesterMonths.includes(item.month));
  const total = rows.reduce(
    (acc, item) => ({
      hadir: acc.hadir + item.hadir,
      sakit: acc.sakit + item.sakit,
      izin: acc.izin + item.izin,
      alpha: acc.alpha + item.alpha,
    }),
    { hadir: 0, sakit: 0, izin: 0, alpha: 0 }
  );
  const days = total.hadir + total.sakit + total.izin + total.alpha;
  return { rows, ...total, totalDays: days, percent: days > 0 ? Math.round((total.hadir / days) * 100) : 0 };
}

function averageScore(scores: SubjectScore[]) {
  return scores.length ? Math.round(scores.reduce((sum, item) => sum + item.rataRata, 0) / scores.length) : 0;
}

export default function RekapSemesterTab({ db, sessionToken, onSelectStudent }: RekapSemesterTabProps) {
  const [semester, setSemester] = useState<"Ganjil" | "Genap">(() => normalizeSemester(db.schoolSettings?.semester));
  const [mode, setMode] = useState<"student" | "class">("student");
  const [classReports, setClassReports] = useState<ClassReportItem[]>([]);
  const [loadingClass, setLoadingClass] = useState(false);
  const academicYear = db.schoolSettings?.academicYear || "2025/2026";
  const semesterMonths = SEMESTER_MONTHS[semester];
  const attendanceData = summarizeAttendance(db.attendance, semester);
  const semesterAttendance = attendanceData.rows;
  const behaviour = db.behaviour.filter((item) => isBehaviourInSemester(item, semester));
  const studentAverageScore = averageScore(db.scores);
  const belowKkm = db.scores.filter((item) => item.rataRata < item.kkm);
  const attendanceSummary = attendanceData;
  const totalAttendance = attendanceData.totalDays;
  const attendancePercent = attendanceData.percent;

  const loadClassReports = async () => {
    setLoadingClass(true);
    try {
      const params = new URLSearchParams();
      if (db.selectedClassName) params.set("className", db.selectedClassName);
      const res = await fetch(`/api/class-semester-report?${params.toString()}`, {
        headers: sessionToken ? { "x-session-token": sessionToken } : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setClassReports(data.reports || []);
    } finally {
      setLoadingClass(false);
    }
  };

  useEffect(() => {
    if (mode === "class") loadClassReports();
  }, [mode, db.selectedClassName]);

  const classSummary = useMemo(() => {
    const rows = classReports.map((item) => {
      const avg = averageScore(item.scores);
      const abs = summarizeAttendance(item.attendance, semester);
      const below = item.scores.filter((score) => score.rataRata < score.kkm).length;
      const notes = item.behaviour.filter((note) => isBehaviourInSemester(note, semester)).length;
      return { ...item, avg, abs, below, notes };
    });
    const classAverage = rows.length ? Math.round(rows.reduce((sum, item) => sum + item.avg, 0) / rows.length) : 0;
    const classAttendance = rows.length ? Math.round(rows.reduce((sum, item) => sum + item.abs.percent, 0) / rows.length) : 0;
    return { rows, classAverage, classAttendance };
  }, [classReports, semester]);

  const conclusion = useMemo(() => {
    if (belowKkm.length > 0 || attendancePercent < 90) {
      return "Perlu pendampingan lanjutan dari wali kelas dan orang tua agar perkembangan akademik dan kehadiran siswa lebih stabil pada semester berikutnya.";
    }
    return "Perkembangan siswa pada semester ini tergolong baik. Pertahankan konsistensi belajar, kehadiran, dan kebiasaan positif yang sudah terbentuk.";
  }, [belowKkm.length, attendancePercent]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="print:hidden bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Rekap Semester</h3>
            <p className="text-xs text-slate-500 mt-1">Ringkasan nilai, absensi, dan catatan perilaku siswa aktif untuk arsip wali kelas.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="inline-flex h-10 bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button type="button" onClick={() => setMode("student")} className={`px-3 rounded-lg text-xs font-black ${mode === "student" ? "bg-slate-900 text-white" : "text-slate-500"}`}>Per Murid</button>
              <button type="button" onClick={() => setMode("class")} className={`px-3 rounded-lg text-xs font-black ${mode === "class" ? "bg-slate-900 text-white" : "text-slate-500"}`}>Satu Kelas</button>
            </div>
            {(db.visibleStudents || []).length > 1 && (
              <select
                value={db.student.id}
                onChange={(e) => onSelectStudent?.(e.target.value)}
                className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {(db.visibleStudents || []).map((student) => (
                  <option key={student.id} value={student.id}>{student.name} - {student.className}</option>
                ))}
              </select>
            )}
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value as "Ganjil" | "Genap")}
              className="h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Ganjil">Semester Ganjil</option>
              <option value="Genap">Semester Genap</option>
            </select>
            <button onClick={printPdf} className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400">
              <Download className="w-4 h-4" />
              Backup PDF
            </button>
          </div>
        </div>
      </div>

      <section className="semester-print-area bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-4">
            {db.schoolSettings?.logoUrl ? (
              <img src={db.schoolSettings.logoUrl} alt="Logo sekolah" className="w-16 h-16 object-contain rounded-xl border border-slate-100" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-black">SK</div>
            )}
            <div>
              <h1 className="text-lg font-black text-slate-900">{db.schoolSettings?.name || "SIKOWALI"}</h1>
              <p className="text-xs font-semibold text-slate-500">{db.schoolSettings?.address || "Alamat sekolah belum diisi"}</p>
              <p className="text-xs font-semibold text-slate-500">{db.schoolSettings?.phone || "-"} • {db.schoolSettings?.email || "-"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Backup Rekap Semester {mode === "class" ? "Kelas" : "Siswa"}</p>
            <p className="text-sm font-black text-slate-900">Semester {semester}</p>
            <p className="text-xs font-bold text-slate-500">Tahun Ajaran {academicYear}</p>
          </div>
        </div>

        {mode === "class" ? (
          <ClassReportView
            db={db}
            semester={semester}
            loading={loadingClass}
            onReload={loadClassReports}
            rows={classSummary.rows}
            classAverage={classSummary.classAverage}
            classAttendance={classSummary.classAttendance}
          />
        ) : (
          <>
        <div className="grid md:grid-cols-4 gap-3">
          <SummaryBox icon={<UserRound className="w-4 h-4" />} label="Siswa" value={db.student.name} detail={`NIS: ${db.student.nis}`} />
          <SummaryBox icon={<CalendarDays className="w-4 h-4" />} label="Kelas" value={db.student.className} detail={semesterMonths.join(", ")} />
          <SummaryBox icon={<Award className="w-4 h-4" />} label="Rata-rata Nilai" value={`${studentAverageScore}`} detail={belowKkm.length ? `${belowKkm.length} mapel di bawah KKM` : "Semua mapel aman"} />
          <SummaryBox icon={<FileText className="w-4 h-4" />} label="Kehadiran" value={`${attendancePercent}%`} detail={`${attendanceSummary.hadir}/${totalAttendance || 0} hari hadir`} />
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-900">Rekap Nilai Mata Pelajaran</h2>
          <Table>
            <thead>
              <tr>
                <Th>Mata Pelajaran</Th>
                <Th align="center">KKM</Th>
                <Th align="center">Tugas</Th>
                <Th align="center">UH 1</Th>
                <Th align="center">UH 2</Th>
                <Th align="center">UTS</Th>
                <Th align="center">UAS</Th>
                <Th align="center">Rata-rata</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {db.scores.map((score) => (
                <tr key={score.subject}>
                  <Td strong>{score.subject}</Td>
                  <Td align="center">{score.kkm}</Td>
                  <Td align="center">{score.tugas}</Td>
                  <Td align="center">{score.uh1}</Td>
                  <Td align="center">{score.uh2}</Td>
                  <Td align="center">{score.uts}</Td>
                  <Td align="center">{score.uas}</Td>
                  <Td align="center" strong>{score.rataRata}</Td>
                  <Td>{score.rataRata < score.kkm ? "Perlu Pendampingan" : "Tuntas"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-900">Rekap Absensi Semester</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <MiniStat label="Hadir" value={`${attendanceSummary.hadir} hari`} />
            <MiniStat label="Sakit" value={`${attendanceSummary.sakit} hari`} />
            <MiniStat label="Izin" value={`${attendanceSummary.izin} hari`} />
            <MiniStat label="Alpha" value={`${attendanceSummary.alpha} hari`} />
            <MiniStat label="Persentase" value={`${attendancePercent}%`} />
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Bulan</Th>
                <Th align="center">Hadir</Th>
                <Th align="center">Sakit</Th>
                <Th align="center">Izin</Th>
                <Th align="center">Alpha</Th>
                <Th align="center">Kehadiran</Th>
              </tr>
            </thead>
            <tbody>
              {semesterAttendance.length ? semesterAttendance.map((item) => (
                <tr key={item.month}>
                  <Td strong>{item.month}</Td>
                  <Td align="center">{item.hadir}</Td>
                  <Td align="center">{item.sakit}</Td>
                  <Td align="center">{item.izin}</Td>
                  <Td align="center">{item.alpha}</Td>
                  <Td align="center" strong>{item.persentase}%</Td>
                </tr>
              )) : (
                <tr><Td colSpan={6}>Belum ada data absensi pada semester ini.</Td></tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-900">Catatan Perilaku & Prestasi</h2>
          <Table>
            <thead>
              <tr>
                <Th>Tanggal</Th>
                <Th>Jenis</Th>
                <Th>Judul</Th>
                <Th>Pelapor</Th>
                <Th>Deskripsi</Th>
              </tr>
            </thead>
            <tbody>
              {behaviour.length ? behaviour.map((item) => (
                <tr key={item.id}>
                  <Td>{item.date}</Td>
                  <Td>{item.type}</Td>
                  <Td strong>{item.title}</Td>
                  <Td>{item.teacher}</Td>
                  <Td>{item.description}</Td>
                </tr>
              )) : (
                <tr><Td colSpan={5}>Belum ada catatan perilaku pada semester ini.</Td></tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kesimpulan Wali Kelas</p>
            <p className="text-xs leading-relaxed text-slate-700 mt-2">{conclusion}</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 min-h-28">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tanda Tangan</p>
            <div className="mt-10 grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <p>Wali Kelas,</p>
                <p className="mt-10 font-bold">{db.currentUser?.name || "Guru"}</p>
              </div>
              <div>
                <p>Kepala Sekolah,</p>
                <p className="mt-10 font-bold">{db.schoolSettings?.principalName || "-"}</p>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        <button onClick={printPdf} className="print:hidden fixed bottom-6 right-6 inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-black shadow-lg hover:bg-slate-800">
          <Printer className="w-4 h-4" />
          Cetak PDF
        </button>
      </section>
    </div>
  );
}

function ClassReportView({ db, semester, loading, onReload, rows, classAverage, classAttendance }: { db: SIKOWALIDatabase; semester: "Ganjil" | "Genap"; loading: boolean; onReload: () => void; rows: Array<ClassReportItem & { avg: number; abs: ReturnType<typeof summarizeAttendance>; below: number; notes: number }>; classAverage: number; classAttendance: number }) {
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-3">
        <SummaryBox icon={<UsersRound className="w-4 h-4" />} label="Kelas" value={db.selectedClassName || db.student.className} detail={`${rows.length} siswa tercatat`} />
        <SummaryBox icon={<Award className="w-4 h-4" />} label="Rata-rata Kelas" value={`${classAverage}`} detail={`Semester ${semester}`} />
        <SummaryBox icon={<FileText className="w-4 h-4" />} label="Kehadiran Kelas" value={`${classAttendance}%`} detail="Rata-rata presensi siswa" />
        <div className="print:hidden border border-slate-200 rounded-xl p-3 flex items-center justify-center">
          <button onClick={onReload} disabled={loading} className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-black disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Muat Data Kelas
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-sm font-black text-slate-900">Rekap Satu Kelas</h2>
        <Table>
          <thead>
            <tr>
              <Th>Nama Siswa</Th>
              <Th>NIS</Th>
              <Th align="center">Rata-rata Nilai</Th>
              <Th align="center">Mapel di Bawah KKM</Th>
              <Th align="center">Hadir</Th>
              <Th align="center">Sakit</Th>
              <Th align="center">Izin</Th>
              <Th align="center">Alpha</Th>
              <Th align="center">Kehadiran</Th>
              <Th align="center">Catatan</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={10}>Memuat data rekap kelas...</Td></tr>
            ) : rows.length ? rows.map((item) => (
              <tr key={item.student.id}>
                <Td strong>{item.student.name}</Td>
                <Td>{item.student.nis}</Td>
                <Td align="center" strong>{item.avg}</Td>
                <Td align="center">{item.below}</Td>
                <Td align="center">{item.abs.hadir}</Td>
                <Td align="center">{item.abs.sakit}</Td>
                <Td align="center">{item.abs.izin}</Td>
                <Td align="center">{item.abs.alpha}</Td>
                <Td align="center" strong>{item.abs.percent}%</Td>
                <Td align="center">{item.notes}</Td>
              </tr>
            )) : (
              <tr><Td colSpan={10}>Belum ada data siswa untuk kelas ini.</Td></tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

function SummaryBox({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="border border-slate-200 rounded-xl p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-black text-slate-900 mt-2">{value}</p>
      <p className="text-[10px] font-semibold text-slate-500 mt-1">{detail}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-slate-200 bg-slate-50 rounded-xl p-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-sm font-black text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return <table className="w-full text-left text-xs border-collapse border border-slate-200">{children}</table>;
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "center" }) {
  return <th className={`border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ${align === "center" ? "text-center" : "text-left"}`}>{children}</th>;
}

function Td({ children, align = "left", strong = false, colSpan }: { children: React.ReactNode; align?: "left" | "center"; strong?: boolean; colSpan?: number }) {
  return <td colSpan={colSpan} className={`border border-slate-200 px-3 py-2 text-slate-700 ${align === "center" ? "text-center" : "text-left"} ${strong ? "font-bold text-slate-900" : "font-medium"}`}>{children}</td>;
}
