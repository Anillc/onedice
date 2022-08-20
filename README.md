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
// value: 177
// root:
//   SimpleNode {
//     operator: '+',
//     left: DNode {
//       a: BracketNode { inner: [ANode], evaluation: [Object] },
//       b: BracketNode { inner: [SimpleNode], evaluation: [Object] },
//       c: undefined,
//       d: undefined,
//       e: undefined,
//       kq: null,
//       pb: null,
//       evaluation: {
//         a: 8,
//         b: 34,
//         c: 8,
//         d: 0,
//         e: null,
//         kq: null,
//         pb: null,
//         expression: '8d34',
//         aEvaluation: null,
//         pbEvaluations: null,
//         roll: [Array],
//         value: 98
//       }
//     },
//     right: DNode {
//       a: null,
//       b: null,
//       c: undefined,
//       d: undefined,
//       e: undefined,
//       kq: null,
//       pb: null,
//       evaluation: {
//         a: 1,
//         b: 100,
//         c: 1,
//         d: 0,
//         e: null,
//         kq: null,
//         pb: null,
//         expression: '1d100',
//         aEvaluation: null,
//         pbEvaluations: null,
//         roll: [Array],
//         value: 79
//       }
//     },
//     evaluation: { left: 98, right: 79, operator: '+', value: 177 }
//   }
```