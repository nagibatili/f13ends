import express, {Request, Response} from "express";
// @ts-ignore
import {nanoid} from "nanoid"
import {authenticate} from "../middlewares/auth";
import {authorizeAdmin} from "../middlewares/authorize";
import {
    EInventoryStatus,
    InventoryGroupModel,
    TInventoryItem,
    TInventoryTableItem,
} from "../models/inventory";

// Интерфейс для тела запроса при создании или обновлении инвентаря
interface InventoryRequestBody {
    name: string;
    amount: number;
}

interface GroupedInventoryByStatusBody {
    groupIds: string[],
    status: EInventoryStatus
}

const router = express.Router();

// Получение всех позиций инвентаря
router.get(
    "/",
    authenticate,
    authorizeAdmin,
    async (_: Request, res: Response): Promise<void> => {
        try {
            const groupItems = await InventoryGroupModel.find();
            const result: TInventoryTableItem[] = groupItems.map(group => ({
                _id: group._id,
                name: group.name,
                used: group.items.filter(item => item.status === EInventoryStatus.used).length,
                new: group.items.filter(item => item.status === EInventoryStatus.new).length,
                broken: group.items.filter(item => item.status === EInventoryStatus.broken).length,
                total: group.items.length
            }));

            res.json(result); // Отправить найденные данные клиенту
        } catch (error) {
            res.status(500).json({error: (error as Error).message}); // Обработать ошибки сервера
        }
    }
);

// Получить инвентарь пользователя
router.get(
    "/user/:id",
    authenticate,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const {id} = req.params;

            // Находим все группы, где есть элементы, назначенные пользователю
            const groups = await InventoryGroupModel.find({
                "items.assignedTo": id
            });

            // Извлекаем элементы, назначенные пользователю
            const result: TInventoryItem[] = groups.flatMap(group =>
                group.items.filter(item => item.assignedTo?.toString() === id)
            );

            res.json(result);
        } catch (error) {
            res.status(500).json({error: (error as Error).message}); // Обработать ошибки сервера
        }
    }
);

router.post(
    "/getGroupInventoryByStatus",
    authenticate,
    authorizeAdmin,
    async (req: Request<{}, {}, GroupedInventoryByStatusBody>, res: Response): Promise<void> => {
        try {
            const {groupIds, status} = req.body;
            const items = await InventoryGroupModel.find({_id: {$in: groupIds}}); // Найти все документы в коллекции Inventory
            const result: TInventoryItem[] = [];

            items.forEach(item => {
                result.push(...item.items.filter((i) => i.status === status));
            })

            res.status(200).json(result); // Отправить найденные данные клиенту
        } catch (error) {
            res.status(500).json({error: (error as Error).message}); // Обработать ошибки сервера
        }
    }
);

// Получить новый инвентарь по имени
router.get(
    "/getByName/:name",
    authenticate,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const {name} = req.params;
            const result: TInventoryItem[] = await InventoryGroupModel.aggregate([
                {$unwind: "$items"},
                {$match: {"name": name, "items.status": EInventoryStatus.new}},
                {$project: {"items": 1}}
            ]);
            res.json(result);
        } catch (error) {
            res.status(500).json({error: (error as Error).message}); // Обработать ошибки сервера
        }
    }
)

router.get(
    "/getNames",
    authenticate,
    async (_: Request, res: Response): Promise<void> => {
        try {
            const names = await InventoryGroupModel.distinct("name");
            res.json(names);
        } catch (error) {
            res.status(500).json({error: (error as Error).message}); // Обработать ошибки сервера
        }
    }
);

router.post(
    "/updateItemsStatus",
    authenticate,
    authorizeAdmin,
    async (req: Request<{}, {}, {
        inventoryGroupIds: string[],
        itemIds: string[],
        newStatus: EInventoryStatus
    }>, res: Response): Promise<void> => {
        try {

            const {itemIds, newStatus, inventoryGroupIds} = req.body;

            console.log(itemIds, newStatus, inventoryGroupIds)

            const result = await InventoryGroupModel.updateMany(
                { _id: { $in: inventoryGroupIds }, 'items._id': { $in: itemIds } },
                { $set: { 'items.$[item].status': newStatus } },
                {
                    arrayFilters: [{ 'item._id': { $in: itemIds } }],
                    multi: true,
                }
            );

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({error: (error as Error).message}); // Обработать ошибки сервера
        }
    }
)

// Добавление новой позиции инвентаря
router.post(
    "/add",
    authenticate,
    authorizeAdmin,
    async (
        req: Request<{}, {}, InventoryRequestBody>,
        res: Response
    ): Promise<void> => {
        const {name, amount} = req.body;

        try {

            const items: any[] = [];

            for (let i = 0; i < amount; i++) {
                const newItem: TInventoryItem = {
                    serialNumber: nanoid(8),
                    name,
                    status: EInventoryStatus.new
                };

                items.push(newItem);
            }

            console.log(items)

            const newGroupItem = new InventoryGroupModel({name, items});

            await newGroupItem.save(); // Сохранить документ в базе данных
            res.status(201).json(newGroupItem); // Отправить созданный документ клиенту
        } catch (error) {
            res.status(400).json({error: (error as Error).message}); // Обработать ошибки клиента
        }
    }
);

// Удаление позиции инвентаря
router.post(
    "/delete",
    authenticate,
    authorizeAdmin,
    async (req: Request<{}, {}, { ids: string[] }>, res: Response): Promise<void> => {
        try {
            const result = await InventoryGroupModel.deleteMany({ _id: { $in: req.body.ids } });
            if (!result) {
                res.status(404).json({message: "Inventory item not found"});
                return;
            }
            res.json({message: "Item deleted successfully"}); // Подтвердить успешное удаление
        } catch (error) {
            res.status(400).json({error: (error as Error).message}); // Обработать ошибки клиента
        }
    }
);

export default router;
