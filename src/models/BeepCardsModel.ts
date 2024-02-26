export interface BeepCardItem {
    userID: Promise<any>;
    _id: string,
    UUIC: number;
    balance: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }