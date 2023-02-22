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

request('https://relation-service.next.id/', query).then((data) =>
  console.log(data)

)


//antv congigs
import { G6 } from '@antv/g6'
const container = document.getElementById('container');
const width = container.scrollWidth;
const height = container.scrollHeight || 500;
const graph = new G6.Graph({
  container: 'container',
  width,
  height,
  layout: {
    type: 'force',
  },
  defaultNode: {
    size: 15,
  },
});


graph.data({
  nodes: data.nodes,
  edges: data.edges.map(function (edge, i) {
    edge.id = 'edge' + i;
    return Object.assign({}, edge);
  }),
});
graph.render();

graph.on('node:dragstart', function (e) {
  graph.layout();
  refreshDragedNodePosition(e);
});
graph.on('node:drag', function (e) {
  const forceLayout = graph.get('layoutController').layoutMethods[0];
  forceLayout.execute();
  refreshDragedNodePosition(e);
});
graph.on('node:dragend', function (e) {
  e.item.get('model').fx = null;
  e.item.get('model').fy = null;
});

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };

function refreshDragedNodePosition(e) {
  const model = e.item.get('model');
  model.fx = e.x;
  model.fy = e.y;
}

