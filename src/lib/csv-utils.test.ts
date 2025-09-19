import {
  parseIngredientCSV,
  validateIngredientData,
  generateIngredientCSV,
  generateIngredientTemplate,
  downloadCSVFile,
  parseExcelContent,
  generateIngredientExcel,
  validateCSVStructure,
  cleanCSVData,
  detectCSVDelimiter,
  convertCSVFormat,
  getCSVStatistics,
} from './csv-utils'
import { IngredientImportData, IngredientExportOptions } from '../types/ingredient'
import { Ingredient } from '../types/ingredient'

// Mock the ingredient schemas
jest.mock('../types/ingredient', () => ({
  ...jest.requireActual('../types/ingredient'),
  ingredientSchemas: {
    ingredientImportData: {
      safeParse: jest.fn(),
    },
  },
}))

// Mock DOM methods for downloadCSVFile (only if document is available)
if (typeof document !== 'undefined') {
  Object.defineProperty(document, 'createElement', {
    value: jest.fn(() => ({
      download: undefined,
      setAttribute: jest.fn(),
      style: { visibility: '' },
      click: jest.fn(),
    })),
  })

  Object.defineProperty(document.body, 'appendChild', {
    value: jest.fn(),
  })

  Object.defineProperty(document.body, 'removeChild', {
    value: jest.fn(),
  })
}

Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn(() => 'blob:mock-url'),
})

Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
})

// Mock window.Blob (only if window is available)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'Blob', {
    value: jest.fn(() => ({})),
  })
}

