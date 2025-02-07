import express, {Request, Response} from "express";
import {authenticate} from "../middlewares/auth";
import {authorizeAdmin} from "../middlewares/authorize";
import {ERequestStatus, RequestModel} from "../models/request";
import {EInventoryStatus, InventoryGroupModel} from "../models/inventory";
import {UserModel} from "../models/user";

const router = express.Router();

// Получить все заявки
router.get(
    "/",
    authenticate,
    authorizeAdmin,
    async (_, res): Promise<void> => {
        try {
            const result = await RequestModel.find();
            res.json(result);
        } catch (error) {
            res.status(500).json({error: 'Не удалось получить заявки'});
        }
    }
);

// Получить заявки пользователя
router.get(
    "/user-requests/:id",
    authenticate,
    async (req, res): Promise<void> => {
        try {
            console.log(req.params)
            const result = await RequestModel.find({applicantId: req.params.id});
            res.json(result);
        } catch (error) {
            res.status(500).json({error: 'Не удалось получить заявки пользователя'});
        }
    }
)

// Создать заявку
router.post(
    "/",
    authenticate,
    async (req, res): Promise<void> => {
        try {
            const newRequest = new RequestModel(req.body);
            const savedRequest = await newRequest.save();
            res.status(201).json(savedRequest);
        } catch (error) {
            res.status(500).json({error: 'Не удалось создать заявку'});
        }
    }
);

// Удалить заявки
router.post(
    "/delete",
    authenticate,
    async (req: Request<{}, {}, { ids: string[] }>, res: Response): Promise<void> => {
        try {
            const result = await RequestModel.deleteMany({_id: {$in: req.body.ids}});
            if (!result) {
                res.status(404).json({error: 'Заявка не найдена'});
            }
            res.status(204).end();
        } catch (error) {
            res.status(500).json({error: 'Не удалось удалить заявку'});
        }
    }
);

// Одобрить заявку
router.post(
    "/approve",
    authenticate,
    authorizeAdmin,
    async (req: Request<{}, {}, { id: string }>, res: Response): Promise<void> => {
        try {
            const request = await RequestModel.findById(req.body.id);
            if (!request) {
                res.status(404).json({error: 'Заявка не найдена'});
                return;
            }

            const applicant = await UserModel.findById(request.applicantId);
            if (!applicant) {
                res.status(404).json({error: 'Пользователь не найден'});
                return;
            }

            request.status = ERequestStatus.approved;
            await request.save();

            const { type: name, amount, applicantId } = request;

            // Находим группу, в которой нужно обновить элементы
            const group = await InventoryGroupModel.findOne({ name });
            if (!group) {
                res.status(404).json({ error: 'Группа не найдена' });
                return;
            }

            // Находим первые `amount` элементов с нужным статусом
            const itemsToUpdate = group.items
                .filter(item => item.status === EInventoryStatus.new)
                .slice(0, amount); // Берем только первые `amount` элементов

            if (itemsToUpdate.length < amount) {
                res.status(400).json({ error: 'Недостаточно элементов для обновления' });
                return;
            }

            // Обновляем статус и назначаем пользователя для выбранных элементов
            itemsToUpdate.forEach(item => {
                item.status = EInventoryStatus.used; // Обновляем статус
                item.assignedTo = applicantId; // Назначаем пользователя
                item.ownerUsername = applicant.username;
            });

            // Сохраняем обновленный документ
            await group.save();

            res.status(200).json({message: 'Заявка одобрена'});
        } catch (error) {
            res.status(500).json({error: 'Не удалось одобрить заявку'});
        }
    }
);

// Отклонить заявку
router.post(
    "/reject",
    authenticate,
    authorizeAdmin,
    async (req: Request<{}, {}, { id: string }>, res: Response): Promise<void> => {
        try {
            const request = await RequestModel.findById(req.body.id);
            if (!request) {
                res.status(404).json({error: 'Заявка не найдена'});
                return;
            }

            request.status = ERequestStatus.rejected;
            await request.save();

            res.status(200).json({message: 'Заявка отклонена'});
        } catch (error) {
            res.status(500).json({error: 'Не удалось отклонить заявку'});
        }
    }
);

export default router;