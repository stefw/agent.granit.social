import Link from 'next/link'
import { siteConfig } from '@/config/site'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  backButton?: {
    label: string
    href: string
  }
}

export default function Header({ backButton }: HeaderProps) {
  return (
    <header className="w-full py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl  font-black mb-4 ">
              <Link href="/" className="hover:underline transition-colors">
                {siteConfig.name}
              </Link>
            </h1>
            <p className="text-gray-900 dark:text-gray-400 text-[0.7rem] font-mono">
              {siteConfig.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {backButton ? (
              <Link 
                href={backButton.href}
                className="font-mono text-xs transition-colors hover:text-red-600"
              >
                ← {backButton.label}
              </Link>
            ) : (
              <Link 
                href="/about"
                className="font-mono text-xs transition-colors hover:text-red-600"
              >
                ?
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 