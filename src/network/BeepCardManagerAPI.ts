import { BeepCardItem as BeepCard, BeepCardItem } from '../models/beepCardsModel';
import { TransactionItem as Transaction } from '../models/TransactionsModel';
import { fetchData } from './Fetcher';

const MRT_ONLINE_API_URL = process.env.DEVELOPMENT_URL;
// const DEVELOPMENT_URL = 'http://10.200.53.60:5000';


export async function fetchBeepCard(userId: string): Promise<BeepCard[]> {
    console.log(`${MRT_ONLINE_API_URL}/api/beepCardManager/${userId}`);
    try {
        const response = await fetchData(`${MRT_ONLINE_API_URL}/api/beepCardManager/${userId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error fetching beep cards: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.log('Error fetching beep cards:', error);
        return []; // Rethrow the error for the caller to handle
    }

}

export async function linkBeepCard(userID: string, beepCard: string): Promise<BeepCardItem | null> {
    try {
        const response = await fetchData(`${MRT_ONLINE_API_URL}/api/beepCardManager/link/${beepCard}`, {
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
        console.log('Error updating beep card:', error);
        return null;
    }
}


export async function deleteUser(userID: string, UUID: number): Promise<void> {
    try {
        const response = await fetchData(`${MRT_ONLINE_API_URL}/api/beepCardManager/unlink/${UUID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'userID': userID }), // Include userID in the request body
        });

        if (response.status === 404) {
            // Beep card not found
            console.warn('Beep card not found:', UUID);
        } else if (!response.ok) {
            // Handle other errors if needed
            console.log('Error deleting beep card:', response.statusText);
            throw new Error('Error deleting beep card');
        }
    } catch (error) {
        console.log('Error deleting beep card:', error);
        return; // You can choose to throw or handle the error based on your requirements
    }
}

export async function getTransactions(userID: string): Promise<Transaction[]> {
    try {
        const response = await fetchData(`${MRT_ONLINE_API_URL}/api/beepCardManager/transactions/${userID}`, {
            method: 'GET',
        });

        return await response.json();
    } catch (error) {
        // Handle other errors if needed
        console.log('Error fetching transaction:', error);
        return []; // You can choose to throw or handle the error based on your requirements
    }
}
