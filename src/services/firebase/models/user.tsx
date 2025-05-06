import { bank_data } from "./bank_data";
import { budget } from "./budget";
import { portfolio } from "./portfolio";

type user = {
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: 'admin' | 'dev' | 'full-service' | 'investor';
    module_A: {
        cards: bank_data[];
        budgets: budget[];
    };
    module_B: {
        portfolios: portfolio[];
    };
}

export type { user };