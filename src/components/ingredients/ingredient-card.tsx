'use client'

import React from 'react'
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
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IngredientCardProps {
  ingredient: Ingredient
  onView?: (ingredient: Ingredient) => void
  onEdit?: (ingredient: Ingredient) => void
  onDelete?: (ingredient: Ingredient) => void
  onUpdateStock?: (ingredient: Ingredient) => void
  className?: string
  showActions?: boolean
  compact?: boolean
}

export function IngredientCard({
  ingredient,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
  className,
  showActions = true,
  compact = false,
}: IngredientCardProps) {
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
        return <XCircle className="h-4 w-4" />
      case STOCK_STATUS.LOW_STOCK:
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
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

  if (compact) {
    return (
      <Card className={cn('hover:shadow-md transition-shadow', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm truncate">{ingredient.name}</h3>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: stockStatusColor, color: stockStatusColor }}
                >
                  {stockStatusLabel}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{INGREDIENT_TYPE_LABELS_MAP[ingredient.type]}</span>
                <span>{ingredient.supplier}</span>
                <span>{formatCurrency(ingredient.cost, ingredient.currency)}</span>
              </div>
            </div>
            {showActions && (
              <div className="flex items-center gap-1">
                {onView && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(ingredient)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(ingredient)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(ingredient)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {ingredient.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {INGREDIENT_TYPE_LABELS_MAP[ingredient.type]}
              </Badge>
              {ingredient.category && (
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: INGREDIENT_CATEGORY_COLORS[ingredient.category as keyof typeof INGREDIENT_CATEGORY_COLORS],
                    color: INGREDIENT_CATEGORY_COLORS[ingredient.category as keyof typeof INGREDIENT_CATEGORY_COLORS]
                  }}
                >
                  {INGREDIENT_CATEGORY_LABELS[ingredient.category as keyof typeof INGREDIENT_CATEGORY_LABELS] || ingredient.category}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
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
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Supplier and Cost */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Supplier:</span>
              <span className="font-medium">{ingredient.supplier}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {formatCurrency(ingredient.cost, ingredient.currency)}
              </span>
            </div>
          </div>

          {/* Stock Level */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stock Level:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {formatWeight(ingredient.stockLevel, ingredient.unit)}
              </span>
              {ingredient.minStockLevel > 0 && (
                <span className="text-xs text-muted-foreground">
                  (min: {formatWeight(ingredient.minStockLevel, ingredient.unit)})
                </span>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {ingredient.casNumber && (
                <div>
                  <span className="text-muted-foreground">CAS:</span>
                  <span className="ml-1 font-mono text-xs">{ingredient.casNumber}</span>
                </div>
              )}
              {ingredient.inciName && (
                <div>
                  <span className="text-muted-foreground">INCI:</span>
                  <span className="ml-1 text-xs">{ingredient.inciName}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {ingredient.isActive ? (
                <Badge variant="success" className="text-xs">
                  Active
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {ingredient.description && (
            <div className="text-sm text-muted-foreground">
              <p className="line-clamp-2">{ingredient.description}</p>
            </div>
          )}

          {/* Tags */}
          {ingredient.tags && ingredient.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ingredient.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {ingredient.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{ingredient.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                {onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(ingredient)}
                    className="h-8"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(ingredient)}
                    className="h-8"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onUpdateStock && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateStock(ingredient)}
                    className="h-8"
                  >
                    <Package className="h-4 w-4 mr-1" />
                    Stock
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(ingredient)}
                    className="h-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
