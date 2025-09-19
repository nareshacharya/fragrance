/**
 * CSV processing utilities for ingredient import/export operations
 */

import { 
  IngredientImportData, 
  IngredientExportOptions, 
  IngredientValidationResult,
  ingredientSchemas 
} from '../types/ingredient'
import { Ingredient } from '../types/ingredient'

/**
 * Parse CSV content into ingredient import data
 */
export function parseIngredientCSV(csvContent: string): IngredientImportData[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row')
  }

  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase())
  const data: IngredientImportData[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: any = { row: i + 1 }

    headers.forEach((header, index) => {
      const value = values[index] || ''
      switch (header) {
        case 'name':
          row.name = value
          break
        case 'type':
          row.type = value
          break
        case 'category':
          row.category = value || undefined
          break
        case 'supplier':
          row.supplier = value
          break
        case 'suppliercode':
        case 'supplier_code':
          row.supplierCode = value || undefined
          break
        case 'cost':
          row.cost = value ? parseFloat(value) : 0
          break
        case 'currency':
          row.currency = value || 'USD'
          break
        case 'stocklevel':
        case 'stock_level':
          row.stockLevel = value ? parseFloat(value) : 0
          break
        case 'minstocklevel':
        case 'min_stock_level':
          row.minStockLevel = value ? parseFloat(value) : 0
          break
        case 'maxstocklevel':
        case 'max_stock_level':
          row.maxStockLevel = value ? parseFloat(value) : undefined
          break
        case 'unit':
          row.unit = value || 'g'
          break
        case 'casnumber':
        case 'cas_number':
          row.casNumber = value || undefined
          break
        case 'inciname':
        case 'inci_name':
          row.inciName = value || undefined
          break
        case 'einecsnumber':
        case 'einecs_number':
        case 'einecs':
          row.einECSNumber = value || undefined
          break
        case 'description':
          row.description = value || undefined
          break
        case 'notes':
          row.notes = value || undefined
          break
        case 'tags':
          row.tags = value ? value.split(';').map(t => t.trim()).filter(Boolean).join(', ') : undefined
          break
      }
    })

    data.push(row)
  }

  return data
}

/**
 * Parse a single CSV line handling quoted fields and commas
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i += 2
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }

  // Add the last field
  result.push(current.trim())

  return result
}

/**
 * Validate ingredient import data
 */
export function validateIngredientData(data: IngredientImportData[]): IngredientValidationResult[] {
  return data.map((item, index) => {
    const result = ingredientSchemas.ingredientImportData.safeParse(item)
    
    if (result.success) {
      return {
        row: (item as any).row || index + 2,
        isValid: true,
        errors: [],
        warnings: [],
      }
    } else {
      return {
        row: (item as any).row || index + 2,
        isValid: false,
        errors: result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
        warnings: [],
      }
    }
  })
}

/**
 * Generate CSV content from ingredient data
 */
export function generateIngredientCSV(
  ingredients: Ingredient[], 
  options: IngredientExportOptions
): string {
  if (ingredients.length === 0) {
    return ''
  }

  const headers = options.fields.map(field => getFieldLabel(field))
  const rows: string[] = []

  // Add headers if requested
  if (options.includeHeaders) {
    rows.push(headers.join(','))
  }

  // Add data rows
  ingredients.forEach(ingredient => {
    const values = options.fields.map(field => {
      const value = getFieldValue(ingredient, field)
      return formatCSVValue(value)
    })
    rows.push(values.join(','))
  })

  return rows.join('\n')
}

/**
 * Get field label for CSV header
 */
function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    name: 'Name',
    type: 'Type',
    category: 'Category',
    supplier: 'Supplier',
    supplierCode: 'Supplier Code',
    cost: 'Cost',
    currency: 'Currency',
    stockLevel: 'Stock Level',
    minStockLevel: 'Min Stock Level',
    maxStockLevel: 'Max Stock Level',
    unit: 'Unit',
    casNumber: 'CAS Number',
    inciName: 'INCI Name',
    einECSNumber: 'EINECS Number',
    description: 'Description',
    notes: 'Notes',
    tags: 'Tags',
    isActive: 'Active Status',
    createdAt: 'Created Date',
    updatedAt: 'Updated Date',
  }
  
  return labels[field] || field
}

/**
 * Get field value from ingredient object
 */
function getFieldValue(ingredient: Ingredient, field: string): any {
  switch (field) {
    case 'name':
      return ingredient.name
    case 'type':
      return ingredient.type
    case 'category':
      return ingredient.category || ''
    case 'supplier':
      return ingredient.supplier
    case 'supplierCode':
      return ingredient.supplierCode || ''
    case 'cost':
      return ingredient.cost
    case 'currency':
      return ingredient.currency
    case 'stockLevel':
      return ingredient.stockLevel
    case 'minStockLevel':
      return ingredient.minStockLevel
    case 'maxStockLevel':
      return ingredient.maxStockLevel || ''
    case 'unit':
      return ingredient.unit
    case 'casNumber':
      return ingredient.casNumber || ''
    case 'inciName':
      return ingredient.inciName || ''
    case 'einECSNumber':
      return ingredient.einECSNumber || ''
    case 'description':
      return ingredient.description || ''
    case 'notes':
      return ingredient.notes || ''
    case 'tags':
      return ingredient.tags ? ingredient.tags.join('; ') : ''
    case 'isActive':
      return ingredient.isActive ? 'Yes' : 'No'
    case 'createdAt':
      return new Date(ingredient.createdAt).toLocaleDateString()
    case 'updatedAt':
      return new Date(ingredient.updatedAt).toLocaleDateString()
    default:
      return ''
  }
}

