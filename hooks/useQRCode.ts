import qrcode from 'qrcode-generator'
import { useState } from 'react'

export const ErrorCorrectionLevelMap = {
  L: 'L(7%)',
  M: 'M(15%)',
  Q: 'Q(25%)',
  H: 'H(30%)',
}

export const ModeMap = {
  Byte: 'Byte',
  Numeric: 'Numeric',
  Alphanumeric: 'Alphanumeric',
  Kanji: 'Kanji',
}

export const MultibyteMap = {
  'default': 'none',
  'UTF-8': 'UTF-8',
}

export type MultibyteType = keyof typeof MultibyteMap

export interface QrcodeOptions {
  typeNumber: TypeNumber
  errorCorrectionLevel: ErrorCorrectionLevel
  mode: Mode
  content: string
  multibyte: MultibyteType
}

export const useQrcode = (initOptions: QrcodeOptions) => {
  const [options, setOptions] = useState(initOptions)

  qrcode.stringToBytes = qrcode.stringToBytesFuncs[options.multibyte]

  const qr = qrcode(options.typeNumber, options.errorCorrectionLevel)
  qr.addData(options.content)
  qr.make()

  return [qr, setOptions] as const
}
