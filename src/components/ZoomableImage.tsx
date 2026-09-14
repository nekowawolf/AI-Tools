'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { FallbackImage, FallbackImageProps } from './FallbackImage'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCircle } from 'react-icons/fa'

interface ZoomableImageProps extends FallbackImageProps {
  imageClassName?: string
  images?: string[]
  currentIndex?: number
}

export default function ZoomableImage({ src, alt, className = '', imageClassName = '', images, currentIndex = 0, ...props }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(currentIndex)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, currentIndex])

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (images && images.length > 1) {
      setDirection(-1)
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
    }
  }, [images])

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (images && images.length > 1) {
      setDirection(1)
      setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
    }
  }, [images])

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x
    if (swipe < -10000 || offset.x < -50) {
      handleNext()
    } else if (swipe > 10000 || offset.x > 50) {
      handlePrev()
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') setIsOpen(false)
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handlePrev, handleNext])

  const currentSrc = images && images.length > 0 ? images[activeIndex] : src

  return (
    <>
      <div 
        className={`cursor-pointer group relative ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <FallbackImage src={src} alt={alt} className={imageClassName} {...props} draggable={false} />
        {/* Hover overlay icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none">
          <div className="bg-blue-600 p-3 rounded-full text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>
          </div>
        </div>
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md transition-all duration-300"
        >
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag={images && images.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={handleDragEnd}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 pointer-events-auto flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <FallbackImage 
                  src={currentSrc} 
                  alt={alt} 
                  className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl select-none" 
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                  unoptimized
                />
              </motion.div>
            </AnimatePresence>

            {images && images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-[101] pointer-events-auto p-2 bg-black/20 rounded-full backdrop-blur-sm">
                {images.map((_, idx) => (
                  <FaCircle 
                    key={idx} 
                    className={`w-2 h-2 transition-all duration-300 ${activeIndex === idx ? 'text-white scale-125' : 'text-white/30 hover:text-white/60 cursor-pointer'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setDirection(idx > activeIndex ? 1 : -1)
                      setActiveIndex(idx)
                    }}
                  />
                ))}
              </div>
            )}

            <button 
              className="absolute top-4 right-4 md:top-6 md:right-16 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 rounded-full p-3 backdrop-blur-md transition-all cursor-pointer pointer-events-auto z-[101]"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}