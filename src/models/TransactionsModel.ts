export interface TransactionItem {
    UUIC: number;
    tapIn: boolean;
    initialBalance: string;
    prevStation: string;
    currStation: string;
    distance: number;
    fare: number;
    currBalance: number;
    createdAt: Date;
    updatedAt: Date;
  }