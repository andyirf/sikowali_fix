import React, { useState } from "react";
import { Mail, Phone, Shield, User, Users, GraduationCap, MapPin, BadgeCheck, Save, CheckCircle, AlertCircle, Camera, Eye, EyeOff } from "lucide-react";
import { Role, SIKOWALIDatabase } from "../types";

interface ProfilTabProps {
  db: SIKOWALIDatabase;
  role: Role;
  sessionToken?: string;
  onRefresh?: () => Promise<void>;
}

const roleLabel: Record<Role, string> = {
  orangtua: "Orang Tua",
  Guru: "Guru",
  kepalasekolah: "Kepala Sekolah",
  Admin: "Admin",
  Administrator: "Administrator",
  Murid: "Murid",
};

export default function ProfilTab({ db, role, sessionToken, onRefresh }: ProfilTabProps) {
  const user = db.currentUser;
  const teacher = db.teachers?.find((item) => item.userId === user?.id);
  const student = role === "Murid"
    ? db.student
    : role === "orangtua"
      ? db.visibleStudents?.[0] || db.student
      : db.student;

  const displayName = user?.name || (role === "Murid" ? student.name : roleLabel[role]);
  const initials = displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    photoUrl: user?.photoUrl || "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const connectedChildren = db.visibleStudents || [];

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-token": sessionToken || "" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan profil.");
      setMessage({ type: "success", text: "Profil berhasil diperbarui dan disinkronkan ke database." });
      setForm({ ...form, password: "" });
      setShowPassword(false);
      await onRefresh?.();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, photoUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const details = [
    { label: "Username", value: user?.username || "-", icon: <User className="w-4 h-4" /> },
    { label: "Role", value: roleLabel[role], icon: <Shield className="w-4 h-4" /> },
    { label: "Email", value: user?.email || teacher?.email || "-", icon: <Mail className="w-4 h-4" /> },
    { label: "Nomor Kontak", value: user?.phone || teacher?.phone || "-", icon: <Phone className="w-4 h-4" /> },
  ];

  const roleDetails =
    role === "Guru" && teacher
      ? [
          { label: "Nama Guru", value: teacher.name },
          { label: "Kelas Wali", value: teacher.className },
          { label: "Jabatan", value: teacher.position },
          { label: "Nomor Induk Guru", value: teacher.teacherNumber },
          { label: "Lulusan", value: teacher.graduate },
          { label: "Alamat", value: teacher.address },
        ]
      : role === "kepalasekolah" && teacher
        ? [
            { label: "Nama", value: teacher.name },
            { label: "Jabatan", value: teacher.position },
            { label: "Nomor Induk", value: teacher.teacherNumber },
            { label: "Lulusan", value: teacher.graduate },
            { label: "Alamat", value: teacher.address },
          ]
        : role === "orangtua"
          ? [
              { label: "Anak Terhubung", value: (db.visibleStudents || []).map((item) => item.name).join(", ") || "-" },
              { label: "Kelas Anak", value: (db.visibleStudents || []).map((item) => item.className).join(", ") || "-" },
              { label: "Nama Orang Tua di Data Murid", value: student.parentName || displayName },
            ]
          : role === "Murid"
            ? [
                { label: "Nama Murid", value: student.name },
                { label: "NIS", value: student.nis },
                { label: "Kelas", value: student.className },
                { label: "Nama Orang Tua", value: student.parentName || "-" },
              ]
            : [
                { label: "Hak Akses", value: "Manajemen user, guru, murid, dan data sekolah" },
                { label: "Jumlah User", value: String(db.users?.length || 0) },
                { label: "Jumlah Guru", value: String(db.teachers?.length || 0) },
                { label: "Jumlah Murid", value: String(db.students?.length || 0) },
              ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-5">
        <div className="absolute right-0 top-0 translate-x-14 -translate-y-20 bg-emerald-500/20 w-80 h-80 rounded-full blur-3xl pointer-events-none" />
        <div className="w-20 h-20 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-inner overflow-hidden">
          {form.photoUrl || user?.photoUrl ? (
            <img src={form.photoUrl || user?.photoUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : initials}
        </div>
        <div className="flex-1 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-black text-white">{displayName}</h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-white/10 text-emerald-200 border border-white/10 px-2 py-1 rounded-lg">
              <BadgeCheck className="w-3 h-3" />
              {roleLabel[role]}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-semibold">
            {role === "orangtua" ? `Terhubung dengan ${connectedChildren.length} anak di portal SIKOWALI.` : "Profil disesuaikan otomatis dengan akun login dan role portal."}
          </p>
        </div>
      </div>

      {role === "orangtua" && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="portal-soft-card p-4">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Orang Tua</p>
            <p className="text-base font-black text-slate-900 mt-1">{displayName}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.email || user?.phone || "Kontak belum diisi"}</p>
          </div>
          <div className="portal-soft-card p-4 md:col-span-2">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Anak Yang Terkoneksi</p>
            <div className="mt-2 grid sm:grid-cols-2 gap-2">
              {connectedChildren.map((child) => (
                <div key={child.id} className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                  <p className="text-sm font-black text-slate-900">{child.name}</p>
                  <p className="text-xs font-bold text-emerald-700 mt-1">{child.className} • NIS {child.nis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={submitProfile} className="portal-soft-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-black text-slate-900">Edit Profil {roleLabel[role]}</h4>
            <p className="text-xs text-slate-500">Data profil dan foto user tersimpan ke tabel users.</p>
          </div>
          <Save className="w-4 h-4 text-emerald-600" />
        </div>
        {message && (
          <div className={`border text-xs p-3 rounded-xl flex items-center gap-2 font-bold ${
            message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}
        <div className="grid sm:grid-cols-[160px_1fr] gap-4">
          <div className="space-y-2">
            <div className="w-28 h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-black">
              {form.photoUrl ? <img src={form.photoUrl} alt="Foto profil" className="w-full h-full object-cover" /> : initials}
            </div>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black cursor-pointer hover:bg-emerald-100">
              <Camera className="w-4 h-4" />
              Upload Foto
              <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e.target.files?.[0])} className="hidden" />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={`Nama ${roleLabel[role]}`} className="input-field" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="input-field" />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Nomor kontak" className="input-field" />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password baru, kosongkan jika tidak diubah" className="input-field pr-10" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100" aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        <button disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-50 hover:bg-slate-800">
          <Save className="w-4 h-4" />
          {saving ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map((item) => (
          <div key={item.label} className="portal-soft-card p-4 flex items-start gap-3">
            <span className="p-2 rounded-lg bg-slate-50 text-slate-500">{item.icon}</span>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{item.label}</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="portal-soft-card p-5">
        <div className="flex items-center gap-2 mb-4">
          {role === "Guru" || role === "kepalasekolah" ? <GraduationCap className="w-4 h-4 text-emerald-600" /> : role === "orangtua" ? <Users className="w-4 h-4 text-emerald-600" /> : <MapPin className="w-4 h-4 text-emerald-600" />}
          <h4 className="text-sm font-black text-slate-900">Detail Portal {roleLabel[role]}</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {roleDetails.map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{item.label}</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{item.value || "-"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
