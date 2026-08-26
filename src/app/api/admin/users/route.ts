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

const UserUpdateSchema = z.object({
  id: z.union([z.number().int().positive(), z.string().regex(/^\d+$/).transform(Number)]),
  nombre: z.string().trim().min(2).max(100).optional(),
  role: z.enum(["super_admin", "advisor"]).optional(),
  activo: z.boolean().optional(),
  password: z.string().min(10).max(200).optional(),
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
  const parsed = UserUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.issues }, { status: 400, headers: NO_STORE });
  const { id, ...fields } = parsed.data;
  const patch: Record<string, unknown> = {};
  if (fields.nombre) patch.nombre = fields.nombre;
  if (fields.role) patch.role = fields.role;
  if (typeof fields.activo === "boolean") patch.activo = fields.activo;
  if (fields.password) Object.assign(patch, hashAdminPassword(fields.password));
  try { return NextResponse.json({ user: await updateAdminUser(String(id), patch) }, { headers: NO_STORE }); }
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
