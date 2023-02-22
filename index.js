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
  }
})
const data = {
  nodes: [
    {
      id: 'ethereum',
      label: 'Ethereum',
    }, {
      id: 'twitter',
      label: 'Twitter',
    }, {
      id: 'lens',
      label: 'Lens',
    }, {
      id: 'github',
      label: 'Github',
    }, {
      id: 'reddit',
      label: 'Reddit',
    }, {
      id: "keybase",
      label: "Keybase"
    },
    {
      id:"nextid",
      label:"Next.ID"
    }
  ],
  edges
}

console.log(data)

// G6 Graph
import G6 from '@antv/g6'

const graph = new G6.Graph({
  container: 'container',
  width: 500,
  height: 500,
})


graph.data(data)
graph.render()

