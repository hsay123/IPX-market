"use client"

import { Check } from "lucide-react"

interface StepperProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "IPFS Upload" },
  { id: 2, name: "Metadata" },
  { id: 3, name: "Mint NFT" },
  { id: 4, name: "Register IP" },
  { id: 5, name: "License" },
  { id: 6, name: "Complete" },
]

export function UploadStepper({ currentStep }: StepperProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                  currentStep > step.id
                    ? "bg-[#602fc0] text-white"
                    : currentStep === step.id
                      ? "bg-[#602fc0] text-white ring-4 ring-[#602fc0]/20"
                      : "bg-white/10 text-gray-400"
                }`}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? "text-white" : "text-gray-500"}`}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 transition-all ${currentStep > step.id ? "bg-[#602fc0]" : "bg-white/10"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
