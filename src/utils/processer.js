import _ from 'lodash'

import { platformsMap,colorsMap} from './maps'

const resolveGraphData = (source) => {
  const nodes = []
  const edges = []
  source.forEach((x, idx) => {
    const from = x.from
    const to = x.to
    nodes.push({
      id: to.uuid,
      label: formatText(to.displayName ?? to.identity),
      platform: to.platform,
      source: x.source,
      displayName: to.displayName,
      identity: to.identity,
      isIdentity: true,
    })
    nodes.push({
      id: from.uuid,
      label: formatText(from.displayName ?? from.identity),
      platform: from.platform,
      source: x.source,
      displayName: from.displayName,
      identity: from.identity,
      isIdentity: true,
    })
    edges.push({
      source: from.uuid,
      target: to.uuid,
      label: platformsMap[x.source],
      id: `${from.uuid}-${to.uuid}`,
      isIdentity: true,
    })
    from.nft.forEach((k) => {
      if (k.category === 'ENS') {
        nodes.push({
          id: k.uuid,
          label: k.id,
          category: k.category,
          chain: k.chain,
          holder: from.identity,
          identity: k.id,
          platform: 'ens',
        })
        edges.push({
          source: from.uuid,
          target: k.uuid,
          // label: "hold",
          id: `${from.uuid}-${k.uuid}`,
        })
      }
    })
    to.nft.forEach((k) => {
      if (k.category === 'ENS') {
        nodes.push({
          id: k.uuid,
          label: k.id,
          category: k.category,
          chain: k.chain,
          holder: to.identity,
          platform: 'ens',
        })
        edges.push({
          source: to.uuid,
          target: k.uuid,
          // label: "hold",
          id: `${to.uuid}-${k.uuid}`,
        })
      }
    })
  })

  const _nodes = _.uniqBy(nodes, 'id')
  const _edges = _.uniqBy(edges, 'id')
  return { nodes: _nodes, edges: _edges }
}

const formatText = (string, length) => {
  const len = length ?? 12
  if (string.length <= len) {
    return string
  }
  if (string.startsWith('0x')) {
    const oriAddr = string,
      chars = 4
    return `${oriAddr.substring(0, chars + 2)}...${oriAddr.substring(
      oriAddr.length - chars
    )}`
  } else {
    if (string.length > len) {
      return `${string.substr(0, len)}...`
    }
  }
  return string
}

const processNodesEdges = (nodes, edges) => {
  // todo: processs edges and nodes
  nodes.forEach((node) => {
    if (node.isIdentity) {
      // Identity
      node.size = 96
      node.style = {
        lineWidth: 2,
      }
      node.stateStyles = {
        selected: {
          stroke: colorsMap[node.platform],
          fill: colorsMap[node.platform],
          fillOpacity: 0.1,
          lineWidth: 2,
          shadowColor: 'transparent',
          zIndex: 999,
        },
      }
    } else {
      // ENS
      node.size = 24
      node.labelCfg = {
        labelLineNum: 1,
        position: 'bottom',
      }
      node.style = {
        lineWidth: 2,
        fill: colorsMap[node.platform],
        stroke: 'rgba(0, 0, 0, .05)',
      }
      node.stateStyles = {
        selected: {
          lineWidth: 2,
          shadowColor: 'transparent',
          zIndex: 999,
        },
      }
    }
    node.type = 'identity-node'
    node.label = formatText(node.label)
    if (node.platform && node.platform.toLowerCase() === 'ethereum') {
      node.label = `${node.displayName || formatText(node.identity)} ${
        node.displayName ? `\n${formatText(node.identity)}` : ''
      }`
      node.labelLineNum = node.displayName ? 2 : 1
    }
  })
  edges.forEach((edge) => {
    if (edge.isIdentity) {
      // Identity
      edge.type = 'quadratic'
      edge.curveOffset = 0
      edge.stateStyles = {
        selected: {
          stroke: '#cecece',
          shadowColor: 'transparent',
          zIndex: 999,
        },
      }
    } else {
      // ENS
      edge.type = 'line'
      edge.stateStyles = {
        selected: {
          stroke: '#cecece',
          shadowColor: 'transparent',
          zIndex: 999,
        },
      }
    }
  })
  // G6.Util.processParallelEdges(edges);
}

export { resolveGraphData, processNodesEdges }
