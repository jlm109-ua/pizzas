"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, X } from "lucide-react"

export function PizzaUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [nhoaRating, setNhoaRating] = useState("")
  const [jimyRating, setJimyRating] = useState("")
  const [dateMade, setDateMade] = useState(new Date().toISOString().split("T")[0])
  const [comment, setComment] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()])
      setCurrentIngredient("")
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!image) {
        throw new Error("Por favor selecciona una imagen")
      }

      if (ingredients.length === 0) {
        throw new Error("Por favor agrega al menos un ingrediente")
      }

      const supabase = createClient()

      // Upload image to Supabase storage
      const fileExt = image.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from("pizza-images").upload(fileName, image)

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("pizza-images").getPublicUrl(fileName)

      // Insert pizza data
      const { error: insertError } = await supabase.from("pizzas").insert({
        name,
        image_url: publicUrl,
        ingredients,
        nhoa_rating: Number.parseInt(nhoaRating),
        jimy_rating: Number.parseInt(jimyRating),
        date_made: dateMade,
        comment: comment || null,
      })

      if (insertError) throw insertError

      // Reset form
      setName("")
      setIngredients([])
      setCurrentIngredient("")
      setNhoaRating("")
      setJimyRating("")
      setDateMade(new Date().toISOString().split("T")[0])
      setComment("")
      setImage(null)
      setImagePreview(null)

      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la pizza")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-600">Agregar Nueva Receta</CardTitle>
        <CardDescription>Sube tu creacion mas reciente</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nombre de la Receta</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pizza Margherita"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Foto del plato</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} required />
            {imagePreview && (
              <div className="mt-2 rounded-lg overflow-hidden border-2 border-orange-200">
                <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ingredient">Ingredientes</Label>
            <div className="flex gap-2">
              <Input
                id="ingredient"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="Tomate, mozzarella..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addIngredient()
                  }
                }}
              />
              <Button type="button" onClick={addIngredient} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                  >
                    {ingredient}
                    <button type="button" onClick={() => removeIngredient(index)} className="hover:text-orange-900">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nhoa-rating">Nota de Nhoa (0-10)</Label>
              <Input
                id="nhoa-rating"
                type="number"
                min="0"
                max="10"
                value={nhoaRating}
                onChange={(e) => setNhoaRating(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="jimy-rating">Nota de Jimy (0-10)</Label>
              <Input
                id="jimy-rating"
                type="number"
                min="0"
                max="10"
                value={jimyRating}
                onChange={(e) => setJimyRating(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Fecha</Label>
            <Input id="date" type="date" value={dateMade} onChange={(e) => setDateMade(e.target.value)} required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="comment">Comentario (opcional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Notas sobre el plato..."
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              "Agregar Pizza"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
