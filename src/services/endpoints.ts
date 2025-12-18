import { apiService } from "./api";
import {
    Expense,
    Category,
    CreateExpenseDto,
    UpdateExpenseDto,
    CreateCategoryDto,
    UpdateCategoryDto,
} from "../types/expense.types";
import {
    CategoryExpense,
    MonthlyTrend,
    TopCategory,
    ExpenseSummary,
} from "../types/statistics.types";
import {
    ApiResponse,
    User,
    AuthResponse,
    LoginRequest,
    SignupRequest,
    RefreshTokenRequest,
} from "../types/api.types";

// Backend API Endpoints (matches expensesTrackerBackend)

export const authEndpoints = {
    // POST /api/v1/users/signin
    login: (credentials: LoginRequest) =>
        apiService.post<ApiResponse<AuthResponse>>("/users/signin", credentials),

    // POST /api/v1/users/signup
    register: (userData: SignupRequest) =>
        apiService.post<ApiResponse<AuthResponse>>("/users/signup", userData),

    // POST /api/v1/users/logout
    logout: () => apiService.post<ApiResponse<null>>("/users/logout"),

    // POST /api/v1/users/refresh-token
    refreshToken: (data: RefreshTokenRequest) =>
        apiService.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
            "/users/refresh-token",
            data
        ),

    // POST /api/v1/users/verify/request
    requestVerification: (data: { email: string }) =>
        apiService.post<ApiResponse<{ message: string; otp?: string }>>("/users/verify/request", data),

    // POST /api/v1/users/verify/confirm
    confirmVerification: (data: { email: string; otp: string }) =>
        apiService.post<ApiResponse<{ message: string }>>("/users/verify/confirm", data),

    // POST /api/v1/users/password/forgot
    forgotPassword: (data: { email: string }) =>
        apiService.post<ApiResponse<{ message: string; otp?: string }>>("/users/password/forgot", data),

    // POST /api/v1/users/password/reset
    resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
        apiService.post<ApiResponse<{ message: string }>>("/users/password/reset", data),

    // PUT /api/v1/users/profile
    updateProfile: (data: Partial<User> & { firstName?: string; lastName?: string; dateOfBirth?: string; placeOfBirth?: string }) =>
        apiService.put<ApiResponse<User>>("/users/profile", data),
};

export const expenseEndpoints = {
    // GET /api/v1/expenses
    getExpenses: () => apiService.get<ApiResponse<Expense[]>>("/expenses"),

    // GET /api/v1/expenses/:id
    getExpense: (id: string) =>
        apiService.get<ApiResponse<Expense>>(`/expenses/${id}`),

    // POST /api/v1/expenses
    createExpense: (data: CreateExpenseDto) =>
        apiService.post<ApiResponse<Expense>>("/expenses", data),

    // PUT /api/v1/expenses/:id
    updateExpense: (id: string, data: UpdateExpenseDto) =>
        apiService.put<ApiResponse<Expense>>(`/expenses/${id}`, data),

    // DELETE /api/v1/expenses/:id
    deleteExpense: (id: string) =>
        apiService.delete<ApiResponse<null>>(`/expenses/${id}`),
};

export const categoryEndpoints = {
    // GET /api/v1/categories
    getCategories: () => apiService.get<ApiResponse<Category[]>>("/categories"),

    // GET /api/v1/categories/:id
    getCategory: (id: string) =>
        apiService.get<ApiResponse<Category>>(`/categories/${id}`),

    // POST /api/v1/categories
    createCategory: (data: CreateCategoryDto) =>
        apiService.post<ApiResponse<Category>>("/categories", data),

    // PUT /api/v1/categories/:id
    updateCategory: (id: string, data: UpdateCategoryDto) =>
        apiService.put<ApiResponse<Category>>(`/categories/${id}`, data),

    // DELETE /api/v1/categories/:id
    deleteCategory: (id: string) =>
        apiService.delete<ApiResponse<null>>(`/categories/${id}`),
};

export const statisticsEndpoints = {
    // GET /api/v1/statistics/by-category
    getByCategory: () =>
        apiService.get<ApiResponse<CategoryExpense[]>>("/statistics/by-category"),

    // GET /api/v1/statistics/monthly-trends
    getMonthlyTrends: () =>
        apiService.get<ApiResponse<MonthlyTrend[]>>("/statistics/monthly-trends"),

    // GET /api/v1/statistics/top-categories
    getTopCategories: (params?: { limit?: number }) =>
        apiService.get<ApiResponse<TopCategory[]>>("/statistics/top-categories", {
            params,
        }),

    // GET /api/v1/statistics/summary
    getSummary: () =>
        apiService.get<ApiResponse<ExpenseSummary>>("/statistics/summary"),
};
