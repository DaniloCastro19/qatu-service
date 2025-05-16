import { sellerApplicationRepository } from "../../dataAccessLayer/repositories/sellerAppl.repository.js";
import { userRepository } from '../../dataAccessLayer/repositories/user.repository.js';


export const sellerApplicationService = {
    async getAllApplication(page, limit) {
        return await sellerApplicationRepository.getAllApplication(page, limit);
    },

    async createApplication(data) {
        // TODO: Validate if the userID entered exists
        const user = await userRepository.getUserById(data.userID);
        if (!user){
            return null;
        }
        if(user.role !== 'customer'){
            return null;
        }
        const application = await sellerApplicationRepository.createApplication(data);
        return application;
    },

    async updateApplication(id, data) {
        const {status} = data;
        const application = await sellerApplicationRepository.getApplicationById(id);
        if(!application){
            return null;
        }

        if (status === 'accepted'){
            const userID = application.userID;
            
            const user = await userRepository.getUserById(userID);
            if (!user){
                return null;
            }
            await userRepository.updateUser(userID, {role: 'seller'});

        }

        const updated= await sellerApplicationRepository.updateApplication(id, data);
        return updated;
    },
    
    async deleteApplication(id) {
        return await sellerApplicationRepository.deleteApplication(id);
    }

}