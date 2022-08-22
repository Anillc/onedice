# @onedice/core

该库实现了 [onedice](https://github.com/OlivOS-Team/onedice) 标准。

## 安装

```bash
yarn add @onedice/core     # npm install @onedice/core
```

## 示例

```typescript
import { dice } from '@onedice/core'

const [value, root] = dice('(7a3)d(5d(2^2)k3+5f+{qwq})+d', {
  env: {
    qwq: 'd'
  }
})
const details = root.toString()
// value: 133
// details: `{
//   A: ({
//     A: 7, B: 3, C: 8, E: 10
//     rounds: {
//       {<[9]>, <6>, <3>, 1, <[9]>, <3>, <[10]>}
//       {<6>, <6>, <[8]>, 1, <5>, <[10]>}
//       {<[10]>, <4>, <4>, <3>, <[8]>}
//       {<5>, <[9]>, <7>, <[8]>, 1}
//       {<5>, <[9]>, <[8]>, <7>}
//       {<5>, <[10]>, <3>, <[9]>}
//       {<7>, <[8]>, <[8]>, <3>}
//       {<6>, <3>, 1, <6>}
//       {1, <7>, 1}
//       {2}
//     }
//   }(3 + 2 + 2 + 2 + 2 + 2 + 2 + 0 + 0 + 0)(15)), B: ({1, 2, [3], [3], [4]}(10) + {1, -1, 1, 0, 0}(1) + ((2))), C: 15, D: 0
//   roll: [10, 11, 11, 12, 2, 2, 2, 2, 3, 4, 5, 5, 7, 7, 8]
// }(91) + (42)`
```