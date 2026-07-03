"use client";

import { useActionState, useEffect, useRef } from "react";
import { refreshBoard } from "./actions";

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
    return <p className="text-xs text-stone-400">Refreshed today</p>;
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
          className="rounded-md bg-amber-700/50 px-3 py-1 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-700/70 disabled:opacity-50"
        >
          {pending ? "Refreshing..." : "Refresh Quest Board"}
        </button>
      </form>

      <dialog
        ref={dialogRef}
        className="mx-auto mt-[20vh] max-w-sm rounded-xl border border-amber-700/60 bg-stone-900 p-6 text-stone-200 shadow-2xl backdrop:bg-black/60"
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
            className="rounded-md bg-amber-700/60 px-4 py-2 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-700/80 disabled:opacity-50"
          >
            {pending ? "Refreshing..." : "Replace unfinished quests"}
          </button>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            disabled={pending}
            className="rounded-md border border-stone-600 px-4 py-2 text-sm font-medium text-stone-300 transition-colors hover:bg-stone-800 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </dialog>

      {state.error && (
        <p className="mt-2 text-xs text-red-400">{state.error}</p>
      )}
    </>
  );
}
