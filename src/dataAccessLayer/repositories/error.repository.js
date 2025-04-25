import ErrorModel from "../models/error.model.js";

export class ErrorRepository {
    async logError(error) {
        console.log('Logging error:', error);
        try {
          await ErrorModel.create(error);
          console.log('Error successfully saved to DB');
        } catch (err) {
          console.error('Error while logging to DB:', err);
          throw new Error('Failed to log error in DB');
        }
      }
}
