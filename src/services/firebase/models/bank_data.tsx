import { transaction } from './transaction';

type bank_data = {
    id: string;
    bank_name: string;
    bank_icon: string;
    account_number: string;
    expiration_date: Date;
    cvv: string;
    data: transaction[];
}

export type { bank_data };