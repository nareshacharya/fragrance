'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IngredientForm } from '@/components/ingredients'
import { ingredientService } from '@/lib/api/services/ingredients'
import { CreateIngredientRequest } from '@/types/ingredient'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function CreateIngredientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: CreateIngredientRequest) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await ingredientService.create(data)
      
      // Redirect to the ingredient detail page
      router.push(`/ingredients/${response.data.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create ingredient')
      console.error('Error creating ingredient:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/ingredients')
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Ingredient Form */}
      <IngredientForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        error={error}
        mode="create"
      />
    </div>
  )
}
