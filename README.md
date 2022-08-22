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
// value: 353
// details: `{
//   A: ({
//     A: 7, B: 3, C: 8, E: 10
//     rounds: {
//       {<[10]>, <4>, 2, <6>, <[9]>, 1, <[10]>}
//       {<5>, <[10]>, <5>, <4>, <5>}
//       {<[9]>, <[9]>, 1, <[10]>, <6>}
//       {1, <5>, <[8]>, 2}
//       {<5>, <3>}
//       {<[8]>, <4>}
//       {2, 2}
//     }
//   }(3 + 1 + 3 + 1 + 0 + 1 + 0)(9)), B: ({1, 2, [2], [4], [4]}(10) + {-1, 1, 0, -1, 1}(0) + ((69))), C: 9, D: 0, 
//   roll: [10, 23, 24, 3, 33, 42, 44, 45, 75]
// }(299) + (54)`
```