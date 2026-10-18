"use client";

import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AlertDialogModalProps {
  state: AlertState;
  onClose: () => void;
}

export const AlertDialogModal: React.FC<AlertDialogModalProps> = ({
  state,
  onClose,
}) => {
  const renderIcon = () => {
    switch (state.type) {
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />;
      case "error":
        return <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-6 h-6 text-sky-500 shrink-0" />;
    }
  };

  return (
    <Transition appear show={state.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-(--bg-card) p-6 text-right align-middle shadow-xl transition-all border border-(--border-color)">
                <div className="flex items-center gap-3 mb-3">
                  {renderIcon()}
                  <Dialog.Title
                    as="h3"
                    className="text-base font-bold text-(--text-main)"
                  >
                    {state.title}
                  </Dialog.Title>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-(--text-muted)">{state.message}</p>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    variant={state.type === "error" ? "danger" : "primary"}
                    size="sm"
                    onClick={onClose}
                  >
                    حسناً
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
