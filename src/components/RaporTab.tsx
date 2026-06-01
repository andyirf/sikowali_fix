import React, { useState } from "react";
import { Search, Info, TrendingUp, AlertTriangle } from "lucide-react";
import { SIKOWALIDatabase } from "../types";

interface RaporTabProps {
  db: SIKOWALIDatabase;
}

export default function RaporTab({ db }: RaporTabProps) {
  const { scores } = db;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScores = scores.filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const testPassCount = scores.filter((s) => s.rataRata >= s.kkm).length;
  const maxScore = scores.length > 0 ? Math.max(...scores.map((s) => s.rataRata)) : 0;
  const needAttentionCount = scores.length - testPassCount;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Nilai Tertinggi</span>
          <p className="text-2xl font-black text-emerald-500">{maxScore}</p>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Lulus KKM</span>
          <p className="text-2xl font-black text-slate-800">{testPassCount} / {scores.length}</p>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Perlu Perbaikan</span>
          <p className="text-2xl font-black text-red-500">{needAttentionCount}</p>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Rata-Rata</span>
          <p className="text-2xl font-black text-emerald-500">
            {(scores.reduce((acc, curr) => acc + curr.rataRata, 0) / (scores.length || 1)).toFixed(1)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
          <h3 className="text-sm font-bold text-slate-900">Rincian Lengkap Capaian Nilai</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari mata pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full sm:w-60"
            />
          </div>
        </div>

        {/* Grades detail table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="px-4 py-3">Mata Pelajaran</th>
                <th className="px-4 py-3 text-center">KKM</th>
                <th className="px-4 py-3 text-center">Tugas</th>
                <th className="px-4 py-3 text-center">UH 1</th>
                <th className="px-4 py-3 text-center">UH 2</th>
                <th className="px-4 py-3 text-center">UTS</th>
                <th className="px-4 py-3 text-center">UAS</th>
                <th className="px-4 py-3 text-center">Rata-Rata</th>
                <th className="px-4 py-3 text-center">Status Kelulusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScores.map((score) => {
                const isFailed = score.rataRata < score.kkm;
                return (
                  <tr key={score.subject} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{score.subject}</td>
                    <td className="px-4 py-3 text-center font-medium bg-slate-50/20">{score.kkm}</td>
                    <td className="px-4 py-3 text-center">{score.tugas}</td>
                    <td className="px-4 py-3 text-center">{score.uh1}</td>
                    <td className="px-4 py-3 text-center">{score.uh2}</td>
                    <td className="px-4 py-3 text-center">{score.uts}</td>
                    <td className="px-4 py-3 text-center">{score.uas}</td>
                    <td className="px-4 py-3 text-center font-bold bg-slate-50/10 text-slate-900">{score.rataRata}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isFailed 
                          ? "bg-red-50 text-red-600 border border-red-200/50" 
                          : "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                      }`}>
                        {isFailed ? "Perlu Perbaikan" : "Lolos"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredScores.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                    Tidak menemukan mata pelajaran matching.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Important Info Card at bottom */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3.5 items-start mt-2">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Perhitungan nilai rata-rata bersumber dari formulasi: <strong>(Rata-rata Tugas + UH1 + UH2 + UTS + UAS) / 5</strong>. 
            Informasi nilai bersifat valid dan ter-sinkronisasi langsung dengan Sistem Pengisian Rapor Kurikulum SIKOWALI.
          </p>
        </div>
      </div>
    </div>
  );
}
