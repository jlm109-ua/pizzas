import { PizzaGallery } from "@/components/pizza-gallery"
import { Navigation } from "@/components/navigation"

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cream-50">
      <Navigation />
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">Galeria</h1>
        </div>
        <PizzaGallery />
      </main>
    </div>
  )
}
