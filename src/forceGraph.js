import G6 from '@antv/g6'
import { processNodesEdges, resolveGraphData } from './utils/processer'
import { request } from 'graphql-request'
import { END_POINT, GET_PROFILES_QUERY } from './utils/queries'
import { register } from './graphRegister'


register()
const indentity = '0xa75e8c75f193ee0079f6c75ca7fcbe79c40c517f'

const container = document.getElementById('container')
const width = container.scrollWidth
const height = container.scrollHeight || 500
const graph = new G6.Graph({
  container: 'container',

  defaultEdge: {
    labelCfg: {
      autoRotate: true,
      style: {
        stroke: '#fff',
        linWidth: 4,
        fill: '#263238',
        fontSize: '10px',
      },
    },
    style: {
      endArrow: {
        path: 'M 0,0 L 5,2.5 L 5,-2.5 Z',
        fill: '#cecece',
        stroke: '#cecece',
      },
    },
  },
  layout: {
    type: 'force',
    preventOverlap: true,
    linkDistance: (d) => {
      if (d.isIdentity) {
        return 120
      }
      return 30
    },
    nodeStrength: (d) => {
      if (d.isLeaf) {
        return -30
      }
      return 0
    },
    edgeStrength: (d) => {
      if (
        d.source.id === 'ethereum' ||
        d.source.id === 'twitter' ||
        d.source.id === 'lens'
      ) {
        return 1
      }
      return 0.1
    },
  },
  defaultNode: {
    color: '#5B8FF9',
  },
  modes: {
    default: ['drag-canvas'],
  },
})

processData(indentity).then((data) => {
  graph.data(data)
  graph.render()
})


graph.on('node:dragstart', function (e) {
  graph.layout()
  refreshDragedNodePosition(e)
})
graph.on('node:drag', function (e) {
  refreshDragedNodePosition(e)
})
graph.on('node:dragend', function (e) {
  e.item.get('model').fx = null
  e.item.get('model').fy = null
})

if (typeof window !== 'undefined')
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return
    if (!container || !container.scrollWidth || !container.scrollHeight) return
    graph.changeSize(container.scrollWidth, container.scrollHeight)
  }

function refreshDragedNodePosition(e) {
  const model = e.item.get('model')
  model.fx = e.x
  model.fy = e.y
}

async function processData(indentity) {
  const response = await request(END_POINT, GET_PROFILES_QUERY, {
    platform: 'ethereum',
    identity: indentity,
  })

  const graphData=  resolveGraphData(response.identity.neighborWithTraversal)
  processNodesEdges(graphData.nodes,graphData.edges)
  return graphData
  
}
