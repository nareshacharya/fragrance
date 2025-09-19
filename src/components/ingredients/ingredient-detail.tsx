'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Ingredient } from '@/types/ingredient'
import { 
  INGREDIENT_TYPE_LABELS_MAP,
  WEIGHT_UNIT_LABELS_MAP,
  STOCK_STATUS,
  STOCK_STATUS_LABELS,
  STOCK_STATUS_COLORS,
  INGREDIENT_CATEGORY_LABELS,
  INGREDIENT_CATEGORY_COLORS
} from '@/types/ingredient'
import { 
  Edit, 
  Trash2, 
  Download, 
  Package, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Shield,
  Leaf,
  Beaker,
  Calendar,
  User,
  Tag,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IngredientDetailProps {
  ingredient: Ingredient
  onEdit?: (ingredient: Ingredient) => void
  onDelete?: (ingredient: Ingredient) => void
  onUpdateStock?: (ingredient: Ingredient) => void
  onExport?: (ingredient: Ingredient) => void
  className?: string
}

export function IngredientDetail({
  ingredient,
  onEdit,
  onDelete,
  onUpdateStock,
  onExport,
  className,
}: IngredientDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'safety' | 'regulatory' | 'physical' | 'usage' | 'history'>('overview')

  const getStockStatus = (stockLevel: number, minStockLevel: number) => {
    if (stockLevel === 0) return STOCK_STATUS.OUT_OF_STOCK
    if (stockLevel <= minStockLevel) return STOCK_STATUS.LOW_STOCK
    return STOCK_STATUS.IN_STOCK
  }

  const stockStatus = getStockStatus(ingredient.stockLevel, ingredient.minStockLevel)
  const stockStatusColor = STOCK_STATUS_COLORS[stockStatus]
  const stockStatusLabel = STOCK_STATUS_LABELS[stockStatus]

  const getStockIcon = () => {
    switch (stockStatus) {
      case STOCK_STATUS.OUT_OF_STOCK:
        return <XCircle className="h-5 w-5" />
      case STOCK_STATUS.LOW_STOCK:
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <CheckCircle className="h-5 w-5" />
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const formatWeight = (weight: number, unit: string) => {
    const unitLabel = WEIGHT_UNIT_LABELS_MAP[unit as keyof typeof WEIGHT_UNIT_LABELS_MAP] || unit
    return `${weight} ${unitLabel}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Beaker },
    { id: 'safety', label: 'Safety Data', icon: Shield },
    { id: 'regulatory', label: 'Regulatory', icon: FileText },
    { id: 'physical', label: 'Physical Properties', icon: Leaf },
    { id: 'usage', label: 'Usage Info', icon: Package },
    { id: 'history', label: 'History', icon: Calendar },
  ]

  return (
    <div className={cn('max-w-6xl mx-auto space-y-6', className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold truncate">{ingredient.name}</h1>
            <div 
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${stockStatusColor}20`,
                color: stockStatusColor 
              }}
            >
              {getStockIcon()}
              {stockStatusLabel}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {INGREDIENT_TYPE_LABELS_MAP[ingredient.type]}
              </Badge>
              {ingredient.category && (
                <Badge 
                  variant="outline"
                  style={{ 
                    borderColor: INGREDIENT_CATEGORY_COLORS[ingredient.category as keyof typeof INGREDIENT_CATEGORY_COLORS],
                    color: INGREDIENT_CATEGORY_COLORS[ingredient.category as keyof typeof INGREDIENT_CATEGORY_COLORS]
                  }}
                >
                  {INGREDIENT_CATEGORY_LABELS[ingredient.category as keyof typeof INGREDIENT_CATEGORY_LABELS] || ingredient.category}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span>Created by</span>
              <span className="font-medium">{ingredient.createdBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(ingredient.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onUpdateStock && (
            <Button variant="outline" onClick={() => onUpdateStock(ingredient)}>
              <Package className="h-4 w-4 mr-2" />
              Update Stock
            </Button>
          )}
          {onExport && (
            <Button variant="outline" onClick={() => onExport(ingredient)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          {onEdit && (
            <Button onClick={() => onEdit(ingredient)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" onClick={() => onDelete(ingredient)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        {ingredient.isActive ? (
          <Badge variant="success" className="text-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-sm">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )}
        {ingredient.tags && ingredient.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {ingredient.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {ingredient.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{ingredient.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Supplier</label>
                  <p className="text-sm font-medium">{ingredient.supplier}</p>
                </div>
                {ingredient.supplierCode && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Supplier Code</label>
                    <p className="text-sm font-medium font-mono">{ingredient.supplierCode}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cost</label>
                  <p className="text-sm font-medium">{formatCurrency(ingredient.cost, ingredient.currency)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stock Level</label>
                  <p className="text-sm font-medium">{formatWeight(ingredient.stockLevel, ingredient.unit)}</p>
                </div>
                {ingredient.minStockLevel > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Minimum Stock</label>
                    <p className="text-sm font-medium">{formatWeight(ingredient.minStockLevel, ingredient.unit)}</p>
                  </div>
                )}
                {ingredient.maxStockLevel && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Maximum Stock</label>
                    <p className="text-sm font-medium">{formatWeight(ingredient.maxStockLevel, ingredient.unit)}</p>
                  </div>
                )}
              </div>

              {ingredient.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-1">{ingredient.description}</p>
                </div>
              )}

              {ingredient.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-sm mt-1">{ingredient.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Value</span>
                <span className="font-medium">
                  {formatCurrency(ingredient.cost * ingredient.stockLevel, ingredient.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stock Status</span>
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${stockStatusColor}20`,
                    color: stockStatusColor 
                  }}
                >
                  {getStockIcon()}
                  {stockStatusLabel}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm">{formatDate(ingredient.updatedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm">{formatDate(ingredient.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Identifiers */}
          {(ingredient.casNumber || ingredient.inciName || ingredient.einECSNumber) && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Identifiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ingredient.casNumber && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CAS Number</label>
                      <p className="text-sm font-mono">{ingredient.casNumber}</p>
                    </div>
                  )}
                  {ingredient.inciName && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">INCI Name</label>
                      <p className="text-sm">{ingredient.inciName}</p>
                    </div>
                  )}
                  {ingredient.einECSNumber && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">EINECS Number</label>
                      <p className="text-sm font-mono">{ingredient.einECSNumber}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Safety Data Tab */}
      {activeTab === 'safety' && ingredient.safetyData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hazard Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredient.safetyData.hazardClass && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hazard Class</label>
                  <p className="text-sm">{ingredient.safetyData.hazardClass}</p>
                </div>
              )}
              {ingredient.safetyData.hazardStatements && ingredient.safetyData.hazardStatements.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hazard Statements</label>
                  <ul className="text-sm space-y-1">
                    {ingredient.safetyData.hazardStatements.map((statement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>{statement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {ingredient.safetyData.precautionaryStatements && ingredient.safetyData.precautionaryStatements.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Precautionary Statements</label>
                  <ul className="text-sm space-y-1">
                    {ingredient.safetyData.precautionaryStatements.map((statement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-warning">•</span>
                        <span>{statement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredient.safetyData.safetyDataSheet && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Safety Data Sheet</label>
                  <div className="flex items-center gap-2 mt-1">
                    <a 
                      href={ingredient.safetyData.safetyDataSheet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View SDS
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
              {ingredient.safetyData.allergenInfo && ingredient.safetyData.allergenInfo.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Allergen Information</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ingredient.safetyData.allergenInfo.map((allergen, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {ingredient.safetyData.restrictions && ingredient.safetyData.restrictions.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Restrictions</label>
                  <ul className="text-sm space-y-1">
                    {ingredient.safetyData.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Regulatory Tab */}
      {activeTab === 'regulatory' && ingredient.regulatoryInfo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>IFRA Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredient.regulatoryInfo.ifraCategory && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IFRA Category</label>
                  <p className="text-sm">{ingredient.regulatoryInfo.ifraCategory}</p>
                </div>
              )}
              {ingredient.regulatoryInfo.ifraLimit && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IFRA Limit</label>
                  <p className="text-sm">{ingredient.regulatoryInfo.ifraLimit}%</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {ingredient.regulatoryInfo.reachCompliant ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">REACH Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  {ingredient.regulatoryInfo.fdaApproved ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">FDA Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  {ingredient.regulatoryInfo.kosherCertified ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Kosher Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  {ingredient.regulatoryInfo.halalCertified ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Halal Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  {ingredient.regulatoryInfo.organicCertified ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Organic Certified</span>
                </div>
              </div>
              {ingredient.regulatoryInfo.certifications && ingredient.regulatoryInfo.certifications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Additional Certifications</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ingredient.regulatoryInfo.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Physical Properties Tab */}
      {activeTab === 'physical' && ingredient.physicalProperties && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Physical Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingredient.physicalProperties.appearance && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Appearance</label>
                    <p className="text-sm">{ingredient.physicalProperties.appearance}</p>
                  </div>
                )}
                {ingredient.physicalProperties.color && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Color</label>
                    <p className="text-sm">{ingredient.physicalProperties.color}</p>
                  </div>
                )}
                {ingredient.physicalProperties.odor && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Odor</label>
                    <p className="text-sm">{ingredient.physicalProperties.odor}</p>
                  </div>
                )}
                {ingredient.physicalProperties.solubility && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Solubility</label>
                    <p className="text-sm">{ingredient.physicalProperties.solubility}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Physical Constants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingredient.physicalProperties.boilingPoint && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Boiling Point</label>
                    <p className="text-sm">{ingredient.physicalProperties.boilingPoint}°C</p>
                  </div>
                )}
                {ingredient.physicalProperties.meltingPoint && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Melting Point</label>
                    <p className="text-sm">{ingredient.physicalProperties.meltingPoint}°C</p>
                  </div>
                )}
                {ingredient.physicalProperties.flashPoint && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Flash Point</label>
                    <p className="text-sm">{ingredient.physicalProperties.flashPoint}°C</p>
                  </div>
                )}
                {ingredient.physicalProperties.refractiveIndex && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Refractive Index</label>
                    <p className="text-sm">{ingredient.physicalProperties.refractiveIndex}</p>
                  </div>
                )}
                {ingredient.physicalProperties.specificGravity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Specific Gravity</label>
                    <p className="text-sm">{ingredient.physicalProperties.specificGravity}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && ingredient.usage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Concentration Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ingredient.usage.typicalConcentration && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Typical Concentration</label>
                    <p className="text-sm">{ingredient.usage.typicalConcentration}%</p>
                  </div>
                )}
                {ingredient.usage.maxConcentration && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Maximum Concentration</label>
                    <p className="text-sm">{ingredient.usage.maxConcentration}%</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredient.usage.applications && ingredient.usage.applications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Applications</label>
                  <ul className="text-sm space-y-1">
                    {ingredient.usage.applications.map((application, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{application}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {ingredient.usage.compatibility && ingredient.usage.compatibility.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Compatibility</label>
                  <ul className="text-sm space-y-1">
                    {ingredient.usage.compatibility.map((compat, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-success">•</span>
                        <span>{compat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {ingredient.usage.contraindications && ingredient.usage.contraindications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contraindications</label>
                  <ul className="text-sm space-y-1">
                    {ingredient.usage.contraindications.map((contraindication, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>{contraindication}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ingredient created</p>
                  <p className="text-xs text-muted-foreground">
                    Created by {ingredient.createdBy} on {formatDate(ingredient.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Last updated</p>
                  <p className="text-xs text-muted-foreground">
                    Updated on {formatDate(ingredient.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
