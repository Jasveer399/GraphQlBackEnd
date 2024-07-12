import UserServices, {
  createusertype,
  LoginPayload,
} from "../../services/user.services";
const queries = {
  login: async (_: any, payload: LoginPayload) => {
    const token = await UserServices.login(payload);
    return token;
  },
  getCurrentUser: async (_: any, parameters: any, context: any) => {
    console.log(context);
    if (context && context.user) {
      const id = context.user.id;
      const loginUser = await UserServices.getUserById(id);
      return loginUser;
    }
    throw new Error("Not authenticated");
  },
};
const mutations = {
  createUser: async (_: any, payload: createusertype) => {
    const res = await UserServices.createuser(payload);
    return res.id;
  },
};

export const resolvers = {
  queries,
  mutations,
};
