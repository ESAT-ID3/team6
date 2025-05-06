type asset = {
    type: 'stock' | 'crypto' | 'etf' | 'forex';
    metadata: {
        name: string;
        category?: string;
        exchange: string;
        symbol: string;
    };
    investment_date: string;
    investment_value: number;
}

export type { asset };