# Server Actions の利用

## 方針

1. サーバーサイドの処理は、基本的にはアクションとして実装する
1. 基本的にすべてのアクションで認証認可を行う
1. 公開エリアのアクションは、.lintgnore で除外する
1. アクションの実装は、{namespace}_{action} という形式で関数を定義する

## ファイル構成

```
src/lib/actions/
  ├─ public/        # 公開エリアのアクション（未認証エリアのアクション）
  ├─ .lintgnore     # 公開エリアのアクションを除外するための設定ファイル
  ├─ README.md      # このファイル
  ├─ user.ts        # ユーザーアクション
  └─ product.ts     # 商品アクション
```

## 実装例

```typescript
// src/lib/actions/user.ts
// サーバーサイド実行宣言
"use server"

// ユーザーアクション実装本体
// 4. アクションの実装は、{namespace}_{action} という形式で関数を定義する
// {namespace}_{action}形式で関数を定義する
// ユーザロールをpostgresのrolePermissionから取得し、関数名と突合して、認証認可チェックを実装する
async function user_findAll(page: number, limit: number = 10) {
  noStore()
  const offset = (page - 1) * limit
  const users = await db
    .select({
      id: systemUser.id,
      name: systemUser.name,
      email: systemUser.email,
      role: systemUser.role,
    })
    .from(systemUser)
    .limit(limit)
    .offset(offset)
    .orderBy(systemUser.id)
    .execute()

  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`🔍 Found ${users.length} users`)
  return users
}

// 2. 基本的にすべてのアクションで認証認可を行う
// withAuthentication は、認証認可チェックを行う高階関数
export const findAllWithAuth = withAuthentication(user_findAll)
```

### rolePermissionの設定

| id             | role     | type    | namespace | operation | pathname |
|----------------|----------|---------|-----------|-----------|----------|
| hPOVt529QA95Y5su | admin    | actions | .*        | .*        | NULL     |
| ffymUA5zQwL9FHt8 | user     | actions | user      | find.*    | NULL     |

* admin ロールは、すべてのアクションを実行できる
* user ロールは、user ネームスペースの find アクションのみ実行できる。

> 上記の関数名は、`user_findAll` となっているため、`find` にマッチする。