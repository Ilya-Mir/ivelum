import React from "react"
import App from "./App";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const Provider = () => {
  const client = new ApolloClient({
    uri: "https://api.github.com/graphql",
    headers: {
      Authorization: `bearer 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`,
    },
    cache: new InMemoryCache()
  })
  return <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
}

export default Provider
