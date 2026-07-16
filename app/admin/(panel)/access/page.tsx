import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import AdminRow from "./AdminRow";
import AddAdminForm from "./AddAdminForm";

export const dynamic = "force-dynamic";

export default async function AccessPage() {
  const session = await getSession();
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Access Management</h1>
        <p className="text-sm text-muted">
          Add or remove people who can log in to this admin panel
        </p>
      </div>

      <div className="mb-8 space-y-3">
        {users.map((u) => (
          <AdminRow
            key={u.id}
            user={{ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt.toISOString() }}
            isSelf={u.id === session?.uid}
            canDelete={users.length > 1}
          />
        ))}
      </div>

      <div className="card rounded-2xl p-5">
        <h2 className="mb-4 font-semibold">Add a new admin</h2>
        <AddAdminForm />
      </div>
    </div>
  );
}
