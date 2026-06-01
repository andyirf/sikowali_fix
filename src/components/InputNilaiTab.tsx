import React, { useEffect, useState } from "react";
import { SIKOWALIDatabase, SubjectScore } from "../types";
import { Search, Save, CheckCircle } from "lucide-react";

interface InputNilaiTabProps {
  db: SIKOWALIDatabase;
  onUpdateScores: (scores: SubjectScore[]) => Promise<void>;
  onSelectStudent?: (studentId: string) => Promise<void>;
}

export default function InputNilaiTab({ db, onUpdateScores, onSelectStudent }: InputNilaiTabProps) {
  const [localScores, setLocalScores] = useState<SubjectScore[]>(db.scores);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredScores = localScores.filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setLocalScores(db.scores);
  }, [db.student.id, db.scores]);

  const handleScoreChange = (subjectName: string, field: keyof SubjectScore, rawValue: string) => {
    const value = Math.max(0, Math.min(100, parseInt(rawValue) || 0));
    const updated = localScores.map((s) => {
      if (s.subject === subjectName) {
        const nextScore = { ...s, [field]: value };
        // Compute new rataRata
        const avg = Math.round((nextScore.tugas + nextScore.uh1 + nextScore.uh2 + nextScore.uts + nextScore.uas) / 5);
        return { ...nextScore, rataRata: avg };
      }
      return s;
    });
    setLocalScores(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await onUpdateScores(localScores);
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
          <h3 className="text-sm font-bold text-slate-900">Input Nilai & Evaluasi (Hak Akses Guru)</h3>
          <p className="text-xs text-slate-500">Pilih murid dari database, lalu sunting nilai sesuai data murid yang aktif.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-50 transition-all text-xs px-4 py-2 rounded-xl h-9 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-xl flex items-center gap-2.5 animate-slide-up">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <p className="font-bold">Berhasil! Seluruh data nilai siswa berhasil disimpan dan disinkronkan ke portal utama.</p>
        </div>
      )}

      {/* Inputs grid table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-2">
            <span className="text-xs font-semibold text-slate-600 bg-slate-50 border px-3 py-1.5 rounded-xl">
              Kelas: {db.student.className}
            </span>
            {(db.visibleStudents || []).length > 1 ? (
              <select
                value={db.student.id}
                onChange={(e) => onSelectStudent?.(e.target.value)}
                className="text-xs font-semibold text-slate-600 bg-slate-50 border px-3 py-1.5 rounded-xl"
              >
                {(db.visibleStudents || []).map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
              </select>
            ) : (
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 border px-3 py-1.5 rounded-xl">
                Siswa: {db.student.name}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari mapel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="px-5 py-3.5">Mata Pelajaran</th>
                <th className="px-5 py-3.5 text-center w-24">Tugas</th>
                <th className="px-5 py-3.5 text-center w-24">UH 1</th>
                <th className="px-5 py-3.5 text-center w-24">UH 2</th>
                <th className="px-5 py-3.5 text-center w-24">UTS</th>
                <th className="px-5 py-3.5 text-center w-24">UAS</th>
                <th className="px-5 py-3.5 text-center w-28">Rata-rata Terhitung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScores.map((score, idx) => (
                <tr key={score.subject} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-bold text-slate-800">{score.subject}</td>
                  <td className="px-5 py-3.5 text-center">
                    <input
                      type="number"
                      value={score.tugas}
                      onChange={(e) => handleScoreChange(score.subject, "tugas", e.target.value)}
                      className="w-16 bg-slate-50 focus:bg-white border focus:ring-1 focus:ring-emerald-500 px-2 py-1.5 rounded-lg text-xs font-semibold text-center focus:outline-none"
                    />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <input
                      type="number"
                      value={score.uh1}
                      onChange={(e) => handleScoreChange(score.subject, "uh1", e.target.value)}
                      className="w-16 bg-slate-50 focus:bg-white border focus:ring-1 focus:ring-emerald-500 px-2 py-1.5 rounded-lg text-xs font-semibold text-center focus:outline-none"
                    />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <input
                      type="number"
                      value={score.uh2}
                      onChange={(e) => handleScoreChange(score.subject, "uh2", e.target.value)}
                      className="w-16 bg-slate-50 focus:bg-white border focus:ring-1 focus:ring-emerald-500 px-2 py-1.5 rounded-lg text-xs font-semibold text-center focus:outline-none"
                    />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <input
                      type="number"
                      value={score.uts}
                      onChange={(e) => handleScoreChange(score.subject, "uts", e.target.value)}
                      className="w-16 bg-slate-50 focus:bg-white border focus:ring-1 focus:ring-emerald-500 px-2 py-1.5 rounded-lg text-xs font-semibold text-center focus:outline-none"
                    />
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <input
                      type="number"
                      value={score.uas}
                      onChange={(e) => handleScoreChange(score.subject, "uas", e.target.value)}
                      className="w-16 bg-slate-50 focus:bg-white border focus:ring-1 focus:ring-emerald-500 px-2 py-1.5 rounded-lg text-xs font-semibold text-center focus:outline-none"
                    />
                  </td>
                  <td className="px-5 py-3.5 text-center bg-slate-50/20">
                    <span id={`average-${score.subject}`} className={`text-xs font-black py-0.5 px-2.5 rounded-full border ${
                      score.rataRata < score.kkm 
                        ? "bg-red-50 text-red-600 border-red-200" 
                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}>
                      {score.rataRata} {score.rataRata < score.kkm ? "• < KKM" : "• Aman"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
