"use client"

import { PizzaUploadForm } from "@/components/pizza-upload-form"
import { Navigation } from "@/components/navigation"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cream-50">
      <Navigation />
      <main className="max-w-2xl mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">Agregar Nueva Receta</h1>
        </div>
        <PizzaUploadForm onSuccess={() => router.push("/")} />
      </main>
    </div>
  )
}