describe('CSV Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('parseIngredientCSV', () => {
    it('should parse valid CSV content', () => {
      const csvContent = `name,type,category,supplier,cost,stocklevel,unit
Lavender Oil,essential_oil,top_notes,Essential Oils Co.,25.50,1000,ml
Rose Oil,essential_oil,middle_notes,Rose Company,45.00,500,ml`

      const result = parseIngredientCSV(csvContent)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        row: 2,
        name: 'Lavender Oil',
        type: 'essential_oil',
        category: 'top_notes',
        supplier: 'Essential Oils Co.',
        cost: 25.50,
        stockLevel: 1000,
        unit: 'ml',
      })
      expect(result[1]).toEqual({
        row: 3,
        name: 'Rose Oil',
        type: 'essential_oil',
        category: 'middle_notes',
        supplier: 'Rose Company',
        cost: 45.00,
        stockLevel: 500,
        unit: 'ml',
      })
    })

    it('should handle CSV with quoted fields', () => {
      const csvContent = `name,type,description
"Lavender Oil, Premium",essential_oil,"High quality oil with floral notes"
"Rose Oil",essential_oil,"Classic rose fragrance"`

      const result = parseIngredientCSV(csvContent)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Lavender Oil, Premium')
      expect(result[0].description).toBe('High quality oil with floral notes')
    })

    it('should handle CSV with escaped quotes', () => {
      const csvContent = `name,description
"Lavender ""Premium"" Oil","High quality ""floral"" oil"`

      const result = parseIngredientCSV(csvContent)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Lavender "Premium" Oil')
      expect(result[0].description).toBe('High quality "floral" oil')
    })

    it('should handle alternative column names', () => {
      const csvContent = `name,type,supplier_code,cas_number,inci_name
Lavender Oil,essential_oil,EO-LAV-001,8000-28-0,Lavandula Angustifolia Oil`

      const result = parseIngredientCSV(csvContent)

      expect(result[0]).toEqual({
        row: 2,
        name: 'Lavender Oil',
        type: 'essential_oil',
        supplierCode: 'EO-LAV-001',
        casNumber: '8000-28-0',
        inciName: 'Lavandula Angustifolia Oil',
      })
    })

    it('should handle numeric values correctly', () => {
      const csvContent = `name,cost,stocklevel,minstocklevel,maxstocklevel
Lavender Oil,25.50,1000,100,5000`

      const result = parseIngredientCSV(csvContent)

      expect(result[0]).toEqual({
        row: 2,
        name: 'Lavender Oil',
        cost: 25.50,
        stockLevel: 1000,
        minStockLevel: 100,
        maxStockLevel: 5000,
      })
    })

    it('should handle empty values', () => {
      const csvContent = `name,type,category,supplier,cost
Lavender Oil,essential_oil,,Essential Oils Co.,25.50`

      const result = parseIngredientCSV(csvContent)

      expect(result[0]).toEqual({
        row: 2,
        name: 'Lavender Oil',
        type: 'essential_oil',
        category: undefined,
        supplier: 'Essential Oils Co.',
        cost: 25.50,
      })
    })

    it('should handle tags with semicolon separator', () => {
      const csvContent = `name,tags
Lavender Oil,"floral; calming; natural"`

      const result = parseIngredientCSV(csvContent)

      expect(result[0].tags).toBe('floral, calming, natural')
    })

    it('should throw error for empty CSV', () => {
      expect(() => parseIngredientCSV('')).toThrow('CSV file must contain at least a header row and one data row')
    })

    it('should throw error for CSV with only headers', () => {
      const csvContent = 'name,type,supplier'
      expect(() => parseIngredientCSV(csvContent)).toThrow('CSV file must contain at least a header row and one data row')
    })

    it('should handle CSV with extra columns', () => {
      const csvContent = `name,type,supplier,extra_column
Lavender Oil,essential_oil,Essential Oils Co.,extra_value`

      const result = parseIngredientCSV(csvContent)

      expect(result[0]).toEqual({
        row: 2,
        name: 'Lavender Oil',
        type: 'essential_oil',
        supplier: 'Essential Oils Co.',
      })
    })
  })

  describe('validateIngredientData', () => {
    it('should validate valid ingredient data', () => {
      const { ingredientSchemas } = require('../types/ingredient')
      const mockSafeParse = jest.fn().mockReturnValue({
        success: true,
        data: { name: 'Lavender Oil', type: 'essential_oil' },
      })
      ingredientSchemas.ingredientImportData.safeParse = mockSafeParse

      const data: IngredientImportData[] = [
        {
          name: 'Lavender Oil',
          type: 'essential_oil',
          supplier: 'Essential Oils Co.',
          cost: 25.50,
          stockLevel: 1000,
          unit: 'ml',
        },
      ]

      const result = validateIngredientData(data)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        row: 2,
        isValid: true,
        errors: [],
        warnings: [],
      })
      expect(mockSafeParse).toHaveBeenCalledWith(data[0])
    })

    it('should validate invalid ingredient data', () => {
      const { ingredientSchemas } = require('../types/ingredient')
      const mockSafeParse = jest.fn().mockReturnValue({
        success: false,
        error: {
          errors: [
            { path: ['name'], message: 'Name is required', code: 'required' },
            { path: ['cost'], message: 'Cost must be positive', code: 'invalid_type' },
          ],
        },
      })
      ingredientSchemas.ingredientImportData.safeParse = mockSafeParse

      const data: IngredientImportData[] = [
        {
          name: '',
          type: 'essential_oil',
          supplier: 'Essential Oils Co.',
          cost: -10,
          stockLevel: 1000,
          unit: 'ml',
        },
      ]

      const result = validateIngredientData(data)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        row: 2,
        isValid: false,
        errors: [
          { field: 'name', message: 'Name is required', code: 'required' },
          { field: 'cost', message: 'Cost must be positive', code: 'invalid_type' },
        ],
        warnings: [],
      })
    })

    it('should handle data with custom row numbers', () => {
      const { ingredientSchemas } = require('../types/ingredient')
      const mockSafeParse = jest.fn().mockReturnValue({
        success: true,
        data: { name: 'Lavender Oil', type: 'essential_oil' },
      })
      ingredientSchemas.ingredientImportData.safeParse = mockSafeParse

      const data: IngredientImportData[] = [
        {
          name: 'Lavender Oil',
          type: 'essential_oil',
          supplier: 'Essential Oils Co.',
          cost: 25.50,
          stockLevel: 1000,
          unit: 'ml',
          row: 5, // Custom row number
        } as any,
      ]

      const result = validateIngredientData(data)

      expect(result[0].row).toBe(5)
    })
  })

  describe('generateIngredientCSV', () => {
    const mockIngredients: Ingredient[] = [
      {
        id: '1',
        name: 'Lavender Oil',
        type: 'essential_oil',
        category: 'top_notes',
        supplier: 'Essential Oils Co.',
        supplierCode: 'EO-LAV-001',
        cost: 25.50,
        currency: 'USD',
        stockLevel: 1000,
        minStockLevel: 100,
        maxStockLevel: 5000,
        unit: 'ml',
        casNumber: '8000-28-0',
        inciName: 'Lavandula Angustifolia Oil',
        einECSNumber: '284-545-0',
        description: 'High-quality lavender essential oil',
        notes: 'Store in cool, dark place',
        tags: ['floral', 'calming', 'natural'],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ]

    it('should generate CSV with headers', () => {
      const options: IngredientExportOptions = {
        fields: ['name', 'type', 'category', 'supplier', 'cost'],
        includeHeaders: true,
        format: 'csv',
      }

      const result = generateIngredientCSV(mockIngredients, options)

      expect(result).toContain('Name,Type,Category,Supplier,Cost')
      expect(result).toContain('Lavender Oil,essential_oil,top_notes,Essential Oils Co.,25.5')
    })

    it('should generate CSV without headers', () => {
      const options: IngredientExportOptions = {
        fields: ['name', 'type', 'supplier'],
        includeHeaders: false,
        format: 'csv',
      }

      const result = generateIngredientCSV(mockIngredients, options)

      expect(result).not.toContain('Name,Type,Supplier')
      expect(result).toContain('Lavender Oil,essential_oil,Essential Oils Co.')
    })

    it('should handle empty ingredients array', () => {
      const options: IngredientExportOptions = {
        fields: ['name', 'type'],
        includeHeaders: true,
        format: 'csv',
      }

      const result = generateIngredientCSV([], options)

      expect(result).toBe('')
    })

    it('should handle all field types', () => {
      const options: IngredientExportOptions = {
        fields: ['name', 'type', 'category', 'supplier', 'supplierCode', 'cost', 'currency', 'stockLevel', 'minStockLevel', 'maxStockLevel', 'unit', 'casNumber', 'inciName', 'einECSNumber', 'description', 'notes', 'tags', 'isActive', 'createdAt', 'updatedAt'],
        includeHeaders: true,
        format: 'csv',
      }

      const result = generateIngredientCSV(mockIngredients, options)

      expect(result).toContain('Name,Type,Category,Supplier,Supplier Code,Cost,Currency,Stock Level,Min Stock Level,Max Stock Level,Unit,CAS Number,INCI Name,EINECS Number,Description,Notes,Tags,Active Status,Created Date,Updated Date')
      expect(result).toContain('Lavender Oil,essential_oil,top_notes,Essential Oils Co.,EO-LAV-001,25.5,USD,1000,100,5000,ml,8000-28-0,Lavandula Angustifolia Oil,284-545-0,High-quality lavender essential oil,Store in cool dark place,floral; calming; natural,Yes')
    })

    it('should escape values with commas and quotes', () => {
      const ingredientsWithSpecialChars: Ingredient[] = [
        {
          ...mockIngredients[0],
          name: 'Lavender Oil, Premium',
          description: 'High-quality "floral" oil',
        },
      ]

      const options: IngredientExportOptions = {
        fields: ['name', 'description'],
        includeHeaders: true,
        format: 'csv',
      }

      const result = generateIngredientCSV(ingredientsWithSpecialChars, options)

      expect(result).toContain('"Lavender Oil, Premium"')
      expect(result).toContain('"High-quality ""floral"" oil"')
    })
  })

  describe('generateIngredientTemplate', () => {
    it('should generate CSV template with headers and example', () => {
      const result = generateIngredientTemplate()

      expect(result).toContain('Name,Type,Category,Supplier,Supplier Code,Cost,Currency,Stock Level,Min Stock Level,Max Stock Level,Unit,CAS Number,INCI Name,EINECS Number,Description,Notes,Tags')
      expect(result).toContain('Lavender Essential Oil,essential_oil,top_notes,Essential Oils Co.,EO-LAV-001,25.50,USD,1000,100,5000,ml,8000-28-0,Lavandula Angustifolia Oil,284-545-0,High-quality lavender essential oil,Store in cool dark place,floral; calming; natural')
    })
  })

  describe('downloadCSVFile', () => {
    it('should create and download CSV file', () => {
      const content = 'name,type\nLavender Oil,essential_oil'
      const filename = 'ingredients.csv'

      downloadCSVFile(content, filename)

      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(URL.revokeObjectURL).toHaveBeenCalled()
    })
  })

  describe('parseExcelContent', () => {
    it('should parse Excel content as CSV', () => {
      const excelContent = `name,type,supplier
Lavender Oil,essential_oil,Essential Oils Co.`

      const result = parseExcelContent(excelContent)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        row: 2,
        name: 'Lavender Oil',
        type: 'essential_oil',
        supplier: 'Essential Oils Co.',
      })
    })

    it('should throw error for empty Excel content', () => {
      expect(() => parseExcelContent('')).toThrow('Excel file must contain at least a header row and one data row')
    })
  })

  describe('generateIngredientExcel', () => {
    it('should generate Excel content as CSV', () => {
      const options: IngredientExportOptions = {
        fields: ['name', 'type'],
        includeHeaders: true,
        format: 'xlsx',
      }

      const result = generateIngredientExcel(mockIngredients, options)

      expect(result).toContain('Name,Type')
      expect(result).toContain('Lavender Oil,essential_oil')
    })
  })

  describe('validateCSVStructure', () => {
    it('should validate correct CSV structure', () => {
      const csvContent = `name,type,supplier,cost,stocklevel
Lavender Oil,essential_oil,Essential Oils Co.,25.50,1000`

      const result = validateCSVStructure(csvContent)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing required columns', () => {
      const csvContent = `name,type
Lavender Oil,essential_oil`

      const result = validateCSVStructure(csvContent)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required column: supplier')
      expect(result.errors).toContain('Missing required column: cost')
      expect(result.errors).toContain('Missing required column: stocklevel')
    })

    it('should detect inconsistent column counts', () => {
      const csvContent = `name,type,supplier
Lavender Oil,essential_oil
Rose Oil,essential_oil,Rose Company,extra`

      const result = validateCSVStructure(csvContent)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Row 2 has 2 columns, expected 3')
      expect(result.errors).toContain('Row 3 has 4 columns, expected 3')
    })

    it('should handle empty file', () => {
      const result = validateCSVStructure('')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('File is empty')
    })

    it('should handle file with only headers', () => {
      const csvContent = 'name,type,supplier,cost,stocklevel'

      const result = validateCSVStructure(csvContent)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('File must contain at least a header row and one data row')
    })

    it('should handle parse errors', () => {
      const csvContent = 'name,type,supplier\n"unclosed quote'

      const result = validateCSVStructure(csvContent)

      expect(result.isValid).toBe(false)
      expect(result.errors[0]).toContain('Parse error:')
    })
  })

  describe('cleanCSVData', () => {
    it('should clean and normalize CSV data', () => {
      const data: IngredientImportData[] = [
        {
          name: '  Lavender Oil  ',
          type: 'essential_oil',
          supplier: '  Essential Oils Co.  ',
          supplierCode: '  EO-LAV-001  ',
          description: '  High-quality oil  ',
          notes: '  Store in cool place  ',
          casNumber: '  8000-28-0  ',
          inciName: '  Lavandula Angustifolia Oil  ',
          tags: '  floral; calming  ',
          cost: NaN,
          stockLevel: -100,
          minStockLevel: NaN,
        },
      ]

      const result = cleanCSVData(data)

      expect(result[0]).toEqual({
        name: 'Lavender Oil',
        type: 'essential_oil',
        supplier: 'Essential Oils Co.',
        supplierCode: 'EO-LAV-001',
        description: 'High-quality oil',
        notes: 'Store in cool place',
        casNumber: '8000-28-0',
        inciName: 'Lavandula Angustifolia Oil',
        tags: 'floral; calming',
        cost: 0,
        stockLevel: 0,
        minStockLevel: 0,
      })
    })

    it('should handle empty data array', () => {
      const result = cleanCSVData([])
      expect(result).toEqual([])
    })
  })

  describe('detectCSVDelimiter', () => {
    it('should detect comma delimiter', () => {
      const content = 'name,type,supplier,cost'
      const result = detectCSVDelimiter(content)
      expect(result).toBe(',')
    })

    it('should detect semicolon delimiter', () => {
      const content = 'name;type;supplier;cost'
      const result = detectCSVDelimiter(content)
      expect(result).toBe(';')
    })

    it('should detect tab delimiter', () => {
      const content = 'name\ttype\tsupplier\tcost'
      const result = detectCSVDelimiter(content)
      expect(result).toBe('\t')
    })

    it('should detect pipe delimiter', () => {
      const content = 'name|type|supplier|cost'
      const result = detectCSVDelimiter(content)
      expect(result).toBe('|')
    })

    it('should default to comma for empty content', () => {
      const result = detectCSVDelimiter('')
      expect(result).toBe(',')
    })

    it('should choose delimiter with highest count', () => {
      const content = 'name,type;supplier,cost'
      const result = detectCSVDelimiter(content)
      expect(result).toBe(',')
    })
  })

  describe('convertCSVFormat', () => {
    it('should convert comma to semicolon delimiter', () => {
      const content = 'name,type,supplier'
      const result = convertCSVFormat(content, ',', ';')
      expect(result).toBe('name;type;supplier')
    })

    it('should convert semicolon to comma delimiter', () => {
      const content = 'name;type;supplier'
      const result = convertCSVFormat(content, ';', ',')
      expect(result).toBe('name,type,supplier')
    })

    it('should handle multiple occurrences', () => {
      const content = 'name,type,supplier,cost'
      const result = convertCSVFormat(content, ',', ';')
      expect(result).toBe('name;type;supplier;cost')
    })
  })

  describe('getCSVStatistics', () => {
    it('should return statistics for valid CSV', () => {
      const content = `name,type,supplier
Lavender Oil,essential_oil,Essential Oils Co.
Rose Oil,essential_oil,Rose Company
Jasmine Oil,essential_oil,Jasmine Co.`

      const result = getCSVStatistics(content)

      expect(result).toEqual({
        totalRows: 4, // header + 3 data rows
        totalColumns: 3,
        emptyRows: 0,
        duplicateRows: 0,
      })
    })

    it('should detect empty rows', () => {
      const content = `name,type,supplier
Lavender Oil,essential_oil,Essential Oils Co.

Rose Oil,essential_oil,Rose Company`

      const result = getCSVStatistics(content)

      expect(result.emptyRows).toBe(1)
    })

    it('should detect duplicate rows', () => {
      const content = `name,type,supplier
Lavender Oil,essential_oil,Essential Oils Co.
Rose Oil,essential_oil,Rose Company
Lavender Oil,essential_oil,Essential Oils Co.`

      const result = getCSVStatistics(content)

      expect(result.duplicateRows).toBe(1)
    })

    it('should handle empty content', () => {
      const result = getCSVStatistics('')

      expect(result).toEqual({
        totalRows: 0,
        totalColumns: 0,
        emptyRows: 0,
        duplicateRows: 0,
      })
    })

    it('should handle content with only headers', () => {
      const content = 'name,type,supplier'
      const result = getCSVStatistics(content)

      expect(result).toEqual({
        totalRows: 1,
        totalColumns: 3,
        emptyRows: 0,
        duplicateRows: 0,
      })
    })
  })
})
