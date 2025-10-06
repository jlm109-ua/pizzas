"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Upload, Grid, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Lista", icon: Home },
    { href: "/upload", label: "Subir", icon: Upload },
    { href: "/gallery", label: "Galeria", icon: Grid },
    { href: "/ranking", label: "Ranking", icon: Trophy },
  ]

  return (
    <nav className="bg-white border-b-2 border-orange-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-orange-600">
            Recetas :p
          </Link>
          <div className="flex gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    isActive ? "bg-orange-500 text-white" : "text-orange-600 hover:bg-orange-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
