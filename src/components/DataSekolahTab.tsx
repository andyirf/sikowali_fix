import React, { useState } from "react";
import { Building2, Camera, CheckCircle, Save, AlertCircle, X } from "lucide-react";
import { SchoolSettings, SIKOWALIDatabase } from "../types";

interface DataSekolahTabProps {
  db: SIKOWALIDatabase;
  sessionToken: string;
  onRefresh: () => Promise<void>;
}

const fallbackSchool: SchoolSettings = {
  id: "default",
  name: "SMP SIKOWALI Nusantara",
  npsn: "",
  level: "SMP/MTs",
  status: "Swasta",
  address: "",
  city: "",
  province: "",
  phone: "",
  email: "",
  website: "",
  principalName: "",
  academicYear: "2025/2026",
  semester: "Genap",
  logoUrl: "",
};

export default function DataSekolahTab({ db, sessionToken, onRefresh }: DataSekolahTabProps) {
  const [form, setForm] = useState<SchoolSettings>({ ...fallbackSchool, ...(db.schoolSettings || {}) });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const update = (key: keyof SchoolSettings, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handleLogoUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      update("logoUrl", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/school-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-token": sessionToken },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data sekolah.");
      setForm(data.settings);
      setMessage({ type: "success", text: "Data sekolah berhasil diperbarui dan tampil di semua portal." });
      await onRefresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden bg-[#125B3d] text-white rounded-2xl p-5 shadow-sm border border-emerald-900/10">
        <div className="absolute right-0 top-0 translate-x-20 -translate-y-20 bg-yellow-400/15 w-72 h-72 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-3">
          <span className="w-12 h-12 rounded-xl bg-yellow-400 text-slate-950 overflow-hidden flex items-center justify-center border border-yellow-300">
            {form.logoUrl ? (
              <img src={form.logoUrl} alt={form.name || "Logo sekolah"} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </span>
          <div>
            <p className="text-xs text-yellow-200 font-bold uppercase tracking-wide">Identitas Sekolah</p>
            <h3 className="text-xl font-black tracking-tight">{form.name || "Nama sekolah belum diisi"}</h3>
            <p className="text-xs text-emerald-50/85 mt-1">
              Data ini tersimpan di database `school_settings` dan digunakan di sidebar, header, serta panel sambutan semua role.
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`border text-xs p-3 rounded-xl flex items-center gap-2 font-bold ${
          message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <form onSubmit={submit} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nama Sekolah">
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Contoh: SMP SIKOWALI Nusantara" className="input-field" />
          </Field>
          <Field label="NPSN">
            <input value={form.npsn || ""} onChange={(e) => update("npsn", e.target.value)} placeholder="Nomor Pokok Sekolah Nasional" className="input-field" />
          </Field>
          <Field label="Jenjang">
            <input value={form.level || ""} onChange={(e) => update("level", e.target.value)} placeholder="Contoh: SMP/MTs" className="input-field" />
          </Field>
          <Field label="Status Sekolah">
            <select value={form.status || ""} onChange={(e) => update("status", e.target.value)} className="input-field">
              <option value="">Pilih status</option>
              <option value="Negeri">Negeri</option>
              <option value="Swasta">Swasta</option>
            </select>
          </Field>
          <Field label="Kota / Kabupaten">
            <input value={form.city || ""} onChange={(e) => update("city", e.target.value)} placeholder="Kota/Kabupaten" className="input-field" />
          </Field>
          <Field label="Provinsi">
            <input value={form.province || ""} onChange={(e) => update("province", e.target.value)} placeholder="Provinsi" className="input-field" />
          </Field>
          <Field label="Nomor Telepon">
            <input value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} placeholder="Nomor sekolah" className="input-field" />
          </Field>
          <Field label="Email Sekolah">
            <input value={form.email || ""} onChange={(e) => update("email", e.target.value)} placeholder="email@sekolah.sch.id" className="input-field" />
          </Field>
          <Field label="Website">
            <input value={form.website || ""} onChange={(e) => update("website", e.target.value)} placeholder="https://..." className="input-field" />
          </Field>
          <Field label="Nama Kepala Sekolah">
            <input value={form.principalName || ""} onChange={(e) => update("principalName", e.target.value)} placeholder="Nama kepala sekolah" className="input-field" />
          </Field>
          <Field label="Tahun Ajaran">
            <input value={form.academicYear || ""} onChange={(e) => update("academicYear", e.target.value)} placeholder="Contoh: 2025/2026" className="input-field" />
          </Field>
          <Field label="Semester">
            <select value={form.semester || ""} onChange={(e) => update("semester", e.target.value)} className="input-field">
              <option value="">Pilih semester</option>
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </Field>
          <Field label="Logo Sekolah" wide>
            <div className="grid gap-3 md:grid-cols-[120px_1fr]">
              <div className="w-28 h-28 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400">
                {form.logoUrl ? (
                  <img src={form.logoUrl} alt={form.name || "Logo sekolah"} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-8 h-8" />
                )}
              </div>
              <div className="space-y-2">
                <input value={form.logoUrl || ""} onChange={(e) => update("logoUrl", e.target.value)} placeholder="/uploads/files/logo.png atau https://..." className="input-field" />
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black cursor-pointer hover:bg-emerald-100">
                    <Camera className="w-4 h-4" />
                    Upload Logo
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => handleLogoUpload(e.target.files?.[0])} className="hidden" />
                  </label>
                  {form.logoUrl && (
                    <button type="button" onClick={() => update("logoUrl", "")} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-black hover:bg-slate-200">
                      <X className="w-4 h-4" />
                      Hapus Logo
                    </button>
                  )}
                </div>
                <p className="text-[10px] font-bold text-slate-400">Upload PNG, JPG, atau WebP maksimal 2MB. Logo akan tampil di login, sidebar, dan header semua role.</p>
              </div>
            </div>
          </Field>
          <Field label="Alamat Lengkap" wide>
            <textarea value={form.address || ""} onChange={(e) => update("address", e.target.value)} placeholder="Alamat lengkap sekolah" className="input-field min-h-24" />
          </Field>
        </div>

        <button disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {saving ? "Menyimpan..." : "Simpan Data Sekolah"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}
