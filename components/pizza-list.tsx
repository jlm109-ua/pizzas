"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PizzaCard } from "@/components/pizza-card"
import { Loader2 } from "lucide-react"

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

export function PizzaList() {
  const [pizzas, setPizzas] = useState<Pizza[]>([])
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

  return (
    <div className="flex flex-col gap-4">
      {pizzas.map((pizza) => (
        <PizzaCard key={pizza.id} pizza={pizza} />
      ))}
    </div>
  )
}
