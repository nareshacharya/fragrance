'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IngredientExport } from '@/components/ingredients'
import { ingredientService } from '@/lib/api/services/ingredients'
import { IngredientExportOptions, Ingredient } from '@/types/ingredient'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { 
  AlertCircle, 
  ArrowLeft
} from 'lucide-react'

export default function ExportIngredientsPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const handleExport = async (options: IngredientExportOptions) => {
    try {
      setError(null)
      
      // Get the CSV blob from the service
      const blob = await ingredientService.exportToCSV(options)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Set filename based on format and timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `ingredients-export-${timestamp}.${options.format}`
      link.download = filename
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Failed to export ingredients')
      throw err
    }
  }

  const handlePreview = async (options: IngredientExportOptions) => {
    try {
      setError(null)
      
      // Get a preview of the data that would be exported
      const searchParams = {
        ...options.filters,
        pagination: { page: 1, limit: 10 },
        sortBy: 'name',
        sortOrder: 'asc' as const,
      }
      
      const response = await ingredientService.searchIngredients(searchParams)
      return response.data
    } catch (err: any) {
      setError(err.message || 'Failed to preview export data')
      throw err
    }
  }

  const handleBack = () => {
    router.push('/ingredients')
  }

  // Load total count for display
  React.useEffect(() => {
    const loadTotalCount = async () => {
      try {
        const count = await ingredientService.count()
        setTotalCount(count)
      } catch (err) {
        console.error('Failed to load total count:', err)
      }
    }
    
    loadTotalCount()
  }, [])

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

      {/* Export Component */}
      <IngredientExport
        onExport={handleExport}
        onPreview={handlePreview}
        totalCount={totalCount}
      />
    </div>
  )
}
