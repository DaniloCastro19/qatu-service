import { ErrorRepository } from "../../dataAccessLayer/repositories/error.repository.js";

export class LogErrorUseCase {
    constructor() {
        this.errorRepository = new ErrorRepository();
    }

    async execute(error) {
        console.log('Error being logged:', error);
        await this.errorRepository.logError(error);
    }
}
