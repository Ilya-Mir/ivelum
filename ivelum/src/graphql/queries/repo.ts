import {gql} from '@apollo/client';

export const TEST_QUERY = gql`
  query TestQuery {
    viewer {
      login
      avatarUrl
    }
  }
`;

export const REPO_FILE = gql`
query { 
  repository(name: "node-test-repo", owner: "Ilya-Mir") {
    object(expression: "main:router.js") {
      ... on Blob {
        oid
        byteSize
        text
      }
    }
  }
}
`
export const REPO_QUERY = gql`
query GetPublicRepositories {
  user(login: "Ilya-Mir") {
    repository(name: "node-test-repo") {
      object(expression: "main:src/") {
        ... on Tree {
          entries {
            name
            type
          }
        }
      }
    }
  }
}
`;
export const REPOS_QUERY = gql`
query GetPublicRepositories {
  user(login: "Ilya-Mir") { # Укажите здесь имя пользователя
    repositories(first: 10, isFork: false, privacy: PUBLIC, ownerAffiliations: OWNER) {
      nodes {
        name
        defaultBranchRef {
          target {
            ... on Commit {
              tree {
                entries {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
`
