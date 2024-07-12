import { mutationTypeDefs } from "./mutations";
import { queries } from "./queries";
import { resolvers } from "./resolvers";
import { typedef } from "./typedef";

export const User = { typedef, mutationTypeDefs, queries, resolvers };
