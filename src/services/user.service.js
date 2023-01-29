import createApiClient from "./api.service";
import "../services/common.js";
class UserService {
  constructor(baseUrl = "http://localhost:3000/api/auth/user") {
    this.api = createApiClient(baseUrl);
  }

  async getPagination() {
    return (await this.api.get("/pagination")).data;
  }
  async getOne(id) {
    return (await this.api.get(`/detail/${id}`)).data;
  }
}

export default new UserService();
