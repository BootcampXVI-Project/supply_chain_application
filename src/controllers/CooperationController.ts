import {
	createNewCooperation,
	deleteCooperationById,
	getAllCooperations,
	getCooperationByCooperationId,
	updateCooperation
} from "../services/crudDatabase/cooperation";
import { Request, Response } from "express";

const CooperationController = {
	createCooperation: async (req: Request, res: Response) => {
		try {
			const cooperationObj = req.body.cooperationObj;
			const createdCooperation = await createNewCooperation(cooperationObj);

			switch (createdCooperation.message) {
				case "longitude-latitude-existed": {
					return res.json({
						data: null,
						message: createdCooperation.message,
						error: createdCooperation.message
					});
				}
				case "failed": {
					return res.json({
						data: null,
						message: createdCooperation.message,
						error: null
					});
				}
				case "successfully": {
					return res.json({
						data: createdCooperation.data,
						message: "successfully",
						error: null
					});
				}
			}
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	getAllCooperations: async (req: Request, res: Response) => {
		try {
			const cooperations = await getAllCooperations();

			return res.json({
				data: cooperations,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	getCooperation: async (req: Request, res: Response) => {
		try {
			const cooperationId = String(req.query.cooperationId);
			const cooperation = await getCooperationByCooperationId(cooperationId);

			return res.json({
				data: cooperation,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	updateCooperation: async (req: Request, res: Response) => {
		try {
			const cooperationId = req.params.cooperationId;
			const newCooperation = req.body.cooperationObj;

			const cooperation = await updateCooperation(
				cooperationId,
				newCooperation
			);

			return res.json({
				data: cooperation,
				message: "successfully",
				error: null
			});
		} catch (error) {
			return res.json({
				data: null,
				message: "failed",
				error: error
			});
		}
	},

	deleteCooperation: async (req: Request, res: Response) => {
		try {
			const cooperationId = req.params.cooperationId;
			const cooperation = await deleteCooperationById(cooperationId);

			return res.json({
				status: "Success",
				error: null,
				data: cooperation
			});
		} catch (error) {}
	}
};

export default CooperationController;
