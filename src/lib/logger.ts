import pino from "pino"

// カスタムログメッセージの型定義
interface CustomLogMessage {
  object?: any
  message: string
}

const Hidden = "[******]"

// Pinoロガーの設定
const logger = pino({
  serializers: {
    object: (obj) => {
      return {
        ...obj,
        name: Hidden,
        email: Hidden,
        access_token: Hidden,
        refresh_token: Hidden,
        password: Hidden,
        tel: Hidden,
      }
    },
  },
})

// ログを出力する関数（カスタム型を使用）
function logMessage(logData: CustomLogMessage) {
  logger.info(logData)
}

export { logMessage }
