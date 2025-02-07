import mongoose, {Document, Schema} from 'mongoose';

export enum EInventoryStatus {
    new = 'Новый',
    used = 'Используется',
    broken = 'Сломан',
}

export type TInventoryItem = {
    serialNumber: string;
    name: string;
    ownerUsername?: string;
    status: EInventoryStatus;
    assignedTo?: Schema.Types.ObjectId;
};

export type TInventoryTableItem = {
    name: string;
    used: number;
    new: number;
    broken: number;
    total: number;
};

export interface IInventoryGroup extends Document {
    name: string;

    items: TInventoryItem[];
}

const inventoryItemSchema = new Schema<TInventoryItem>({
    serialNumber: {type: String, required: true},
    name: {type: String, required: true},
    assignedTo: {type: Schema.Types.ObjectId, ref: 'User'},
    ownerUsername: {type: String},
    status: {type: String, required: true},
}, { id: false, timestamps: true });

const inventoryGroupSchema = new Schema<IInventoryGroup>({
    name: {type: String, required: true},
    items: [inventoryItemSchema], // Используем массив схем
}, {id: false, timestamps: true}); // Добавляем timestamps для отслеживания создания и обновления

export const InventoryGroupModel = mongoose.model<IInventoryGroup>('InventoryGroup', inventoryGroupSchema);
