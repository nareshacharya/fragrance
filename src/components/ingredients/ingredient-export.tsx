'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Download, 
  FileText, 
  CheckCircle, 
  RefreshCw,
  Settings,
  Filter,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { IngredientExportOptions } from '@/types/ingredient'

interface IngredientExportProps {
  onExport: (options: IngredientExportOptions) => Promise<void>
  onPreview?: (options: IngredientExportOptions) => Promise<any[]>
  totalCount?: number
  className?: string
}

export function IngredientExport({
  onExport,
  onPreview,
  totalCount = 0,
  className,
}: IngredientExportProps) {
  const [exportOptions, setExportOptions] = useState<IngredientExportOptions>({
    fields: [
      'name',
      'type',
      'category',
      'supplier',
      'supplierCode',
      'cost',
      'currency',
      'stockLevel',
      'minStockLevel',
      'maxStockLevel',
      'unit',
      'casNumber',
      'inciName',
      'einECSNumber',
      'description',
      'notes',
      'tags',
      'isActive',
      'createdAt',
      'updatedAt',
    ],
    format: 'csv',
    includeHeaders: true,
    filters: {},
  })
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const availableFields = [
    { key: 'name', label: 'Name', category: 'Basic' },
    { key: 'type', label: 'Type', category: 'Basic' },
    { key: 'category', label: 'Category', category: 'Basic' },
    { key: 'supplier', label: 'Supplier', category: 'Basic' },
    { key: 'supplierCode', label: 'Supplier Code', category: 'Basic' },
    { key: 'cost', label: 'Cost', category: 'Financial' },
    { key: 'currency', label: 'Currency', category: 'Financial' },
    { key: 'stockLevel', label: 'Stock Level', category: 'Inventory' },
    { key: 'minStockLevel', label: 'Min Stock Level', category: 'Inventory' },
    { key: 'maxStockLevel', label: 'Max Stock Level', category: 'Inventory' },
    { key: 'unit', label: 'Unit', category: 'Inventory' },
    { key: 'casNumber', label: 'CAS Number', category: 'Identifiers' },
    { key: 'inciName', label: 'INCI Name', category: 'Identifiers' },
    { key: 'einECSNumber', label: 'EINECS Number', category: 'Identifiers' },
    { key: 'description', label: 'Description', category: 'Details' },
    { key: 'notes', label: 'Notes', category: 'Details' },
    { key: 'tags', label: 'Tags', category: 'Details' },
    { key: 'isActive', label: 'Active Status', category: 'Status' },
    { key: 'createdAt', label: 'Created Date', category: 'Dates' },
    { key: 'updatedAt', label: 'Updated Date', category: 'Dates' },
  ]

  const fieldCategories = availableFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = []
    }
    acc[field.category].push(field)
    return acc
  }, {} as Record<string, typeof availableFields>)

  const handleFieldToggle = useCallback((fieldKey: string) => {
    setExportOptions(prev => ({
      ...prev,
      fields: prev.fields.includes(fieldKey)
        ? prev.fields.filter(f => f !== fieldKey)
        : [...prev.fields, fieldKey]
    }))
  }, [])

  const handleSelectAllFields = useCallback(() => {
    setExportOptions(prev => ({
      ...prev,
      fields: availableFields.map(f => f.key)
    }))
  }, [])

  const handleDeselectAllFields = useCallback(() => {
    setExportOptions(prev => ({
      ...prev,
      fields: []
    }))
  }, [])

  const handleFormatChange = useCallback((format: 'csv' | 'excel' | 'json') => {
    setExportOptions(prev => ({ ...prev, format }))
  }, [])

  const handleFilterChange = useCallback((key: string, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value
      }
    }))
  }, [])

  const handlePreview = useCallback(async () => {
    if (!onPreview) return

    setIsPreviewing(true)
    try {
      const data = await onPreview(exportOptions)
      setPreviewData(data)
    } catch (error) {
      console.error('Preview error:', error)
    } finally {
      setIsPreviewing(false)
    }
  }, [exportOptions, onPreview])

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    try {
      await onExport(exportOptions)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }, [exportOptions, onExport])

  const getFieldLabel = (fieldKey: string) => {
    const field = availableFields.find(f => f.key === fieldKey)
    return field?.label || fieldKey
  }

  return (
    <div className={cn('max-w-4xl mx-auto space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Export Ingredients</h2>
          <p className="text-muted-foreground">
            Export your ingredient data in various formats
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {totalCount} ingredients available
          </Badge>
        </div>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="flex gap-2">
              {(['csv', 'excel', 'json'] as const).map((format) => (
                <Button
                  key={format}
                  variant={exportOptions.format === format ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFormatChange(format)}
                >
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Field Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Fields to Export</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAllFields}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeselectAllFields}>
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(fieldCategories).map(([category, fields]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {fields.map((field) => (
                      <label
                        key={field.key}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={exportOptions.fields.includes(field.key)}
                          onChange={() => handleFieldToggle(field.key)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{field.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include-headers"
                checked={exportOptions.includeHeaders}
                onChange={(e) => setExportOptions(prev => ({ ...prev, includeHeaders: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="include-headers">Include column headers</Label>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
            </Button>

            {showAdvanced && (
              <div className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type-filter">Type</Label>
                    <Input
                      id="type-filter"
                      placeholder="Filter by type"
                      value={exportOptions.filters?.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier-filter">Supplier</Label>
                    <Input
                      id="supplier-filter"
                      placeholder="Filter by supplier"
                      value={exportOptions.filters?.supplier || ''}
                      onChange={(e) => handleFilterChange('supplier', e.target.value || undefined)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock-status-filter">Stock Status</Label>
                    <select
                      id="stock-status-filter"
                      value={exportOptions.filters?.stockStatus || ''}
                      onChange={(e) => handleFilterChange('stockStatus', e.target.value || undefined)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">All Stock Levels</option>
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="active-status-filter">Status</Label>
                    <select
                      id="active-status-filter"
                      value={exportOptions.filters?.isActive === undefined ? '' : exportOptions.filters?.isActive ? 'true' : 'false'}
                      onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">All Status</option>
                      <option value="true">Active Only</option>
                      <option value="false">Inactive Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="created-after">Created After</Label>
                      <Input
                        id="created-after"
                        type="date"
                        value={exportOptions.filters?.createdAfter || ''}
                        onChange={(e) => handleFilterChange('createdAfter', e.target.value || undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="created-before">Created Before</Label>
                      <Input
                        id="created-before"
                        type="date"
                        value={exportOptions.filters?.createdBefore || ''}
                        onChange={(e) => handleFilterChange('createdBefore', e.target.value || undefined)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {onPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Selected fields: {exportOptions.fields.length} of {availableFields.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Format: {exportOptions.format.toUpperCase()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  disabled={isPreviewing || exportOptions.fields.length === 0}
                >
                  {isPreviewing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  {isPreviewing ? 'Generating Preview...' : 'Preview Export'}
                </Button>
              </div>

              {previewData.length > 0 && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          {exportOptions.fields.slice(0, 8).map((field) => (
                            <th key={field} className="text-left p-2 font-medium text-sm">
                              {getFieldLabel(field)}
                            </th>
                          ))}
                          {exportOptions.fields.length > 8 && (
                            <th className="text-left p-2 font-medium text-sm">
                              ... and {exportOptions.fields.length - 8} more
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 5).map((row, index) => (
                          <tr key={index} className="border-b">
                            {exportOptions.fields.slice(0, 8).map((field) => (
                              <td key={field} className="p-2 text-sm">
                                {row[field] || '-'}
                              </td>
                            ))}
                            {exportOptions.fields.length > 8 && (
                              <td className="p-2 text-sm text-muted-foreground">
                                ...
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {previewData.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Showing first 5 rows of {previewData.length} total rows
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={handleExport}
          disabled={isExporting || exportOptions.fields.length === 0}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExporting ? 'Exporting...' : 'Export Ingredients'}
        </Button>
      </div>
    </div>
  )
}
