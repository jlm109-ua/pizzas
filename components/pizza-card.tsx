import { Calendar, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PizzaCardProps {
  pizza: {
    id: string
    name: string
    image_url: string
    ingredients: string[]
    nhoa_rating: number
    jimy_rating: number
    date_made: string
    comment?: string | null
  }
}

export function PizzaCard({ pizza }: PizzaCardProps) {
  const avgRating = ((pizza.nhoa_rating + pizza.jimy_rating) / 2).toFixed(1)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-48 h-48 md:h-auto flex-shrink-0 md:ml-4 md:my-4 md:rounded overflow-hidden">
          <img src={pizza.image_url || "/placeholder.svg"} alt={pizza.name} className="w-full h-full object-cover" />
        </div>
        <CardContent className="flex-1 p-4 md:p-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-bold text-orange-700">{pizza.name}</h3>
              <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                <span className="font-bold text-orange-700">{avgRating}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {pizza.ingredients.map((ingredient, index) => (
                <Badge key={index} variant="secondary" className="bg-cream-100 text-orange-600 hover:bg-cream-200">
                  {ingredient}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-orange-600">
              <div className="flex items-center gap-1">
                <span className="font-semibold">Nhoa:</span>
                <span>{pizza.nhoa_rating}/10</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">Jimy:</span>
                <span>{pizza.jimy_rating}/10</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Calendar className="h-4 w-4" />
                <span>{new Date(pizza.date_made).toLocaleDateString("es-ES")}</span>
              </div>
            </div>

            {pizza.comment && <p className="text-sm text-muted-foreground italic mt-2">{pizza.comment}</p>}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
