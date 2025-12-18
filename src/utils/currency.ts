export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

export const parseCurrency = (value: string): number => {
    return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
};