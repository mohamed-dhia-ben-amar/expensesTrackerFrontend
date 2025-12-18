
export interface CategoryExpense {
    _id: string;
    totalAmount: number;
    category: {
        _id: string;
        name: string;
        description?: string;
    };
}

export interface MonthlyTrend {
    _id: {
        year: number;
        month: number;
    };
    totalAmount: number;
    count: number;
}

export interface TopCategory {
    _id: string;
    totalAmount: number;
    count: number;
    category: {
        _id: string;
        name: string;
        description?: string;
    };
}

export interface ExpenseSummary {
    totalExpenses: number;
    totalAmount: number;
    averageExpense: number;
    categoryCount: number;
}