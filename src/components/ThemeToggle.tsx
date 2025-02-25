'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-[28px] h-[15px] flex items-center justify-center"
      aria-label="Changer de thème"
    >
      <span className="sr-only">Changer de thème</span>
      
      {/* Cercles qui se chevauchent */}
      <div className="relative w-[28px] h-[15px]">
        {/* Cercle avec bordure */}
        <div 
          className={`absolute w-[15px] h-[15px] rounded-full border transition-all duration-300 ${
            theme === 'dark' 
              ? 'border-white left-0 z-10' 
              : 'border-black right-0 z-10'
          }`}
        />
        
        {/* Cercle plein */}
        <div 
          className={`absolute w-[15px] h-[15px] rounded-full transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-white right-[1px]' 
              : 'bg-black left-[1px]'
          }`}
        />
      </div>
    </button>
  )
}