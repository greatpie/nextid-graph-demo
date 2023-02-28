import G6 from '@antv/g6'
import { resolveGraphData } from './utils'
import { request } from 'graphql-request'
import { END_POINT, GET_PROFILES_QUERY, GET_PROFILES_DOMAIN } from './queries'

const indentity = '0x0bd793ea8334a77b2bfd604dbaedca11ea094306'

const container = document.getElementById('container')
const width = container.scrollWidth
const height = container.scrollHeight || 500
const graph = new G6.Graph({
  container: 'container',
  width,
  height,
  layout: {
    type: 'force',
    preventOverlap: true,
    linkDistance: (d) => {
      if (d.source.id === 'ethereum') {
        return 150
      }
      return 100
    },
    nodeStrength: (d) => {
      if (d.isLeaf) {
        return -50
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

  const rawData = response.identity.neighborWithTraversal

  return resolveGraphData(rawData)
  // const edges = response.identity.neighborWithTraversal.map((item) => {
  //   return {
  //     source: item.from.platform,
  //     target: item.to.platform,
  //     type: 'quadratic',
  //     label: item.source,
  //     style:{
  //       endArrow: true,
  //     }
  //   }
  // })
  // const data = {
  //   nodes: [
  //     {
  //       id: 'ethereum',
  //       size: 60,
  //       label: 'Ethereum',
  //     },
  //     {
  //       id: 'twitter',
  //       size: 40,
  //       label: 'Twitter',
  //     },
  //     {
  //       id: 'lens',
  //       size: 40,
  //       label: 'Lens',
  //     },
  //     {
  //       id: 'github',
  //       size: 40,
  //       label: 'Github',
  //     },
  //     {
  //       id: 'reddit',
  //       size: 40,
  //       label: 'Reddit',
  //     },
  //     {
  //       id: 'keybase',
  //       size: 40,
  //       label: 'Keybase',
  //     },
  //     {
  //       id: 'nextid',
  //       size: 40,
  //       label: 'NextID',
  //     },
  //   ],
  //   edges,
  // }
  // return data
}
