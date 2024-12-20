import { authMutations } from "./auth.resolver"

export const resolvers = {
  Query: {
    getAll: () => {
      return {
        id: 1,
        name: 'John'
      }
    }
  },

  Mutation: {
    ...authMutations
  },
}