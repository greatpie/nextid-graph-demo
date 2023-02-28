import { platformsMap } from "./map"
import _ from "lodash"

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

export { resolveGraphData }
