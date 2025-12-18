export interface Category {
    _id: string;
    name: string;
    description?: string;
    userId: string;
    listOfExpenses?: string[]; // Array of expense IDs
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryDto {
    name: string;
    description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> { }

// Expense Model (matches backend schema)
export interface Expense {
    _id: string;
    amount: number;
    description: string;
    date: string;
    category: string | Category; // Can be populated or just ID
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateExpenseDto {
    amount: number;
    description: string;
    category: string; // backend expects category id
    date: string;
}

export interface UpdateExpenseDto extends Partial<CreateExpenseDto> { }