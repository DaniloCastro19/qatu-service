import ErrorModel from "../models/error.schema";

export class ErrorRepository {
    async logError(error) {
        await ErrorModel.create(error);
    }
}
