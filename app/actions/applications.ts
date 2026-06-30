"use server";

import { ApplicationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  parseApplicationFields,
  validateApplicationAnswers
} from "@/lib/application-fields";
import { PERMISSIONS } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";

export async function submitApplication(formData: FormData) {
  const session = await requireUser();
  const applicationTypeId = String(formData.get("applicationTypeId") || "");
  const slug = String(formData.get("slug") || "");

  const type = await prisma.applicationType.findUnique({
    where: { id: applicationTypeId }
  });

  if (!type || !type.isOpen || type.slug !== slug) {
    redirect("/applications?error=closed");
  }

  const fields = parseApplicationFields(type.fields);
  const { answers, errors } = validateApplicationAnswers(fields, formData);

  if (errors.length > 0) {
    redirect(
      `/applications/${encodeURIComponent(slug)}?error=${encodeURIComponent(
        errors[0]
      )}`
    );
  }

  const existingOpenSubmission = await prisma.applicationSubmission.findFirst({
    where: {
      userId: session.user.id,
      applicationTypeId,
      status: {
        in: [
          ApplicationStatus.SUBMITTED,
          ApplicationStatus.UNDER_REVIEW,
          ApplicationStatus.INTERVIEW
        ]
      }
    }
  });

  if (existingOpenSubmission) {
    redirect(`/my-applications?error=already-open`);
  }

  const submission = await prisma.applicationSubmission.create({
    data: {
      applicationTypeId,
      userId: session.user.id,
      answers
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "application.submitted",
    targetType: "ApplicationSubmission",
    targetId: submission.id,
    metadata: { applicationType: type.name }
  });

  revalidatePath("/my-applications");
  revalidatePath("/admin/applications");
  redirect("/my-applications?submitted=1");
}

export async function reviewApplication(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.APPLICATIONS_REVIEW);
  const submissionId = String(formData.get("submissionId") || "");
  const status = String(formData.get("status") || "") as ApplicationStatus;
  const reviewNotes = String(formData.get("reviewNotes") || "").trim();

  if (!Object.values(ApplicationStatus).includes(status)) {
    redirect(`/admin/applications/${submissionId}?error=invalid-status`);
  }

  await prisma.applicationSubmission.update({
    where: { id: submissionId },
    data: {
      status,
      reviewNotes: reviewNotes || null,
      reviewedById: session.user.id,
      reviewedAt: new Date()
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "application.reviewed",
    targetType: "ApplicationSubmission",
    targetId: submissionId,
    metadata: { status }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${submissionId}`);
  redirect(`/admin/applications/${submissionId}?saved=1`);
}

export async function toggleApplicationType(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.APPLICATIONS_MANAGE);
  const id = String(formData.get("id") || "");
  const isOpen = String(formData.get("isOpen")) === "true";

  const updated = await prisma.applicationType.update({
    where: { id },
    data: { isOpen }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: isOpen ? "application_type.opened" : "application_type.closed",
    targetType: "ApplicationType",
    targetId: id,
    metadata: { name: updated.name }
  });

  revalidatePath("/applications");
  revalidatePath("/admin/applications");
}

export async function withdrawApplication(formData: FormData) {
  const session = await requireUser();
  const id = String(formData.get("id") || "");

  const submission = await prisma.applicationSubmission.findFirst({
    where: {
      id,
      userId: session.user.id,
      status: {
        in: [
          ApplicationStatus.SUBMITTED,
          ApplicationStatus.UNDER_REVIEW,
          ApplicationStatus.INTERVIEW
        ]
      }
    }
  });

  if (!submission) {
    redirect("/my-applications?error=not-found");
  }

  await prisma.applicationSubmission.update({
    where: { id },
    data: { status: ApplicationStatus.WITHDRAWN }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "application.withdrawn",
    targetType: "ApplicationSubmission",
    targetId: id
  });

  revalidatePath("/my-applications");
  revalidatePath("/admin/applications");
}
