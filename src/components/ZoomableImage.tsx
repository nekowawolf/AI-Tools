'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FallbackImage, FallbackImageProps } from './FallbackImage'

interface ZoomableImageProps extends FallbackImageProps {
  imageClassName?: string
}

export default function ZoomableImage({ src, alt, className = '', imageClassName = '', ...props }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <div 
        className={`cursor-pointer group relative ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <FallbackImage src={src} alt={alt} className={imageClassName} {...props} />
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
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <FallbackImage 
              src={src} 
              alt={alt} 
              className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl cursor-default" 
              onClick={(e) => e.stopPropagation()}
              unoptimized
            />
            <button 
              className="absolute top-4 right-4 md:top-6 md:right-16 text-white/70 hover:text-white bg-black/40 hover:bg-black/80 rounded-full p-3 backdrop-blur-md transition-all cursor-pointer"
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