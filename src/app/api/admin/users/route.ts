import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminUser, deleteAdminUser, listAdminUsers, updateAdminUser } from "@/lib/supabase";
import { getAdminRole, hashAdminPassword } from "@/lib/admin-rbac";
import { isSameOrigin } from "@/lib/request-security";

const NO_STORE = { "Cache-Control": "no-store" };
const UserSchema = z.object({
  email: z.string().email(),
  nombre: z.string().trim().min(2).max(100),
  password: z.string().min(10).max(200),
  role: z.enum(["super_admin", "advisor"]),
});

async function requireSuperAdmin() {
  const role = await getAdminRole();
  if (!role) return NextResponse.json({ error: "No autenticado" }, { status: 401, headers: NO_STORE });
  if (role !== "super_admin") return NextResponse.json({ error: "Solo super administradores" }, { status: 403, headers: NO_STORE });
  return null;
}

export async function GET() {
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  try { return NextResponse.json({ users: await listAdminUsers() }, { headers: NO_STORE }); }
  catch { return NextResponse.json({ error: "No se pudieron cargar los usuarios" }, { status: 500, headers: NO_STORE }); }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origen no permitido" }, { status: 403, headers: NO_STORE });
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  const parsed = UserSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.issues }, { status: 400, headers: NO_STORE });
  try {
    const password = hashAdminPassword(parsed.data.password);
    const user = await createAdminUser({ email: parsed.data.email, nombre: parsed.data.nombre, role: parsed.data.role, ...password });
    return NextResponse.json({ user }, { status: 201, headers: NO_STORE });
  } catch { return NextResponse.json({ error: "No se pudo crear el usuario" }, { status: 409, headers: NO_STORE }); }
}

export async function PATCH(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origen no permitido" }, { status: 403, headers: NO_STORE });
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  const body = await request.json().catch(() => null) as { id?: string; nombre?: string; role?: "super_admin" | "advisor"; activo?: boolean; password?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "Falta el id" }, { status: 400, headers: NO_STORE });
  const patch: Record<string, unknown> = {};
  if (body.nombre) patch.nombre = body.nombre.trim();
  if (body.role) patch.role = body.role;
  if (typeof body.activo === "boolean") patch.activo = body.activo;
  if (body.password) Object.assign(patch, hashAdminPassword(body.password));
  try { return NextResponse.json({ user: await updateAdminUser(body.id, patch) }, { headers: NO_STORE }); }
  catch { return NextResponse.json({ error: "No se pudo actualizar el usuario" }, { status: 400, headers: NO_STORE }); }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origen no permitido" }, { status: 403, headers: NO_STORE });
  const denied = await requireSuperAdmin();
  if (denied) return denied;
  const body = await request.json().catch(() => null) as { id?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "Falta el id" }, { status: 400, headers: NO_STORE });
  try { await deleteAdminUser(body.id); return NextResponse.json({ ok: true }, { headers: NO_STORE }); }
  catch { return NextResponse.json({ error: "No se pudo eliminar el usuario" }, { status: 400, headers: NO_STORE }); }
}
