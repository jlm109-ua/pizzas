"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Trophy, Medal, Award, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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

interface RankedPizza extends Pizza {
  avgRating: number
  rank: number
}

export function PizzaRanking() {
  const [pizzas, setPizzas] = useState<RankedPizza[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPizzas() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("pizzas").select("*")

        if (error) throw error

        // Calculate average ratings and sort
        const rankedPizzas = (data || [])
          .map((pizza) => ({
            ...pizza,
            avgRating: (pizza.nhoa_rating + pizza.jimy_rating) / 2,
          }))
          .sort((a, b) => b.avgRating - a.avgRating)
          .map((pizza, index) => ({
            ...pizza,
            rank: index + 1,
          }))

        setPizzas(rankedPizzas)
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 md:h-8 md:w-8 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
      default:
        return <span className="text-xl md:text-2xl font-bold text-orange-600">#{rank}</span>
    }
  }

  const getRankBorderColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-yellow-400 bg-yellow-50"
      case 2:
        return "border-gray-400 bg-gray-50"
      case 3:
        return "border-orange-400 bg-orange-50"
      default:
        return "border-orange-200"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {pizzas.map((pizza) => (
        <Card
          key={pizza.id}
          className={`overflow-hidden hover:shadow-lg transition-shadow ${getRankBorderColor(pizza.rank)} border-2`}
        >
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="flex items-center justify-center md:w-24 p-2 md:p-0 bg-white">
                <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16">
                  {getRankIcon(pizza.rank)}
                </div>
              </div>

              <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                <img
                  src={pizza.image_url || "/placeholder.svg"}
                  alt={pizza.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 p-4 md:p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-orange-700">{pizza.name}</h3>
                    <div className="flex items-center gap-1 bg-orange-500 text-white px-4 py-2 rounded-full">
                      <Star className="h-5 w-5 fill-white" />
                      <span className="font-bold text-lg">{pizza.avgRating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {pizza.ingredients.map((ingredient, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-cream-100 text-orange-600 hover:bg-cream-200"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                      <span className="font-semibold text-orange-700">Nhoa:</span>
                      <span className="text-orange-600">{pizza.nhoa_rating}/10</span>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                      <span className="font-semibold text-orange-700">Jimy:</span>
                      <span className="text-orange-600">{pizza.jimy_rating}/10</span>
                    </div>
                  </div>

                  {pizza.comment && <p className="text-sm text-muted-foreground italic mt-2">{pizza.comment}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
