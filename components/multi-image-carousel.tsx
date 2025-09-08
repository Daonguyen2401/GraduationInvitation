"use client"

import React, { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BackgroundImage {
  src: string
  alt: string
  title?: string
}

interface MultiImageCarouselProps {
  images: BackgroundImage[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  showDots?: boolean
  className?: string
}

export function MultiImageCarousel({
  images,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showDots = true,
  className = "",
}: MultiImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!autoPlay || isHovered || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isHovered, images.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (images.length === 0) return null

  // Get the two side images to display (left and right) while keeping background full-screen
  const getSideImages = () => {
    if (images.length === 1) {
      return [images[0], images[0]]
    }
    if (images.length === 2) {
      return [images[0], images[1]]
    }
    const prevIndex = (currentSlide - 1 + images.length) % images.length
    const nextIndex = (currentSlide + 1) % images.length
    return [images[prevIndex], images[nextIndex]]
  }

  const sideImages = getSideImages()

  return (
    <div
      className={`fixed inset-0 w-screen h-screen overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full Screen Background Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}
      </div>

      {/* Two Side Images Overlay Layout (leave center area empty for invitation card) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="flex items-center justify-between w-full h-full px-12 gap-8">
          {/* Left Image */}
          <div className="w-1/3 h-3/4 opacity-80 transform scale-95 transition-all duration-500">
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
              <img
                src={sideImages[0].src}
                alt={sideImages[0].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </div>

          {/* Center Space (kept empty for the main invitation content) */}
          <div className="flex-1 h-4/5"></div>

          {/* Right Image */}
          <div className="w-1/3 h-3/4 opacity-80 transform scale-95 transition-all duration-500">
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
              <img
                src={sideImages[1].src}
                alt={sideImages[1].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {showControls && images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prevSlide()
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-12 h-12 backdrop-blur-sm border border-white/20 z-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              nextSlide()
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full w-12 h-12 backdrop-blur-sm border border-white/20 z-50 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-50">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToSlide(index)
              }}
              className={`w-4 h-4 rounded-full transition-all duration-300 border-2 border-white/50 cursor-pointer ${
                index === currentSlide
                  ? "bg-white scale-110 border-white"
                  : "bg-white/30 hover:bg-white/60 hover:scale-105"
              }`}
              aria-label={`Chuyển đến slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
