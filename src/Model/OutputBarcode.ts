import type { FieldSchema } from '../util/json/schema.js';

export class OutputBarcode {
  BarcodeType?: string;
  BarcodeValue?: string;
  QRCodeBinaryValue?: string;
  QRCodeVersion?: string;
  QRCodeEncodingMode?: string;
  QRCodeErrorCorrection?: string;
  static readonly __schema: readonly FieldSchema[] = [
    { name: 'BarcodeType' },
    { name: 'BarcodeValue' },
    { name: 'QRCodeBinaryValue' },
    { name: 'QRCodeVersion' },
    { name: 'QRCodeEncodingMode' },
    { name: 'QRCodeErrorCorrection' },
  ];
}
