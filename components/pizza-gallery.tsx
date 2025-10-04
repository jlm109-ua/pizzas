"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Pizza {
  id: string
  name: string
  image_url: string
  ingredients: string[]
  nhoa_rating: number
  jimy_rating: number
  date_made: string
  comment?: string | null
}

export function PizzaGallery() {
  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPizzas() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("pizzas").select("*").order("date_made", { ascending: false })

        if (error) throw error
        setPizzas(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar las pizzas")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPizzas()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (pizzas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-orange-600 text-lg">No hay pizzas todavia. Agrega tu primera pizza!</p>
      </div>
    )
  }

  const avgRating = (pizza: Pizza) => ((pizza.nhoa_rating + pizza.jimy_rating) / 2).toFixed(1)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pizzas.map((pizza) => (
          <button
            key={pizza.id}
            onClick={() => setSelectedPizza(pizza)}
            className="group relative aspect-square overflow-hidden rounded-lg border-2 border-orange-200 hover:border-orange-400 transition-all hover:scale-105"
          >
            <img src={pizza.image_url || "/placeholder.svg"} alt={pizza.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-bold text-sm mb-1 text-balance">{pizza.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                  <span className="text-xs font-semibold">{avgRating(pizza)}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selectedPizza} onOpenChange={() => setSelectedPizza(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPizza && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-orange-600">{selectedPizza.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="rounded-lg overflow-hidden border-2 border-orange-200">
                  <img
                    src={selectedPizza.image_url || "/placeholder.svg"}
                    alt={selectedPizza.name}
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                    <Star className="h-5 w-5 fill-orange-500 text-orange-500" />
                    <span className="font-bold text-orange-700 text-lg">{avgRating(selectedPizza)}</span>
                  </div>
                  <div className="flex gap-3 text-sm text-orange-600">
                    <span>
                      <strong>Nhoa:</strong> {selectedPizza.nhoa_rating}/10
                    </span>
                    <span>
                      <strong>Jimy:</strong> {selectedPizza.jimy_rating}/10
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-700 mb-2">Ingredientes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPizza.ingredients.map((ingredient, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-orange-100 text-orange-600 hover:bg-orange-200"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <strong>Fecha:</strong> {new Date(selectedPizza.date_made).toLocaleDateString("es-ES")}
                </div>

                {selectedPizza.comment && (
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-700 italic">{selectedPizza.comment}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
