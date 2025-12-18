import { Expense, Category } from "../types/expense.types";
import { Statistics } from "../types/statistics.types";
import { User } from "../types/api.types";

// 🎭 Mock Data - Remove when connecting to real backend

export const mockUser: User = {
    id: "1",
    email: "demo@expensetracker.com",
    name: "Demo User",
    avatar: "https://i.pravatar.cc/150?img=12",
    createdAt: new Date().toISOString(),
};

export const mockCategories: Category[] = [
    {
        id: "1",
        name: "Food & Dining",
        color: "#FF6B6B",
        icon: "utensils",
        userId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Transportation",
        color: "#4A8FFF",
        icon: "car",
        userId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Shopping",
        color: "#00F5DE",
        icon: "shopping-bag",
        userId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "4",
        name: "Entertainment",
        color: "#FBBF24",
        icon: "film",
        userId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "5",
        name: "Healthcare",
        color: "#34D399",
        icon: "heart",
        userId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockExpenses: Expense[] = [
    {
        id: "1",
        amount: 45.5,
        description: "Lunch at downtown restaurant",
        categoryId: "1",
        category: mockCategories[0],
        date: new Date().toISOString(),
        userId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "2",
        amount: 25.0,
        description: "Uber to office",
        categoryId: "2",
        category: mockCategories[1],
        date: new Date(Date.now() - 86400000).toISOString(),
        userId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "3",
        amount: 120.0,
        description: "New headphones",
        categoryId: "3",
        category: mockCategories[2],
        date: new Date(Date.now() - 172800000).toISOString(),
        userId: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const mockStatistics: Statistics = {
    totalExpenses: 1245.5,
    currentMonth: 845.3,
    previousMonth: 920.15,
    percentageChange: -8.1,
    byCategory: [
        {
            categoryId: "1",
            categoryName: "Food & Dining",
            color: "#FF6B6B",
            total: 425.5,
            percentage: 34.2,
            count: 15,
        },
        {
            categoryId: "2",
            categoryName: "Transportation",
            color: "#4A8FFF",
            total: 280.0,
            percentage: 22.5,
            count: 12,
        },
        {
            categoryId: "3",
            categoryName: "Shopping",
            color: "#00F5DE",
            total: 340.0,
            percentage: 27.3,
            count: 8,
        },
        {
            categoryId: "4",
            categoryName: "Entertainment",
            color: "#FBBF24",
            total: 120.0,
            percentage: 9.6,
            count: 5,
        },
        {
            categoryId: "5",
            categoryName: "Healthcare",
            color: "#34D399",
            total: 80.0,
            percentage: 6.4,
            count: 3,
        },
    ],
    monthlyTrends: [
        { month: "Jul", year: 2024, total: 920.15, count: 28 },
        { month: "Aug", year: 2024, total: 845.3, count: 25 },
        { month: "Sep", year: 2024, total: 1120.5, count: 32 },
        { month: "Oct", year: 2024, total: 980.2, count: 30 },
        { month: "Nov", year: 2024, total: 1050.75, count: 29 },
        { month: "Dec", year: 2024, total: 1245.5, count: 35 },
    ],
    topCategories: [
        {
            categoryId: "1",
            categoryName: "Food & Dining",
            color: "#FF6B6B",
            total: 425.5,
            percentage: 34.2,
            count: 15,
        },
        {
            categoryId: "3",
            categoryName: "Shopping",
            color: "#00F5DE",
            total: 340.0,
            percentage: 27.3,
            count: 8,
        },
        {
            categoryId: "2",
            categoryName: "Transportation",
            color: "#4A8FFF",
            total: 280.0,
            percentage: 22.5,
            count: 12,
        },
    ],
};

// Mock API delay
export const mockDelay = (ms: number = 500) =>
    new Promise((resolve) => setTimeout(resolve, ms));
