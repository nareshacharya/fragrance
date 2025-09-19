'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { IngredientImportData, IngredientImportResult, IngredientValidationResult } from '@/types/ingredient'
import { 
  parseIngredientCSV, 
  validateCSVStructure, 
  cleanCSVData,
  detectCSVDelimiter 
} from '@/lib/csv-utils'

interface IngredientImportProps {
  onImport: (data: IngredientImportData[]) => Promise<IngredientImportResult>
  onValidate?: (data: IngredientImportData[]) => Promise<any[]>
  onDownloadTemplate?: () => void
  className?: string
}

export function IngredientImport({
  onImport,
  onValidate,
  onDownloadTemplate,
  className,
}: IngredientImportProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<IngredientImportData[]>([])
  const [validationResults, setValidationResults] = useState<IngredientValidationResult[]>([])
  const [importResult, setImportResult] = useState<IngredientImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [previewMode, setPreviewMode] = useState<'data' | 'validation' | 'result'>('data')

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return

    setUploadedFile(file)
    setIsProcessing(true)

    try {
      // Read file content
      const text = await file.text()
      
      // Validate CSV structure first
      const structureValidation = validateCSVStructure(text)
      if (!structureValidation.isValid) {
        throw new Error(`CSV structure validation failed: ${structureValidation.errors.join(', ')}`)
      }
      
      // Detect delimiter and convert if needed
      const detectedDelimiter = detectCSVDelimiter(text)
      let processedText = text
      if (detectedDelimiter !== ',') {
        // Convert to comma-delimited for parsing
        processedText = text.replace(new RegExp(detectedDelimiter, 'g'), ',')
      }
      
      // Parse CSV using shared utils
      const rawData = parseIngredientCSV(processedText)
      
      // Clean and normalize data
      const data = cleanCSVData(rawData)
      
      // Add row numbers for tracking
      const dataWithRowNumbers = data.map((item, index) => ({
        ...item,
        row: index + 2 // 1-based row number (accounting for header)
      }))

      setParsedData(dataWithRowNumbers)
      setPreviewMode('data')
    } catch (error) {
      console.error('Error parsing file:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }, [handleFileUpload])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }, [handleFileUpload])

  const handleValidate = useCallback(async () => {
    if (!parsedData.length || !onValidate) return

    setIsValidating(true)
    try {
      const results = await onValidate(parsedData) as IngredientValidationResult[]
      setValidationResults(results)
      setPreviewMode('validation')
    } catch (error) {
      console.error('Validation error:', error)
    } finally {
      setIsValidating(false)
    }
  }, [parsedData, onValidate])

  const handleImport = useCallback(async () => {
    if (!parsedData.length || !onImport) return

    setIsProcessing(true)
    try {
      const result = await onImport(parsedData)
      setImportResult(result)
      setPreviewMode('result')
    } catch (error) {
      console.error('Import error:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [parsedData, onImport])

  const handleReset = useCallback(() => {
    setUploadedFile(null)
    setParsedData([])
    setValidationResults([])
    setImportResult(null)
    setPreviewMode('data')
  }, [])

  const getValidationStatus = (row: any) => {
    const validationResult = validationResults.find(v => v.row === row.row)
    if (!validationResult) return 'pending'
    
    if (!validationResult.isValid || validationResult.errors?.length > 0) return 'error'
    if (validationResult.warnings?.length > 0) return 'warning'
    return 'success'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      default:
        return <CheckCircle className="h-4 w-4 text-success" />
    }
  }

  return (
    <div className={cn('max-w-6xl mx-auto space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Import Ingredients</h2>
          <p className="text-muted-foreground">
            Upload a CSV file to import ingredients into your inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onDownloadTemplate && (
            <Button variant="outline" onClick={onDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          )}
          {parsedData.length > 0 && (
            <Button variant="outline" onClick={handleReset}>
              <Trash2 className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      {!uploadedFile && (
        <Card>
          <CardContent className="p-8">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                dragActive ? 'border-primary bg-primary/5' : 'border-gray-300',
                'hover:border-primary hover:bg-primary/5'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload CSV File</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Choose File
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Supported format: CSV (Comma Separated Values)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Info */}
      {uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Uploaded File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • {parsedData.length} rows
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isProcessing && (
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Badge variant="secondary">Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Tabs */}
      {parsedData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Import Preview</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'data' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('data')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Data ({parsedData.length})
                </Button>
                {validationResults.length > 0 && (
                  <Button
                    variant={previewMode === 'validation' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('validation')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Validation ({validationResults.length})
                  </Button>
                )}
                {importResult && (
                  <Button
                    variant={previewMode === 'result' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('result')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Result
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Data Preview */}
            {previewMode === 'data' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Row</th>
                        <th className="text-left p-2 font-medium">Name</th>
                        <th className="text-left p-2 font-medium">Type</th>
                        <th className="text-left p-2 font-medium">Supplier</th>
                        <th className="text-left p-2 font-medium">Cost</th>
                        <th className="text-left p-2 font-medium">Stock</th>
                        <th className="text-left p-2 font-medium">Unit</th>
                        <th className="text-left p-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 10).map((row, index) => {
                        const status = validationResults.length > 0 ? getValidationStatus(row) : 'pending'
                        return (
                          <tr key={index} className="border-b">
                            <td className="p-2 text-sm">{row.row}</td>
                            <td className="p-2 text-sm font-medium">{row.name}</td>
                            <td className="p-2 text-sm">{row.type}</td>
                            <td className="p-2 text-sm">{row.supplier}</td>
                            <td className="p-2 text-sm">{row.cost}</td>
                            <td className="p-2 text-sm">{row.stockLevel}</td>
                            <td className="p-2 text-sm">{row.unit}</td>
                            <td className="p-2 text-sm">
                              <div className="flex items-center gap-1">
                                {getStatusIcon(status)}
                                <span className="capitalize">{status}</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Showing first 10 rows of {parsedData.length} total rows
                  </p>
                )}
              </div>
            )}

            {/* Validation Preview */}
            {previewMode === 'validation' && (
              <div className="space-y-4">
                {validationResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Row {result.row || index + 2}</span>
                      {result.errors?.length > 0 && (
                        <Badge variant="destructive">Errors: {result.errors.length}</Badge>
                      )}
                      {result.warnings?.length > 0 && (
                        <Badge variant="warning">Warnings: {result.warnings.length}</Badge>
                      )}
                    </div>
                    {result.errors?.map((error, errorIndex: number) => (
                      <div key={errorIndex} className="text-sm text-destructive">
                        • {error.field}: {error.message}
                      </div>
                    ))}
                    {result.warnings?.map((warning, warningIndex: number) => (
                      <div key={warningIndex} className="text-sm text-warning">
                        • {warning.field}: {warning.message}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Import Result */}
            {previewMode === 'result' && importResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{importResult.totalProcessed}</div>
                    <div className="text-sm text-muted-foreground">Total Processed</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">{importResult.successful}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-destructive">{importResult.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-warning">{importResult.skipped}</div>
                    <div className="text-sm text-muted-foreground">Skipped</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Errors</h4>
                    <div className="space-y-2">
                      {importResult.errors.slice(0, 5).map((error, index) => (
                        <div key={index} className="text-sm text-destructive p-2 bg-destructive/10 rounded">
                          Row {error.row}: {error.message}
                        </div>
                      ))}
                      {importResult.errors.length > 5 && (
                        <p className="text-sm text-muted-foreground">
                          ... and {importResult.errors.length - 5} more errors
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {importResult.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Warnings</h4>
                    <div className="space-y-2">
                      {importResult.warnings.slice(0, 5).map((warning, index) => (
                        <div key={index} className="text-sm text-warning p-2 bg-warning/10 rounded">
                          Row {warning.row}: {warning.message}
                        </div>
                      ))}
                      {importResult.warnings.length > 5 && (
                        <p className="text-sm text-muted-foreground">
                          ... and {importResult.warnings.length - 5} more warnings
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {parsedData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onValidate && (
              <Button
                variant="outline"
                onClick={handleValidate}
                disabled={isValidating}
              >
                {isValidating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                {isValidating ? 'Validating...' : 'Validate Data'}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={isProcessing || validationResults.some(r => r.errors?.length > 0)}
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isProcessing ? 'Importing...' : 'Import Ingredients'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
