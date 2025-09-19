'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IngredientImport } from '@/components/ingredients'
import { ingredientService } from '@/lib/api/services/ingredients'
import { IngredientImportData, IngredientImportResult } from '@/types/ingredient'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { 
  AlertCircle, 
  ArrowLeft,
  Download
} from 'lucide-react'

export default function ImportIngredientsPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleImport = async (data: IngredientImportData[]): Promise<IngredientImportResult> => {
    try {
      setError(null)
      const result = await ingredientService.importFromCSV(data)
      return result
    } catch (err: any) {
      setError(err.message || 'Failed to import ingredients')
      throw err
    }
  }

  const handleValidate = async (data: IngredientImportData[]) => {
    try {
      setError(null)
      const results = await ingredientService.validateCSVData(data)
      return results
    } catch (err: any) {
      setError(err.message || 'Failed to validate data')
      throw err
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      setError(null)
      const templateBlob = await ingredientService.getImportTemplate()
      
      // Create download link
      const url = window.URL.createObjectURL(templateBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'ingredient-import-template.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Failed to download template')
    }
  }

  const handleBack = () => {
    router.push('/ingredients')
  }

  const handleImportSuccess = () => {
    // Redirect to ingredients list after successful import
    router.push('/ingredients')
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

      {/* Import Component */}
      <IngredientImport
        onImport={handleImport}
        onValidate={handleValidate}
        onDownloadTemplate={handleDownloadTemplate}
      />
    </div>
  )
}
