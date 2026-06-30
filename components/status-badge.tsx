import type { ApplicationStatus } from "@prisma/client";

const labels: Record<ApplicationStatus, string> = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  DENIED: "Denied",
  WITHDRAWN: "Withdrawn"
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`status status-${status.toLowerCase().replace("_", "-")}`}>
      {labels[status]}
    </span>
  );
}
