"use client"

import React from "react"
import { GraduationCap } from "lucide-react"

interface GraduationHeaderProps {
  graduateName: string
  university: string
  graduationTitle: string
  universityLogo?: string
  className?: string
}

export function GraduationHeader({
  graduateName,
  university,
  graduationTitle,
  universityLogo,
  className = "",
}: GraduationHeaderProps) {
  return (
    <div className={`relative z-40 ${className}`}>
      {/* Header Background - Subtle */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      {/* Header Content */}
      <div className="relative z-10 px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left: University Logo */}
            <div className="flex items-center space-x-3">
              {universityLogo ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-md">
                  <img
                    src={universityLogo}
                    alt="University Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-800" />
                </div>
              )}
              <div className="text-white">
                <h2 className="text-sm font-semibold">{university}</h2>
                <p className="text-xs opacity-80">Class of 2025</p>
              </div>
            </div>

            {/* Center: Graduation Title */}
            <div className="text-center">
              <h1 className="text-lg font-bold text-white">
                {graduationTitle}
              </h1>
              <p className="text-xs text-yellow-300 font-medium">
                GRADUATION CEREMONY
              </p>
            </div>

            {/* Right: Empty space for balance */}
            <div className="w-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
