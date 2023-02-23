import { request, gql } from 'graphql-request'

const query = gql`
  query findOneIdentity {
    identity(
      platform: "ethereum"
      identity: "0xa75e8c75f193ee0079f6c75ca7fcbe79c40c517f"
    ) {
      status
      uuid
      displayName
      createdAt
      addedAt
      updatedAt
      # Here we perform a 3-depth deep search for this identity's "neighbor".
      neighborWithTraversal(depth: 3) {
        source # Which upstream provides this connection info.
        from {
          uuid
          platform
          identity
          displayName
        }
        to {
          uuid
          platform
          identity
          displayName
        }
      }
    }
  }
`

const response = await request('https://relation-service.next.id/', query)
const edges = response.identity.neighborWithTraversal.map(item => {
    return {
        source: item.from.platform,
        target: item.to.platform,
        value: Math.round(Math.random() * 9) + 1,
    }
})
const data = {
    nodes: [
        {
            id: 'ethereum',
            group: 0,
        }, {
            id: 'twitter',
            group: 1,
        }, {
            id: 'lens',
            group: 2,
        }, {
            id: 'github',
            group: 3,
        }, {
            id: 'reddit',
            group: 4,
        }, {
            id: "keybase",
            group: 5,
        },
        {
            id: "nextid",
            group: 6,
        }
    ],
    edges
}
console.log(JSON.stringify(data))