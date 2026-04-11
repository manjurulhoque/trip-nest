"use client";

import type { ReactNode } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: ReactNode;
    cancelLabel?: string;
    confirmLabel?: string;
    /** Shown on the confirm button while `isPending` is true */
    pendingLabel?: string;
    confirmVariant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
    isPending?: boolean;
}

/**
 * Controlled confirmation modal. Uses a regular Button for confirm (not
 * AlertDialogAction) so async handlers can finish before the parent closes the dialog.
 */
export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    cancelLabel = "Cancel",
    confirmLabel = "Confirm",
    pendingLabel,
    confirmVariant = "default",
    onConfirm,
    isPending = false,
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        void Promise.resolve(onConfirm());
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription
                        className={description == null ? "sr-only" : undefined}
                    >
                        {description ?? "Please confirm this action."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {cancelLabel}
                    </AlertDialogCancel>
                    <Button
                        type="button"
                        variant={confirmVariant}
                        disabled={isPending}
                        onClick={handleConfirm}
                    >
                        {isPending
                            ? pendingLabel ?? confirmLabel
                            : confirmLabel}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
