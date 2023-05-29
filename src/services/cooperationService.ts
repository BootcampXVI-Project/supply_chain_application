import { Cooperation } from "../types/models";
import { CooperationModel } from "../models/CooperationModel";
import { UserModel } from "../models/UserModel";

export const getAllCooperations = async () => {
	return await CooperationModel.find({}).lean();
};

export const getCooperationByCooperationId = async (cooperationId: string) => {
	return await CooperationModel.findOne({ cooperationId: cooperationId })
		.select("-__v -_id -createdAt -updatedAt")
		.lean();
};

export const checkExistedLongitudeLatitude = async (
	longitude: string,
	latitude: string
) => {
	const isExisted = await CooperationModel.exists({
		longitude: longitude,
		latitude: latitude
	});
	return Boolean(isExisted);
};

export const checkExistedFounder = async (founderId: string) => {
	const isExisted = await UserModel.exists({
		userId: founderId
	});
	return Boolean(isExisted);
};

export const createNewCooperation = async (cooperation: Cooperation) => {
	try {
		const isExistedLongitudeLatitude: boolean =
			await checkExistedLongitudeLatitude(
				cooperation.longitude,
				cooperation.latitude
			);
		if (isExistedLongitudeLatitude) {
			return {
				data: {},
				message: "longitude-latitude-existed"
			};
		}
		const isExistedFounder: boolean = await checkExistedFounder(
			cooperation.founderId
		);
		if (!isExistedFounder) {
			return {
				data: {},
				message: "founder-is-not-existed"
			};
		}
		const createdCooperation = await CooperationModel.create(cooperation)
			.then((data) => {
				console.log(data);
				return {
					data: data,
					message: "successfully"
				};
			})
			.catch((error) => {
				console.log(error);
				return {
					data: null,
					message: "failed"
				};
			});

		return createdCooperation;
	} catch (error) {
		return {
			data: null,
			message: "failed"
		};
	}
};

export const updateCooperation = async (
	cooperationId: string,
	newCooperation: Cooperation
) => {
	try {
		const updatedCooperation = await CooperationModel.findOneAndUpdate(
			{ cooperationId: cooperationId },
			newCooperation,
			{ new: true }
		)
			.then((data) => {
				console.log(data);
				return {
					data: data,
					message: "successfully"
				};
			})
			.catch((error) => {
				console.log(error);
				return {
					data: null,
					message: error
				};
			});
		return updatedCooperation;
	} catch (error) {
		return {
			data: null,
			message: "failed"
		};
	}
};

export const deleteCooperationById = async (cooperationId: string) => {
	try {
		const deletedCooperation = await CooperationModel.findOneAndDelete({
			cooperationId: cooperationId
		})
			.then((response) => {
				console.log(response);
				return {
					data: response,
					message: "successfully"
				};
			})
			.catch((error) => {
				console.log(error);
				return {
					data: null,
					message: error
				};
			});

		return deletedCooperation;
	} catch (error) {
		return {
			data: null,
			message: "failed"
		};
	}
};
