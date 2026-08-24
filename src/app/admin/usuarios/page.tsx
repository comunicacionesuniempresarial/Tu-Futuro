"use client";

import { useEffect, useState } from "react";

type User = { id: string; email: string; nombre: string; role: "super_admin" | "advisor"; activo: boolean; created_at: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", role: "advisor" as User["role"] });
  const [message, setMessage] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/users");
    if (response.ok) setUsers((await response.json()).users);
    else setMessage("Solo un super administrador puede gestionar usuarios.");
  };
  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!response.ok) { setMessage((await response.json()).error ?? "No se pudo crear"); return; }
    setForm({ nombre: "", email: "", password: "", role: "advisor" });
    setMessage("Usuario creado correctamente.");
    await load();
  };

  const toggle = async (user: User) => {
    await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: user.id, activo: !user.activo }) });
    await load();
  };

  return <div className="mx-auto max-w-5xl space-y-6">
    <div><h1 className="font-display text-3xl font-bold text-slate-900">Usuarios del panel</h1><p className="mt-1 text-sm text-slate-500">Gestiona accesos y roles de admisiones.</p></div>
    {message && <p role="status" className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">{message}</p>}
    <form onSubmit={create} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
      <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm" />
      <input required type="email" placeholder="Correo" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm" />
      <input required minLength={10} type="password" placeholder="Contraseña (10+ caracteres)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="rounded-xl border border-slate-200 p-3 text-sm" />
      <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as User["role"] })} className="rounded-xl border border-slate-200 p-3 text-sm"><option value="advisor">Asesor — lectura y exportación</option><option value="super_admin">Super admin</option></select>
      <button className="rounded-xl bg-[#22D3EE] px-4 py-3 text-sm font-bold text-white hover:bg-[#06b6d4]">Crear usuario</button>
    </form>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Usuario</th><th className="p-4">Rol</th><th className="p-4">Estado</th><th className="p-4">Acción</th></tr></thead><tbody>{users.map(user => <tr key={user.id} className="border-t border-slate-100"><td className="p-4"><div className="font-semibold text-slate-900">{user.nombre}</div><div className="text-slate-500">{user.email}</div></td><td className="p-4">{user.role === "super_admin" ? "Super admin" : "Asesor"}</td><td className="p-4">{user.activo ? "Activo" : "Desactivado"}</td><td className="p-4"><button onClick={() => void toggle(user)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-[#22D3EE]">{user.activo ? "Desactivar" : "Activar"}</button></td></tr>)}</tbody></table></div>
  </div>;
}