/**
 * Format value for CSV output
 */
function formatCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }
  
  const stringValue = String(value)
  
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  
  return stringValue
}

/**
 * Generate CSV template for ingredient import
 */
export function generateIngredientTemplate(): string {
  const headers = [
    'Name',
    'Type',
    'Category',
    'Supplier',
    'Supplier Code',
    'Cost',
    'Currency',
    'Stock Level',
    'Min Stock Level',
    'Max Stock Level',
    'Unit',
    'CAS Number',
    'INCI Name',
    'EINECS Number',
    'Description',
    'Notes',
    'Tags'
  ]

  const exampleRow = [
    'Lavender Essential Oil',
    'essential_oil',
    'top_notes',
    'Essential Oils Co.',
    'EO-LAV-001',
    '25.50',
    'USD',
    '1000',
    '100',
    '5000',
    'ml',
    '8000-28-0',
    'Lavandula Angustifolia Oil',
    '284-545-0',
    'High-quality lavender essential oil',
    'Store in cool, dark place',
    'floral; calming; natural'
  ]

  return [headers.join(','), exampleRow.join(',')].join('\n')
}

/**
 * Download CSV file
 */
export function downloadCSVFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Parse Excel file content (basic implementation)
 */
export function parseExcelContent(content: string): IngredientImportData[] {
  // This is a basic implementation for Excel parsing
  // In a real application, you'd use a library like xlsx
  const lines = content.split('\n').filter(line => line.trim())
  
  if (lines.length < 2) {
    throw new Error('Excel file must contain at least a header row and one data row')
  }

  // For now, treat Excel content as CSV
  return parseIngredientCSV(content)
}

/**
 * Generate Excel content (basic implementation)
 */
export function generateIngredientExcel(
  ingredients: Ingredient[], 
  options: IngredientExportOptions
): string {
  // This is a basic implementation for Excel generation
  // In a real application, you'd use a library like xlsx
  return generateIngredientCSV(ingredients, options)
}

/**
 * Validate CSV file structure
 */
export function validateCSVStructure(csvContent: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  try {
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) {
      errors.push('File is empty')
      return { isValid: false, errors }
    }
    
    if (lines.length < 2) {
      errors.push('File must contain at least a header row and one data row')
      return { isValid: false, errors }
    }
    
    const headers = parseCSVLine(lines[0])
    const requiredHeaders = ['name', 'type', 'supplier', 'cost', 'stocklevel']
    
    const headerMap = headers.map(h => h.trim().toLowerCase())
    
    for (const required of requiredHeaders) {
      if (!headerMap.includes(required)) {
        errors.push(`Missing required column: ${required}`)
      }
    }
    
    // Check for consistent column count
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`)
      }
    }
    
  } catch (error) {
    errors.push(`Parse error: ${error}`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Clean and normalize CSV data
 */
export function cleanCSVData(data: IngredientImportData[]): IngredientImportData[] {
  return data.map(item => ({
    ...item,
    name: item.name?.trim(),
    supplier: item.supplier?.trim(),
    supplierCode: item.supplierCode?.trim(),
    description: item.description?.trim(),
    notes: item.notes?.trim(),
    casNumber: item.casNumber?.trim(),
    inciName: item.inciName?.trim(),
    tags: item.tags?.trim(),
    // Ensure numeric values are valid
    cost: isNaN(item.cost) ? 0 : Math.max(0, item.cost),
    stockLevel: isNaN(item.stockLevel) ? 0 : Math.max(0, item.stockLevel),
    minStockLevel: isNaN(item.minStockLevel) ? 0 : Math.max(0, item.minStockLevel),
  }))
}

/**
 * Detect CSV delimiter
 */
export function detectCSVDelimiter(content: string): string {
  const firstLine = content.split('\n')[0]
  const delimiters = [',', ';', '\t', '|']
  
  let maxCount = 0
  let detectedDelimiter = ','
  
  for (const delimiter of delimiters) {
    const count = (firstLine.match(new RegExp(delimiter, 'g')) || []).length
    if (count > maxCount) {
      maxCount = count
      detectedDelimiter = delimiter
    }
  }
  
  return detectedDelimiter
}

/**
 * Convert CSV to different format
 */
export function convertCSVFormat(
  content: string, 
  fromDelimiter: string, 
  toDelimiter: string
): string {
  return content.replace(new RegExp(fromDelimiter, 'g'), toDelimiter)
}

/**
 * Get CSV statistics
 */
export function getCSVStatistics(content: string): {
  totalRows: number
  totalColumns: number
  emptyRows: number
  duplicateRows: number
} {
  const lines = content.split('\n').filter(line => line.trim())
  const totalRows = lines.length
  
  if (totalRows === 0) {
    return { totalRows: 0, totalColumns: 0, emptyRows: 0, duplicateRows: 0 }
  }
  
  const firstLine = parseCSVLine(lines[0])
  const totalColumns = firstLine.length
  
  let emptyRows = 0
  const seenRows = new Set<string>()
  let duplicateRows = 0
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line === '') {
      emptyRows++
      continue
    }
    
    if (seenRows.has(line)) {
      duplicateRows++
    } else {
      seenRows.add(line)
    }
  }
  
  return {
    totalRows,
    totalColumns,
    emptyRows,
    duplicateRows,
  }
}
