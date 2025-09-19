'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Ingredient, 
  CreateIngredientRequest, 
  UpdateIngredientRequest,
  ingredientSchemas,
  INGREDIENT_TYPE_LABELS_MAP,
  WEIGHT_UNIT_LABELS_MAP,
  INGREDIENT_CATEGORY_LABELS
} from '@/types/ingredient'
import { 
  Save, 
  X, 
  Upload, 
  Trash2, 
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IngredientFormProps {
  ingredient?: Ingredient
  onSubmit: (data: CreateIngredientRequest | UpdateIngredientRequest) => Promise<void>
  onCancel: () => void
  onDelete?: (ingredient: Ingredient) => void
  loading?: boolean
  error?: string
  className?: string
  mode?: 'create' | 'edit'
}

export function IngredientForm({
  ingredient,
  onSubmit,
  onCancel,
  onDelete,
  loading = false,
  error,
  className,
  mode = 'create',
}: IngredientFormProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'safety' | 'regulatory' | 'physical' | 'usage'>('basic')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [tags, setTags] = useState<string[]>(ingredient?.tags || [])
  const [newTag, setNewTag] = useState('')

  const schema = mode === 'create' ? ingredientSchemas.createIngredient : ingredientSchemas.updateIngredient
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm<CreateIngredientRequest | UpdateIngredientRequest>({
    resolver: zodResolver(schema),
    defaultValues: ingredient ? {
      name: ingredient.name,
      type: ingredient.type,
      category: ingredient.category,
      supplier: ingredient.supplier,
      supplierCode: ingredient.supplierCode,
      cost: ingredient.cost,
      currency: ingredient.currency,
      stockLevel: ingredient.stockLevel,
      minStockLevel: ingredient.minStockLevel,
      maxStockLevel: ingredient.maxStockLevel,
      unit: ingredient.unit,
      density: ingredient.density,
      molecularWeight: ingredient.molecularWeight,
      casNumber: ingredient.casNumber,
      einECSNumber: ingredient.einECSNumber,
      inciName: ingredient.inciName,
      description: ingredient.description,
      notes: ingredient.notes,
      safetyData: ingredient.safetyData,
      regulatoryInfo: ingredient.regulatoryInfo,
      physicalProperties: ingredient.physicalProperties,
      storageConditions: ingredient.storageConditions,
      usage: ingredient.usage,
      tags: ingredient.tags,
      isActive: ingredient.isActive,
    } : {
      currency: 'USD',
      minStockLevel: 0,
      isActive: true,
    },
  })

  const watchedValues = watch()

  useEffect(() => {
    if (ingredient) {
      reset({
        name: ingredient.name,
        type: ingredient.type,
        category: ingredient.category,
        supplier: ingredient.supplier,
        supplierCode: ingredient.supplierCode,
        cost: ingredient.cost,
        currency: ingredient.currency,
        stockLevel: ingredient.stockLevel,
        minStockLevel: ingredient.minStockLevel,
        maxStockLevel: ingredient.maxStockLevel,
        unit: ingredient.unit,
        density: ingredient.density,
        molecularWeight: ingredient.molecularWeight,
        casNumber: ingredient.casNumber,
        einECSNumber: ingredient.einECSNumber,
        inciName: ingredient.inciName,
        description: ingredient.description,
        notes: ingredient.notes,
        safetyData: ingredient.safetyData,
        regulatoryInfo: ingredient.regulatoryInfo,
        physicalProperties: ingredient.physicalProperties,
        storageConditions: ingredient.storageConditions,
        usage: ingredient.usage,
        tags: ingredient.tags,
        isActive: ingredient.isActive,
      })
      setTags(ingredient.tags || [])
    }
  }, [ingredient, reset])

  const handleFormSubmit = async (data: CreateIngredientRequest | UpdateIngredientRequest) => {
    try {
      await onSubmit({ ...data, tags })
    } catch (err) {
      console.error('Form submission error:', err)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: CheckCircle },
    { id: 'safety', label: 'Safety Data', icon: AlertCircle },
    { id: 'regulatory', label: 'Regulatory', icon: CheckCircle },
    { id: 'physical', label: 'Physical Properties', icon: CheckCircle },
    { id: 'usage', label: 'Usage Info', icon: CheckCircle },
  ]

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {mode === 'create' ? 'Add New Ingredient' : 'Edit Ingredient'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'create' 
                ? 'Fill in the details to add a new ingredient to your inventory'
                : 'Update the ingredient information'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'edit' && onDelete && ingredient && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => onDelete(ingredient)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !isValid}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-sm text-destructive mt-1">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter ingredient name"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <select
                    id="type"
                    {...register('type')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select type</option>
                    {Object.entries(INGREDIENT_TYPE_LABELS_MAP).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    {...register('category')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select category</option>
                    {Object.entries(INGREDIENT_CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Input
                    id="supplier"
                    {...register('supplier')}
                    placeholder="Enter supplier name"
                    className={errors.supplier ? 'border-destructive' : ''}
                  />
                  {errors.supplier && (
                    <p className="text-sm text-destructive">{errors.supplier.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplierCode">Supplier Code</Label>
                  <Input
                    id="supplierCode"
                    {...register('supplierCode')}
                    placeholder="Enter supplier code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('cost', { valueAsNumber: true })}
                      placeholder="0.00"
                      className={errors.cost ? 'border-destructive' : ''}
                    />
                    <select
                      {...register('currency')}
                      className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                  {errors.cost && (
                    <p className="text-sm text-destructive">{errors.cost.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockLevel">Stock Level *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="stockLevel"
                      type="number"
                      min="0"
                      {...register('stockLevel', { valueAsNumber: true })}
                      placeholder="0"
                      className={errors.stockLevel ? 'border-destructive' : ''}
                    />
                    <select
                      {...register('unit')}
                      className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {Object.entries(WEIGHT_UNIT_LABELS_MAP).map(([value, label]) => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  {errors.stockLevel && (
                    <p className="text-sm text-destructive">{errors.stockLevel.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
                  <Input
                    id="minStockLevel"
                    type="number"
                    min="0"
                    {...register('minStockLevel', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStockLevel">Maximum Stock Level</Label>
                  <Input
                    id="maxStockLevel"
                    type="number"
                    min="0"
                    {...register('maxStockLevel', { valueAsNumber: true })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter ingredient description"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Enter additional notes"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Files */}
              <div className="space-y-2">
                <Label>Files</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload files
                        </span>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Active ingredient</Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional tabs would be implemented similarly with their respective fields */}
        {/* For brevity, I'm showing the structure for the basic tab */}
        
        {/* Safety Data Tab */}
        {activeTab === 'safety' && (
          <Card>
            <CardHeader>
              <CardTitle>Safety Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="casNumber">CAS Number</Label>
                  <Input
                    id="casNumber"
                    {...register('casNumber')}
                    placeholder="Enter CAS number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inciName">INCI Name</Label>
                  <Input
                    id="inciName"
                    {...register('inciName')}
                    placeholder="Enter INCI name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="einECSNumber">EINECS Number</Label>
                  <Input
                    id="einECSNumber"
                    {...register('einECSNumber')}
                    placeholder="Enter EINECS number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="molecularWeight">Molecular Weight</Label>
                  <Input
                    id="molecularWeight"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('molecularWeight', { valueAsNumber: true })}
                    placeholder="Enter molecular weight"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="density">Density</Label>
                  <Input
                    id="density"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('density', { valueAsNumber: true })}
                    placeholder="Enter density"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Regulatory Tab */}
        {activeTab === 'regulatory' && (
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ifraCategory">IFRA Category</Label>
                  <Input
                    id="ifraCategory"
                    {...register('regulatoryInfo.ifraCategory')}
                    placeholder="Enter IFRA category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifraLimit">IFRA Limit (%)</Label>
                  <Input
                    id="ifraLimit"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('regulatoryInfo.ifraLimit', { valueAsNumber: true })}
                    placeholder="Enter IFRA limit"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Certifications</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="reachCompliant"
                      {...register('regulatoryInfo.reachCompliant')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="reachCompliant">REACH Compliant</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="fdaApproved"
                      {...register('regulatoryInfo.fdaApproved')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="fdaApproved">FDA Approved</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="kosherCertified"
                      {...register('regulatoryInfo.kosherCertified')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="kosherCertified">Kosher Certified</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="halalCertified"
                      {...register('regulatoryInfo.halalCertified')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="halalCertified">Halal Certified</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="organicCertified"
                      {...register('regulatoryInfo.organicCertified')}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="organicCertified">Organic Certified</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Physical Properties Tab */}
        {activeTab === 'physical' && (
          <Card>
            <CardHeader>
              <CardTitle>Physical Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="appearance">Appearance</Label>
                  <Input
                    id="appearance"
                    {...register('physicalProperties.appearance')}
                    placeholder="Enter appearance description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    {...register('physicalProperties.color')}
                    placeholder="Enter color description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="odor">Odor</Label>
                  <Input
                    id="odor"
                    {...register('physicalProperties.odor')}
                    placeholder="Enter odor description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solubility">Solubility</Label>
                  <Input
                    id="solubility"
                    {...register('physicalProperties.solubility')}
                    placeholder="Enter solubility information"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="boilingPoint">Boiling Point (°C)</Label>
                  <Input
                    id="boilingPoint"
                    type="number"
                    step="0.1"
                    {...register('physicalProperties.boilingPoint', { valueAsNumber: true })}
                    placeholder="Enter boiling point"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meltingPoint">Melting Point (°C)</Label>
                  <Input
                    id="meltingPoint"
                    type="number"
                    step="0.1"
                    {...register('physicalProperties.meltingPoint', { valueAsNumber: true })}
                    placeholder="Enter melting point"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flashPoint">Flash Point (°C)</Label>
                  <Input
                    id="flashPoint"
                    type="number"
                    step="0.1"
                    {...register('physicalProperties.flashPoint', { valueAsNumber: true })}
                    placeholder="Enter flash point"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refractiveIndex">Refractive Index</Label>
                  <Input
                    id="refractiveIndex"
                    type="number"
                    step="0.0001"
                    {...register('physicalProperties.refractiveIndex', { valueAsNumber: true })}
                    placeholder="Enter refractive index"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specificGravity">Specific Gravity</Label>
                  <Input
                    id="specificGravity"
                    type="number"
                    step="0.001"
                    {...register('physicalProperties.specificGravity', { valueAsNumber: true })}
                    placeholder="Enter specific gravity"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <Card>
            <CardHeader>
              <CardTitle>Usage Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="typicalConcentration">Typical Concentration (%)</Label>
                  <Input
                    id="typicalConcentration"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('usage.typicalConcentration', { valueAsNumber: true })}
                    placeholder="Enter typical concentration"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxConcentration">Maximum Concentration (%)</Label>
                  <Input
                    id="maxConcentration"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('usage.maxConcentration', { valueAsNumber: true })}
                    placeholder="Enter maximum concentration"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applications">Applications</Label>
                <textarea
                  id="applications"
                  {...register('usage.applications')}
                  placeholder="Enter applications (one per line)"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compatibility">Compatibility</Label>
                <textarea
                  id="compatibility"
                  {...register('usage.compatibility')}
                  placeholder="Enter compatibility information"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contraindications">Contraindications</Label>
                <textarea
                  id="contraindications"
                  {...register('usage.contraindications')}
                  placeholder="Enter contraindications"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}
