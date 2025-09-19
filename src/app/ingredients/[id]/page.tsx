'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IngredientDetail } from '@/components/ingredients'
import { ingredientService } from '@/lib/api/services/ingredients'
import { Ingredient } from '@/types/ingredient'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { 
  AlertCircle, 
  ArrowLeft,
  Loader2
} from 'lucide-react'

interface IngredientDetailPageProps {
  params: {
    id: string
  }
}

export default function IngredientDetailPage({ params }: IngredientDetailPageProps) {
  const router = useRouter()
  const [ingredient, setIngredient] = useState<Ingredient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadIngredient = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await ingredientService.get(params.id)
      setIngredient(response.data)
    } catch (err: any) {
      if (err.status === 404) {
        setError('Ingredient not found')
      } else {
        setError(err.message || 'Failed to load ingredient')
      }
      console.error('Error loading ingredient:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (ingredient: Ingredient) => {
    router.push(`/ingredients/${ingredient.id}/edit`)
  }

  const handleDelete = async (ingredient: Ingredient) => {
    if (!confirm(`Are you sure you want to delete "${ingredient.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await ingredientService.delete(ingredient.id)
      router.push('/ingredients')
    } catch (err: any) {
      setError(err.message || 'Failed to delete ingredient')
    }
  }

  const handleUpdateStock = (ingredient: Ingredient) => {
    // This would open a stock update modal or navigate to a stock update page
    console.log('Update stock for:', ingredient.name)
  }

  const handleExport = (ingredient: Ingredient) => {
    // This would trigger an export of the single ingredient
    console.log('Export ingredient:', ingredient.name)
  }

  const handleBack = () => {
    router.push('/ingredients')
  }

  useEffect(() => {
    if (params.id) {
      loadIngredient()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading ingredient...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ingredients
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!ingredient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ingredients
          </Button>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Ingredient not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Ingredients
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Ingredient Detail */}
      <IngredientDetail
        ingredient={ingredient}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdateStock={handleUpdateStock}
        onExport={handleExport}
      />
    </div>
  )
}
