"use client";

import { useActionState, useEffect, useRef } from "react";
import { refreshBoard } from "./actions";
import { actionGhost, actionPrimary } from "@/components/ui/styles";

interface Props {
  hasIncomplete: boolean;
  alreadyRefreshedToday: boolean;
}

export function RefreshBoardButton({
  hasIncomplete,
  alreadyRefreshedToday,
}: Props) {
  const [state, formAction, pending] = useActionState(refreshBoard, {
    error: null,
    success: false,
    hadIncomplete: false,
  });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && state.success) {
      dialogRef.current?.close();
    }
  }, [pending, state.success]);

  if (alreadyRefreshedToday) {
    return (
      <p className="text-xs font-medium text-graphite/65">Refreshed today</p>
    );
  }

  const handleRefreshClick = () => {
    if (hasIncomplete) {
      dialogRef.current?.showModal();
    } else {
      formRef.current?.requestSubmit();
    }
  };

  const handleConfirm = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <form action={formAction} ref={formRef} className="inline">
        <button
          type="button"
          onClick={handleRefreshClick}
          disabled={pending}
          className="inline-flex min-h-11 items-center rounded-control px-3 py-2 text-xs font-semibold text-forest-ink underline decoration-canopy/35 underline-offset-4 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lake-blue"
        >
          {pending ? "Refreshing..." : "Refresh Quest Board"}
        </button>
      </form>

      <dialog
        ref={dialogRef}
        className="mx-auto mt-[20vh] max-w-sm rounded-surface border-0 bg-white p-6 text-graphite shadow-[0_12px_28px_rgba(18,55,42,0.22)] backdrop:bg-forest-ink/55"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <p className="text-sm">
          Refreshing your Quest Board will replace unfinished quests. Completed
          rewards stay earned.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className={actionPrimary}
          >
            {pending ? "Refreshing..." : "Replace unfinished quests"}
          </button>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            disabled={pending}
            className={actionGhost}
          >
            Cancel
          </button>
        </div>
      </dialog>

      {state.error && (
        <p role="alert" className="mt-2 text-xs font-medium text-danger">
          {state.error}
        </p>
      )}
    </>
  );
}
