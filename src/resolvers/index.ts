import { mutationResolvers } from "./mutation";
import { queryResolvers } from "./query.resolvers";

export const resolvers = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
};
