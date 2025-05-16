import SellerApplication from '../models/sellerAppl.model.js';

export const sellerApplicationRepository = {
    async getAllApplication(page, limit) { 
      const options = {
        page:page,
        limit:limit
      }
      return await SellerApplication.paginate({}, options);
    },

    async getApplicationById(id) {
      return SellerApplication.findById(id);
    },
  
    async createApplication(data) {
      const application = new SellerApplication(data);
      return await application.save();
    },

    async updateApplication(id, data) {
      return await SellerApplication.findByIdAndUpdate(id, data, { new: true });
    },

    async deleteApplication(id) {
      return await SellerApplication.findByIdAndDelete(id);
    },

};

