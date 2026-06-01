import React, { useState } from "react";
import { SIKOWALIDatabase, Announcement } from "../types";
import { ImagePlus, Pin, Volume2, Plus, X, Calendar, User } from "lucide-react";

interface PengumumanTabProps {
  db: SIKOWALIDatabase;
  onAddAnnouncement: (ann: Omit<Announcement, "id" | "date">) => Promise<void>;
  role: string;
}

export default function PengumumanTab({ db, onAddAnnouncement, role }: PengumumanTabProps) {
  const { announcements } = db;
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Akademik");
  const [isImportant, setIsImportant] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const categories = ["Semua", "Akademik", "Umum", "Kesiswaan"];

  // Filtered lists
  const filteredList = announcements.filter((ann) => {
    if (activeCategory === "Semua") return true;
    return ann.category === activeCategory;
  });

  const handleImageUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await onAddAnnouncement({
      title,
      content,
      isImportant,
      category,
      imageUrl,
      author: role === "orangtua" ? "Budi S. (Orang Tua)" : `Staf ${role}`
    });

    setTitle("");
    setContent("");
    setImageUrl("");
    setIsImportant(false);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in select-none">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Volume2 className="w-5 h-5 text-emerald-500 animate-pulse" />
            Pengumuman Resmi Sekolah
          </h3>
          <p className="text-xs text-slate-500">Pusat informasi agenda kelas, kegiatan siswa-siswi, dan libur akademik.</p>
        </div>
        {role !== "orangtua" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all text-xs px-3.5 py-2 rounded-xl h-9 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Buat Pengumuman
          </button>
        )}
      </div>

      {/* Creation form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tulis Pengumuman Baru</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">Judul Pengumuman</label>
              <input
                type="text"
                required
                placeholder="misal: Jadwal Pembagian Rapor Ganjil"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase block">Kategori Informasi</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="Akademik">Akademik</option>
                <option value="Umum">Umum</option>
                <option value="Kesiswaan">Kesiswaan</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Rincian / Isi Pengumuman</label>
            <textarea
              required
              rows={4}
              placeholder="Tuliskan isi pengumuman secara gamblang..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase block">Upload Foto Pengumuman</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                <ImagePlus className="w-4 h-4 text-emerald-500" />
                Pilih Foto
                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => handleImageUpload(e.target.files?.[0])} className="hidden" />
              </label>
              {imageUrl && (
                <button type="button" onClick={() => setImageUrl("")} className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  Hapus Foto
                </button>
              )}
            </div>
            {imageUrl && <img src={imageUrl} alt="Preview pengumuman" className="w-full max-h-56 object-cover rounded-xl border border-slate-200" />}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is-important-checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="is-important-checkbox" className="text-xs text-slate-500 font-semibold cursor-pointer">
              Tandai sebagai Pengumuman Penting (Pin di bagian atas)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-100 text-xs font-semibold"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-slate-50 hover:bg-slate-800 rounded-xl text-xs font-bold"
            >
              Publikasikan Pengumuman
            </button>
          </div>
        </form>
      )}

      {/* Category selector chips */}
      <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-slate-900 text-slate-100"
                : "bg-slate-100/60 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcement feed */}
      <div className="space-y-4">
        {filteredList.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white border rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:scale-[1.005] ${
              ann.isImportant ? "border-amber-200 bg-amber-500/[0.01]" : "border-slate-100"
            }`}
          >
            {/* Announcement top line info */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-2">
                {ann.isImportant && (
                  <span className="p-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                    <Pin className="w-3.5 h-3.5 fill-amber-500" />
                  </span>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{ann.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">{ann.category}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                ann.isImportant ? "bg-amber-100/60 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                {ann.isImportant ? "Penting" : "Umum"}
              </span>
            </div>

            {/* Content description */}
            {ann.imageUrl && (
              <img src={ann.imageUrl} alt={ann.title} className="w-full max-h-72 object-cover rounded-xl border border-slate-100" />
            )}
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {ann.content}
            </p>

            {/* Footer metrics log */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Diterbitkan pada {ann.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Oleh: {ann.author}
              </span>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-medium bg-white border border-slate-100 rounded-2xl">
            Belum ada pengumuman bertema ini.
          </div>
        )}
      </div>
    </div>
  );
}
