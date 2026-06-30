"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";

export async function createRuleCategory(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.RULES_MANAGE);
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const order = Number(formData.get("order") || 0);

  if (!title) {
    redirect("/admin/rules?error=missing-title");
  }

  const category = await prisma.ruleCategory.create({
    data: {
      title,
      description: description || null,
      order: Number.isFinite(order) ? order : 0
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "rule_category.created",
    targetType: "RuleCategory",
    targetId: category.id
  });

  revalidatePath("/rules");
  revalidatePath("/admin/rules");
}

export async function createRule(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.RULES_MANAGE);
  const categoryId = String(formData.get("categoryId") || "");
  const code = String(formData.get("code") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const order = Number(formData.get("order") || 0);

  if (!categoryId || !code || !title || !body) {
    redirect("/admin/rules?error=missing-fields");
  }

  const rule = await prisma.rule.create({
    data: {
      categoryId,
      code,
      title,
      body,
      order: Number.isFinite(order) ? order : 0
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "rule.created",
    targetType: "Rule",
    targetId: rule.id
  });

  revalidatePath("/rules");
  revalidatePath("/admin/rules");
}

export async function deleteRule(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.RULES_MANAGE);
  const id = String(formData.get("id") || "");

  await prisma.rule.delete({ where: { id } });

  await writeAuditLog({
    actorId: session.user.id,
    action: "rule.deleted",
    targetType: "Rule",
    targetId: id
  });

  revalidatePath("/rules");
  revalidatePath("/admin/rules");
}

export async function toggleRule(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.RULES_MANAGE);
  const id = String(formData.get("id") || "");
  const enabled = String(formData.get("enabled")) === "true";

  await prisma.rule.update({
    where: { id },
    data: { enabled }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: enabled ? "rule.enabled" : "rule.disabled",
    targetType: "Rule",
    targetId: id
  });

  revalidatePath("/rules");
  revalidatePath("/admin/rules");
}
