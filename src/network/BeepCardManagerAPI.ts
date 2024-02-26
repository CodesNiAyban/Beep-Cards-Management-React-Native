import { BeepCardItem as BeepCard } from '../models/beepCardsModel';
import { TransactionItem as Transaction } from '../models/TransactionsModel';
import { fetchData } from './Fetcher';

const DEVELOPMENT_URL = process.env.DEVELOPMENT_URL;

export async function fetchBeepCard(): Promise<BeepCard[]> {
    console.log(`${DEVELOPMENT_URL}/api/beepCardManager`)
    const response = await fetchData(`${DEVELOPMENT_URL}/api/beepCardManager`, {
        method: 'GET',
    });

    return response.json();
}


export async function getTransactions(transaction: string): Promise<Transaction | null> {
    try {
        const response = await fetchData(`${DEVELOPMENT_URL}/api/mrt/transactions/${transaction}`, {
            method: 'GET',
        });

        if (response.status === 404) {
            // Beep card not found, return null
            return null;
        }

        return await response.json();
    } catch (error) {
        // Handle other errors if needed
        console.error('Error fetching transaction:', error);
        throw error; // You can choose to throw or handle the error based on your requirements
    }
}
