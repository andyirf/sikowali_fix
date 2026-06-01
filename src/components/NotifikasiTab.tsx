import React from "react";
import { Bell, Check, Trash2, AlertCircle } from "lucide-react";
import { SIKOWALIDatabase } from "../types";

interface NotifikasiTabProps {
  db: SIKOWALIDatabase;
  sessionToken: string;
  onRefresh: () => Promise<void>;
}

export default function NotifikasiTab({ db, sessionToken, onRefresh }: NotifikasiTabProps) {
  const notifs = db.notifications || [];
  const unreadCount = notifs.filter((n) => !n.isRead).length;

  const call = async (url: string, method: string, payload?: object) => {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-session-token": sessionToken },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    if (res.ok) await onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in select-none">
      <div className="portal-panel p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pemberitahuan Portal</h3>
            <span className="text-xs text-slate-400 font-semibold">{unreadCount} notifikasi belum dibaca</span>
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => call("/api/notifications/mark-all-read", "POST")} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer">
            Tandai semua dibaca
          </button>
        )}
      </div>

      <div className="portal-panel rounded-2xl overflow-hidden divide-y divide-slate-100">
        {notifs.map((n) => {
          let styleIcon = "bg-slate-50 text-slate-600";
          if (n.type === "warning") styleIcon = "bg-amber-50 text-amber-600";
          if (n.type === "urgent") styleIcon = "bg-red-50 text-red-600";

          return (
            <div key={n.id} className={`p-4 flex gap-4 transition-all hover:bg-slate-50/50 ${n.isRead ? "opacity-75" : "bg-emerald-500/[0.03]"}`}>
              <div className={`p-2.5 rounded-xl self-start ${styleIcon}`}>
                <AlertCircle className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-3">
                  <h4 className={`text-xs font-bold tracking-tight ${n.isRead ? "text-slate-700" : "text-slate-900"}`}>{n.title}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">{n.date}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{n.description}</p>

                <div className="flex gap-3 justify-end pt-1">
                  <button onClick={() => call(`/api/notifications/${n.id}/read`, "PATCH", { isRead: !n.isRead })} className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-all cursor-pointer">
                    <Check className="w-3.5 h-3.5" />
                    {n.isRead ? "Belum dibaca" : "Tandai dibaca"}
                  </button>
                  <button onClick={() => call(`/api/notifications/${n.id}`, "DELETE")} className="text-[10px] font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-all cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {notifs.length === 0 && (
          <div className="p-12 text-center text-slate-400 font-medium">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2 animate-bounce" />
            Tidak ada notifikasi aktif saat ini.
          </div>
        )}
      </div>
    </div>
  );
}
