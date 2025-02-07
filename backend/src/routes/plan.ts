import express, {Request, Response} from "express";
import {authorizeAdmin} from "../middlewares/authorize";
import {authenticate} from "../middlewares/auth";
import {IPlanItem, PlanItemModel} from "../models/plan";
import {EInventoryStatus, InventoryGroupModel, TInventoryItem} from "../models/inventory";
// @ts-ignore
import {nanoid} from "nanoid";

const router = express.Router();

// Получение всех элементов плана
router.get(
    '/',
    authenticate,
    authorizeAdmin,
    async (_: Request, res: Response): Promise<void> => {
        try {
            const planItems = await PlanItemModel.find();
            res.json(planItems);
        } catch (error) {
            res.status(500).json({error: 'Не удалось получить элементы плана'});
        }
    }
);

// // Получение элемента плана по ID
// router.get('/:id', async (req: Request, res: Response) => {
//     try {
//         const planItem = await PlanItemModel.findById(req.params.id);
//         if (!planItem) {
//             return res.status(404).json({error: 'Элемент плана не найден'});
//         }
//         res.json(planItem);
//     } catch (error) {
//         res.status(500).json({error: 'Не удалось получить элемент плана'});
//     }
// });

// Создание нового элемента плана
router.post(
    '/',
    authenticate,
    authorizeAdmin,
    async (req: Request, res: Response) => {
        try {
            const newPlanItem = new PlanItemModel(req.body as IPlanItem);
            const savedPlanItem = await newPlanItem.save();
            res.status(201).json(savedPlanItem);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Не удалось создать элемент плана'});
        }
    }
);

// // Обновление элемента плана
// router.put('/:id', async (req: Request, res: Response) => {
//     try {
//         const updatedPlanItem = await PlanItemModel.findByIdAndUpdate(
//             req.params.id,
//             req.body as IPlanItem,
//             {new: true}
//         );
//         if (!updatedPlanItem) {
//             return res.status(404).json({error: 'Элемент плана не найден'});
//         }
//         res.json(updatedPlanItem);
//     } catch (error) {
//         res.status(500).json({error: 'Не удалось обновить элемент плана'});
//     }
// });

// Удаление элемента плана
router.post(
    '/delete',
    authenticate,
    authorizeAdmin,
    async (req: Request<{}, {}, { ids: string[] }>, res: Response): Promise<void> => {
        try {
            const result = await PlanItemModel.deleteMany({ _id: { $in: req.body.ids } });
            if (!result) {
                res.status(404).json({error: 'Элемент плана не найден'});
            }
            res.status(204).end();
        } catch (error) {
            res.status(500).json({error: 'Не удалось удалить элемент плана'});
        }
    }
);

// Выполнить элемент плана
router.post(
    '/done',
    authenticate,
    authorizeAdmin,
    async (req: Request<{}, {}, { ids: string[] }>, res: Response): Promise<void> => {
        try {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ error: 'Необходимо предоставить массив ID' });
                return;
            }

            const results = [];

            for (const id of ids) {
                const planItem = await PlanItemModel.findById(id);
                if (!planItem) {
                    res.status(404).json({ error: `Элемент плана с ID ${id} не найден` });
                    return;
                }

                const newInventorytems: any[] = [];

                for (let i = 0; i < planItem.amount; i++) {
                    const newItem: TInventoryItem = {
                        serialNumber: nanoid(8),
                        name: planItem.type,
                        status: EInventoryStatus.new
                    };

                    newInventorytems.push(newItem);
                }

                const inventoryGroup = await InventoryGroupModel.findOne({ name: planItem.type });

                if (!inventoryGroup) {
                    res.status(404).json({ error: 'Группа не найдена' });
                    return;
                }

                inventoryGroup.items.push(...newInventorytems);

                await inventoryGroup.save();

                const deletePlanItemResult = await planItem.deleteOne();

                if (!deletePlanItemResult) {
                    res.status(500).json({ error: `Не удалось выполнить элемент плана с ID ${id}` });
                    return;
                }

                results.push(planItem);
            }

            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({error: 'Не удалось выполнить элемент плана'});
        }
    }
);

export default router;