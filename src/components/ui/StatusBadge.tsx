import type { ReactNode } from "react";
import {
  statusMuted,
  statusReward,
  statusSuccess,
} from "@/components/ui/styles";

interface StatusBadgeProps {
  children: ReactNode;
  tone?: "success" | "reward" | "muted";
  mark?: ReactNode;
}

const toneClasses = {
  success: statusSuccess,
  reward: statusReward,
  muted: statusMuted,
};

export default function StatusBadge({
  children,
  tone = "muted",
  mark,
}: StatusBadgeProps) {
  return (
    <span className={toneClasses[tone]}>
      {mark && <span aria-hidden="true">{mark}</span>}
      {children}
    </span>
  );
}
