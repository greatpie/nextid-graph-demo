import isArray from '@antv/util/lib/is-array'
import isNumber from '@antv/util/lib/is-number'
import { colorsMap } from './utils/maps'
import G6 from '@antv/g6'

const resolvePlatformIcon = (platform) => {
  return (
    {
      twitter: '/icons/icon-twitter-w.svg',
      nextid: '/icons/icon-nextid-w.svg',
      keybase: '/icons/icon-keybase-w.svg',
      ethereum: '/icons/icon-ethereum-w.svg',
      reddit: '/icons/icon-reddit-w.svg',
      ens: '/icons/icon-ens-w.svg',
      lens: '/icons/icon-lens-w.svg',
      github: '/icons/icon-github-w.svg',
      dotbit: '/icons/icon-dotbit-w.svg',
    }[platform] || ''
  )
}

export const register = () => {
  if (G6) {
    // Custom identity node
    G6.registerNode(
      'identity-node',
      {
        draw(cfg, group) {
          let r = 20
          if (isNumber(cfg.size)) {
            r = cfg.size / 2
          } else if (isArray(cfg.size)) {
            r = cfg.size[0] / 2
          }
          const style = cfg.style || {}
          // const colorSet = cfg.colorSet || colorSets[0];

          const keyShape = group.addShape('circle', {
            attrs: {
              ...style,
              x: 0,
              y: 0,
              r,
              fill: colorsMap[cfg.platform],
              // stroke: colorsMap[cfg.platform],

              opacity: 1,
              lineWidth: 2,
              cursor: 'pointer',
            },
            name: 'aggregated-node-keyShape',
          })

          let labelStyle = {}
          if (cfg.labelCfg) {
            labelStyle = Object.assign(labelStyle, cfg.labelCfg.style)
          }

          if (cfg.label) {
            const text = cfg.label
            let labelStyle = {}
            let refY = 0
            if (cfg.labelCfg) {
              labelStyle = Object.assign(labelStyle, cfg.labelCfg.style)
              refY += cfg.labelCfg.refY || 0
            }
            let offsetY = 0
            const fontSize = labelStyle.fontSize < 8 ? 8 : labelStyle.fontSize
            const lineNum = cfg.labelLineNum || 1
            offsetY = lineNum * (fontSize || 10)
            group.addShape('text', {
              attrs: {
                text,
                x: 0,
                y: cfg.platform === 'ens' ? 28 : 16 * lineNum,
                textAlign: 'center',
                textBaseLine: 'middle',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 500,
                fill:  cfg.platform === 'ens'||cfg.platform === 'lens' ?'#000':'#fff',
                opacity: 1,
                zIndex: 999,
              },
              name: 'text-shape',
              className: 'text-shape',
            })
          }
          // tag for new node
          if (cfg.platform !== 'unknown') {
            if (cfg.isIdentity) {
              // group.addShape('circle', {
              //   attrs: {
              //     x: r - 14,
              //     y: -r + 14,
              //     r: 14,
              //     fill: colorsMap[cfg.platform],
              //     zIndex: 9,
              //   },
              //   name: 'image-shape',
              // })
              group.addShape('image', {
                attrs: {
                  x: -10,
                  y: -20,
                  width: 22,
                  height: 22,
                  img: resolvePlatformIcon(cfg.platform),
                  zIndex: 9,
                  cursor: 'pointer',
                },
                draggable: true,
                name: 'image-shape',
                className: 'image-shape',
              })
            } else {
              group.addShape('circle', {
                attrs: {
                  x: 0,
                  y: 0,
                  r: 12,
                  fill: colorsMap[cfg.platform],
                  zIndex: 9,
                },
                name: 'image-shape',
              })
              group.addShape('image', {
                attrs: {
                  x: -8,
                  y: -8,
                  width: 16,
                  height: 16,
                  img: resolvePlatformIcon(cfg.platform),
                  zIndex: 9,
                  cursor: 'pointer',
                },
                draggable: true,
                name: 'image-shape',
              })
            }
          }
          return keyShape
        },
        update: undefined,
      },
      'node'
    ) // 这样可以继承 aggregated-node 的 setState

    // todo: config the line style
  }
}
