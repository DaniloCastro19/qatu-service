import { sellerApplicationRepository } from "../../dataAccessLayer/repositories/sellerAppl.repository.js";
import { userRepository } from '../../dataAccessLayer/repositories/user.repository.js';


export const sellerApplicationService = {
    async getAllApplication(page, limit) {
        return await sellerApplicationRepository.getAllApplication(page, limit);
    },

    async createApplication(data) {
        // TODO: Validate if the userID entered exists
        const application = await sellerApplicationRepository.createApplication(data);
        return application;
    },

    async updateApplication(id, data) {
        const {status, userID} = data;
        const user = userRepository.getUserById(userID);

        if (user == null){
            return null;
        }
        if (status == 'accepted'){
            //FIX: Not working, user role is not changing
            const newRoleUser = user.role = "seller";
            userRepository.updateUser(userID, newRoleUser); 
        }

        const application= await sellerApplicationRepository.updateApplication(id, data);
        
        return application;
    },
    
    async deleteApplication(id) {
        return await sellerApplicationRepository.deleteApplication(id);
    }

}