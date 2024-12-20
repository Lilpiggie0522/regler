"use client"

import React from "react"
import { ErrorModalProps } from "@/components/modals/ModalProps"

export default function ErrorModal({ onClose, errorMessage }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative z-1000">
        <button
          className="absolute top-2 right-2 text-black text-3xl"
          onClick={onClose}
        >
          &times;
        </button>

        <p className="text-center text-lg font-bold text-black">
          {errorMessage}
        </p>
      </div>
    </div>
  )
}