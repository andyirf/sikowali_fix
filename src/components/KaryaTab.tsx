import React, { useState } from "react";
import { SIKOWALIDatabase } from "../types";
import { Image, MessageSquare, Heart, Bookmark, Upload, Plus, ChevronRight, Send, User } from "lucide-react";

interface KaryaTabProps {
  db: SIKOWALIDatabase;
  onAddComment: (karyaId: string, text: string) => Promise<void>;
  onAddKarya: (payload: { title: string; category: string; description: string; imageUrl: string }) => Promise<void>;
  role: string;
}

export default function KaryaTab({ db, onAddComment, onAddKarya, role }: KaryaTabProps) {
  const { karya } = db;
  const readOnly = role === "orangtua" || role === "kepalasekolah";
  const [activeKaryaIdForComment, setActiveKaryaIdForComment] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");
  
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Sains");
  const [newImgUrl, setNewImgUrl] = useState("");

  const handleCommentSubmit = async (karyaId: string) => {
    if (!commentInput.trim()) return;
    await onAddComment(karyaId, commentInput);
    setCommentInput("");
  };

  const handleUploadKarya = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    await onAddKarya({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      imageUrl: newImgUrl.trim(),
    });
    setNewTitle("");
    setNewDesc("");
    setNewImgUrl("");
    setShowUploadForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Portofolio & Karya Ahmad</h3>
          <p className="text-xs text-slate-500">
            {readOnly
              ? "Mode baca: dokumentasi dapat dilihat tanpa menambah unggahan atau komentar."
              : "Kumpulan tugas akhir, penilaian praktikum, dan foto kejuaraan berprestasi."}
          </p>
        </div>
        {!readOnly && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all text-xs px-3.5 py-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Tambah Karya Baru
          </button>
        )}
      </div>

      {/* Upload layout form */}
      {showUploadForm && !readOnly && (
        <form onSubmit={handleUploadKarya} className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4 animate-fade-in">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Unggah Dokumentasi Hasil Belajar</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Nama Dokumentasi / Judul</label>
              <input
                type="text"
                required
                placeholder="misal: Praktek Melukis Kanvas"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Kategori</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Sains">Sains / IPA</option>
                <option value="Seni Rupa">Seni Rupa</option>
                <option value="Sastra">Sastra & Bahasa</option>
                <option value="Sosial">Sosial / IPS</option>
                <option value="Olahraga">Olahraga / PJOK</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">Deskripsi Kegiatan</label>
            <textarea
              required
              rows={3}
              placeholder="Tuliskan detail pencapaian atau aktivitas yang didokumentasikan..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-bold uppercase">URL Gambar / Foto (Opsional)</label>
            <input
              type="url"
              placeholder="Berikan link Unsplan/poto sekolah jika ada"
              value={newImgUrl}
              onChange={(e) => setNewImgUrl(e.target.value)}
              className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowUploadForm(false)}
              className="text-xs text-slate-500 font-semibold px-4 py-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="text-xs font-bold bg-slate-900 text-slate-100 hover:bg-slate-800 transition-all px-4 py-2 rounded-xl"
            >
              Simpan Karya
            </button>
          </div>
        </form>
      )}

      {/* Grid gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {karya.map((item) => (
          <div key={item.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              {/* Cover photo */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  referrerPolicy="no-referrer"
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover select-none"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* Cover text */}
              <div className="p-5 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>Siswa: {db.student.name}</span>
                  <span>{item.date}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Comment Section Footer layout */}
            <div className="border-t border-slate-50 bg-slate-50/20 p-4">
              <button
                onClick={() => setActiveKaryaIdForComment(activeKaryaIdForComment === item.id ? null : item.id)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-medium cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Komentar ({item.comments.length})</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeKaryaIdForComment === item.id ? "rotate-90" : ""}`} />
              </button>

              {activeKaryaIdForComment === item.id && (
                <div className="mt-3.5 space-y-3.5 border-t border-slate-100/80 pt-3">
                  {/* List of comments */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {item.comments.map((comm, idx) => (
                      <div key={idx} className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100/50 flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {comm.author[0]}
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <p className="text-[10px] font-bold text-slate-600 flex justify-between">
                            <span>{comm.author}</span>
                            <span className="font-normal text-slate-400">{comm.date}</span>
                          </p>
                          <p className="text-xs text-slate-600 leading-normal">{comm.text}</p>
                        </div>
                      </div>
                    ))}
                    {item.comments.length === 0 && (
                      <p className="text-center text-[10px] text-slate-400 py-2">Belum ada komentar. Berikan ulasan apresiatif Anda!</p>
                    )}
                  </div>

                  {!readOnly ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tulis pujian atau komentar bimbingan..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => handleCommentSubmit(item.id)}
                        className="p-1.5 bg-slate-900 text-slate-50 hover:bg-slate-800 rounded-xl transition-all font-semibold"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 text-slate-500 rounded-xl px-3 py-2 text-[11px] font-semibold">
                      Role ini hanya dapat melihat dokumentasi dan komentar yang sudah tersedia.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
