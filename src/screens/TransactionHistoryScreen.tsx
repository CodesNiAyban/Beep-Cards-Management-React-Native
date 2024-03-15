import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { Card, Divider, Title } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TransactionItem } from '../models/TransactionsModel';
import { getTransactions } from '../network/BeepCardManagerAPI';

const TransactionHistoryScreen = () => {
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const mmkv = new MMKV();
    const androidID = mmkv.getString('phoneID');
    const currentBeepCard = mmkv.getString('selectedBeepCardHistory');

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTransactions = async () => {
        setRefreshing(true);
        try {
            const transactionData = await getTransactions(androidID!);
            const selectedNumber = Number(currentBeepCard);

            // Filter transactions based on the selected beep card number
            const filteredTransactions = transactionData.filter(transaction => transaction.UUIC === selectedNumber);

            setTransactions(filteredTransactions || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setRefreshing(false);
        }
    };

    function toTitleCase(str: string) {
        return str.replace(/\b\w/g, function (char: string) {
            return char.toUpperCase();
        });
    }

    const renderItem = ({ item }: { item: TransactionItem }) => {
        return (
            <>
                {!item.tapIn ? (
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.header}>
                                <FontAwesome5 name={item.tapIn ? 'arrow-circle-down' : 'arrow-circle-up'} size={24} color="#000" style={styles.icon} />
                                <Title style={styles.headerText}>{item.tapIn ? 'TapIn' : 'TapOut'}</Title>
                            </View>
                            <Text style={styles.headerUUIC}>{item.UUIC}</Text>
                            <Divider style={styles.divider} />
                            <View style={styles.grid}>
                                <View>
                                    <Text style={styles.title}>Initial Balance</Text>
                                    <Text style={styles.subText}>₱{item.initialBalance}</Text>
                                    <Text style={styles.title}>From Station</Text>
                                    <Text style={styles.subText}>{item.prevStation}</Text>
                                </View>
                                <View style={styles.textRight}>
                                    <Text style={styles.title}>Current Balance</Text>
                                    <Text style={styles.subText}>₱{item.currBalance}</Text>
                                    <Text style={styles.title}>To Station</Text>
                                    <Text style={styles.subText}>{item.currStation}</Text>
                                </View>
                            </View>
                            <Divider style={styles.divider} />
                            <View style={styles.grid}>
                                <View>
                                    <Text style={styles.title}>Distance Traveled</Text>
                                    <Text style={styles.subText}>{item.distance} km</Text>
                                </View>
                                <View style={styles.textRight}>
                                    <Text style={styles.title}>Fare Charged</Text>
                                    <Text style={styles.balance}>- ₱{item.fare}</Text>
                                </View>
                            </View>
                            <View style={styles.grid}>
                                <View>
                                    <Text style={styles.title}>Time</Text>
                                    <Text style={styles.date}>{formatTime(item.createdAt.toString())}</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                ) : (
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.header}>
                                <FontAwesome5 name={item.tapIn ? 'arrow-circle-down' : 'arrow-circle-up'} size={24} color="#000" style={styles.icon} />
                                <Title style={styles.headerText}>{item.tapIn ? 'TapIn' : 'TapOut'}</Title>
                            </View>
                            <Text style={styles.headerUUIC}>{item.UUIC}</Text>
                            <Divider style={styles.divider} />
                            <View style={styles.grid}>
                                <View>
                                    <Text style={styles.title}>Initial Station</Text>
                                    <Text style={styles.subText}>{toTitleCase(item.currStation)}</Text>
                                </View>
                                <View style={styles.textRight}>
                                    <Text style={styles.title}>Current Balance</Text>
                                    <Text style={styles.subText}>₱{item.initialBalance}</Text>
                                </View>
                            </View>
                            <Divider style={styles.divider} />
                            <View style={styles.grid}>
                                <View>
                                    <Text style={styles.title}>Time</Text>
                                    <Text style={styles.date}>{formatTime(item.createdAt.toString())}</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                )}
            </>
        );
    };

    const formatTime = (timestamp: string): string => {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'UTC',
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Title style={styles.headerTitle}>beep™ Card {currentBeepCard}</Title>
            </View>
            <FlatList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchTransactions} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    headerContainer: {
        backgroundColor: '#172459',
        paddingVertical: 10,
        padding: 20,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center',
    },
    card: {
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    headerUUIC: {
        fontSize: 14,
        color: '#333',
    },
    divider: {
        marginVertical: 8,
    },
    icon: {
        marginRight: 4,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    textRight: {
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        fontFamily: 'Roboto',
    },
    subText: {
        fontSize: 12,
        color: '#555',
        fontFamily: 'Roboto',
        marginBottom: 10,
    },
    date: {
        fontSize: 11,
        color: '#898A8F',
        fontFamily: 'Roboto',
    },
    balance: {
        fontSize: 12,
        color: '#D66062',
        marginLeft: 'auto',
        fontFamily: 'Roboto',
    },
});

export default TransactionHistoryScreen;
