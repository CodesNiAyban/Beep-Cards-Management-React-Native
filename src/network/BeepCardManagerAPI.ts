import { BeepCardItem as BeepCard, BeepCardItem } from '../models/beepCardsModel';
import { TransactionItem as Transaction } from '../models/TransactionsModel';
import { fetchData } from './Fetcher';

const DEVELOPMENT_URL = process.env.DEVELOPMENT_URL;

export async function fetchBeepCard(): Promise<BeepCard[]> {
    console.log(`${DEVELOPMENT_URL}/api/beepCardManager`);
    const response = await fetchData(`${DEVELOPMENT_URL}/api/beepCardManager`, {
        method: 'GET',
    });

    return response.json();
}

export async function createNewBeepCardUser(userID: string, beepCardId: Partial<BeepCardItem>): Promise<BeepCardItem | null> {
    try {
        const response = await fetchData(`${DEVELOPMENT_URL}/api/beepCardManager/${beepCardId._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'userID': userID }), // Include userID in the request body
        });

        if (response.status === 404) {
            // Beep card not found, return null
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating beep card:', error);
        throw error; // You can choose to throw or handle the error based on your requirements
    }
}


export async function deleteUser(beepCardId: string): Promise<void> {
    try {
        const response = await fetchData(`${DEVELOPMENT_URL}/api/beepCardManager/${beepCardId}`, {
            method: 'DELETE',
        });

        if (response.status === 404) {
            // Beep card not found
            console.warn('Beep card not found:', beepCardId);
        } else if (!response.ok) {
            // Handle other errors if needed
            console.error('Error deleting beep card:', response.statusText);
            throw new Error('Error deleting beep card');
        }
    } catch (error) {
        console.error('Error deleting beep card:', error);
        throw error; // You can choose to throw or handle the error based on your requirements
    }
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
