import { defineEnum, type EnumDef } from '../util/json/enums.js';

// Each enum is exported as:
//   - a string-literal union type
//   - a `const` object with every member (for `MessageClass.Service` style access)
//   - an `EnumDef` (`<Name>Enum`) used by the JSON serializer/parser
//
// EnumMember(Value = "...") overrides from C# Types.cs are preserved by passing
// `overrides` to defineEnum. Unknown wire values fall back to "Unknown" (or to
// the first value where Unknown is absent), matching StringEnumConverterWithDefault.

// ---------- MessageClass / MessageCategory / MessageType ----------

export type MessageClass = 'Unknown' | 'Service' | 'Device' | 'Event';
export const MessageClass = {
  Unknown: 'Unknown',
  Service: 'Service',
  Device: 'Device',
  Event: 'Event',
} as const satisfies Record<MessageClass, MessageClass>;
export const MessageClassEnum: EnumDef<MessageClass> = defineEnum('MessageClass', [
  'Unknown',
  'Service',
  'Device',
  'Event',
]);

export type MessageCategory =
  | 'Unknown'
  | 'Abort'
  | 'Admin'
  | 'BalanceInquiry'
  | 'Batch'
  | 'CardAcquisition'
  | 'CardReaderAPDU'
  | 'CardReaderInit'
  | 'CardReaderPowerOff'
  | 'Diagnosis'
  | 'Display'
  | 'EnableService'
  | 'Event'
  | 'GetTotals'
  | 'Input'
  | 'InputUpdate'
  | 'Login'
  | 'Logout'
  | 'Loyalty'
  | 'Payment'
  | 'PIN'
  | 'Print'
  | 'Reconciliation'
  | 'Reversal'
  | 'Sound'
  | 'StoredValue'
  | 'TransactionReport'
  | 'TransactionStatus'
  | 'Transmit';
export const MessageCategory = {
  Unknown: 'Unknown',
  Abort: 'Abort',
  Admin: 'Admin',
  BalanceInquiry: 'BalanceInquiry',
  Batch: 'Batch',
  CardAcquisition: 'CardAcquisition',
  CardReaderAPDU: 'CardReaderAPDU',
  CardReaderInit: 'CardReaderInit',
  CardReaderPowerOff: 'CardReaderPowerOff',
  Diagnosis: 'Diagnosis',
  Display: 'Display',
  EnableService: 'EnableService',
  Event: 'Event',
  GetTotals: 'GetTotals',
  Input: 'Input',
  InputUpdate: 'InputUpdate',
  Login: 'Login',
  Logout: 'Logout',
  Loyalty: 'Loyalty',
  Payment: 'Payment',
  PIN: 'PIN',
  Print: 'Print',
  Reconciliation: 'Reconciliation',
  Reversal: 'Reversal',
  Sound: 'Sound',
  StoredValue: 'StoredValue',
  TransactionReport: 'TransactionReport',
  TransactionStatus: 'TransactionStatus',
  Transmit: 'Transmit',
} as const satisfies Record<MessageCategory, MessageCategory>;
export const MessageCategoryEnum: EnumDef<MessageCategory> = defineEnum('MessageCategory', [
  'Unknown',
  'Abort',
  'Admin',
  'BalanceInquiry',
  'Batch',
  'CardAcquisition',
  'CardReaderAPDU',
  'CardReaderInit',
  'CardReaderPowerOff',
  'Diagnosis',
  'Display',
  'EnableService',
  'Event',
  'GetTotals',
  'Input',
  'InputUpdate',
  'Login',
  'Logout',
  'Loyalty',
  'Payment',
  'PIN',
  'Print',
  'Reconciliation',
  'Reversal',
  'Sound',
  'StoredValue',
  'TransactionReport',
  'TransactionStatus',
  'Transmit',
]);

export type MessageType = 'Unknown' | 'Request' | 'Response' | 'Notification';
export const MessageType = {
  Unknown: 'Unknown',
  Request: 'Request',
  Response: 'Response',
  Notification: 'Notification',
} as const satisfies Record<MessageType, MessageType>;
export const MessageTypeEnum: EnumDef<MessageType> = defineEnum('MessageType', [
  'Unknown',
  'Request',
  'Response',
  'Notification',
]);

// ---------- Result / TerminalEnvironment / SaleCapability ----------

export type Result = 'Unknown' | 'Success' | 'Failure' | 'Partial';
export const Result = {
  Unknown: 'Unknown',
  Success: 'Success',
  Failure: 'Failure',
  Partial: 'Partial',
} as const satisfies Record<Result, Result>;
export const ResultEnum: EnumDef<Result> = defineEnum('Result', [
  'Unknown',
  'Success',
  'Failure',
  'Partial',
]);

export type TerminalEnvironment = 'Unknown' | 'Attended' | 'SemiAttended' | 'Unattended';
export const TerminalEnvironment = {
  Unknown: 'Unknown',
  Attended: 'Attended',
  SemiAttended: 'SemiAttended',
  Unattended: 'Unattended',
} as const satisfies Record<TerminalEnvironment, TerminalEnvironment>;
export const TerminalEnvironmentEnum: EnumDef<TerminalEnvironment> = defineEnum(
  'TerminalEnvironment',
  ['Unknown', 'Attended', 'SemiAttended', 'Unattended'],
);

export type SaleCapability =
  | 'Unknown'
  | 'CashierStatus'
  | 'CashierError'
  | 'CashierInput'
  | 'CustomerAssistance'
  | 'PrinterReceipt';
export const SaleCapability = {
  Unknown: 'Unknown',
  CashierStatus: 'CashierStatus',
  CashierError: 'CashierError',
  CashierInput: 'CashierInput',
  CustomerAssistance: 'CustomerAssistance',
  PrinterReceipt: 'PrinterReceipt',
} as const satisfies Record<SaleCapability, SaleCapability>;
export const SaleCapabilityEnum: EnumDef<SaleCapability> = defineEnum('SaleCapability', [
  'Unknown',
  'CashierStatus',
  'CashierError',
  'CashierInput',
  'CustomerAssistance',
  'PrinterReceipt',
]);

// ---------- GenericProfile / ServiceProfile / TokenRequestedType ----------

export type GenericProfile = 'Unknown' | 'Basic' | 'Standard' | 'Extended' | 'Custom';
export const GenericProfile = {
  Unknown: 'Unknown',
  Basic: 'Basic',
  Standard: 'Standard',
  Extended: 'Extended',
  Custom: 'Custom',
} as const satisfies Record<GenericProfile, GenericProfile>;
export const GenericProfileEnum: EnumDef<GenericProfile> = defineEnum('GenericProfile', [
  'Unknown',
  'Basic',
  'Standard',
  'Extended',
  'Custom',
]);

export type ServiceProfile =
  | 'Unknown'
  | 'Synchro'
  | 'Standard'
  | 'OneTimeRes'
  | 'Reservation'
  | 'Loyalty'
  | 'StoredValue'
  | 'PIN'
  | 'CardReader'
  | 'Sound'
  | 'Communication';
export const ServiceProfileEnum: EnumDef<ServiceProfile> = defineEnum('ServiceProfile', [
  'Unknown',
  'Synchro',
  'Standard',
  'OneTimeRes',
  'Reservation',
  'Loyalty',
  'StoredValue',
  'PIN',
  'CardReader',
  'Sound',
  'Communication',
]);

export type TokenRequestedType = 'Unknown' | 'Transaction' | 'Customer';
export const TokenRequestedType = {
  Unknown: 'Unknown',
  Transaction: 'Transaction',
  Customer: 'Customer',
} as const satisfies Record<TokenRequestedType, TokenRequestedType>;
export const TokenRequestedTypeEnum: EnumDef<TokenRequestedType> = defineEnum('TokenRequestedType', [
  'Unknown',
  'Transaction',
  'Customer',
]);

// ---------- UnitOfMeasure / WeightUnitOfMeasure ----------

const UNIT_OF_MEASURE_VALUES = [
  'Unknown',
  'Case',
  'Foot',
  'UKGallon',
  'USGallon',
  'Gram',
  'Kilogram',
  'Pound',
  'Meter',
  'Centimetre',
  'Litre',
  'Centilitre',
  'Ounce',
  'Quart',
  'Pint',
  'Mile',
  'Kilometre',
  'Yard',
  'Other',
  'Unit',
] as const;
export type UnitOfMeasure = (typeof UNIT_OF_MEASURE_VALUES)[number];
export const UnitOfMeasureEnum: EnumDef<UnitOfMeasure> = defineEnum(
  'UnitOfMeasure',
  UNIT_OF_MEASURE_VALUES,
);

export type WeightUnitOfMeasure = (typeof UNIT_OF_MEASURE_VALUES)[number];
export const WeightUnitOfMeasureEnum: EnumDef<WeightUnitOfMeasure> = defineEnum(
  'WeightUnitOfMeasure',
  UNIT_OF_MEASURE_VALUES,
);

// ---------- PaymentInstrumentType / PaymentType / OutputFormat ----------

export type PaymentInstrumentType =
  | 'Unknown'
  | 'Card'
  | 'Check'
  | 'Mobile'
  | 'StoredValue'
  | 'Cash'
  | 'PayOnOtherTerminal';
export const PaymentInstrumentType = {
  Unknown: 'Unknown',
  Card: 'Card',
  Check: 'Check',
  Mobile: 'Mobile',
  StoredValue: 'StoredValue',
  Cash: 'Cash',
  PayOnOtherTerminal: 'PayOnOtherTerminal',
} as const satisfies Record<PaymentInstrumentType, PaymentInstrumentType>;
export const PaymentInstrumentTypeEnum: EnumDef<PaymentInstrumentType> = defineEnum(
  'PaymentInstrumentType',
  [
    'Unknown',
    'Card',
    'Check',
    'Mobile',
    'StoredValue',
    'Cash',
    'PayOnOtherTerminal',
  ],
);

export type PaymentType =
  | 'Unknown'
  | 'Normal'
  | 'Refund'
  | 'CashAdvance'
  | 'FirstReservation'
  | 'UpdateReservation'
  | 'Completion';
export const PaymentType = {
  Unknown: 'Unknown',
  Normal: 'Normal',
  Refund: 'Refund',
  CashAdvance: 'CashAdvance',
  FirstReservation: 'FirstReservation',
  UpdateReservation: 'UpdateReservation',
  Completion: 'Completion',
} as const satisfies Record<PaymentType, PaymentType>;
export const PaymentTypeEnum: EnumDef<PaymentType> = defineEnum('PaymentType', [
  'Unknown',
  'Normal',
  'Refund',
  'CashAdvance',
  'FirstReservation',
  'UpdateReservation',
  'Completion',
]);

export type OutputFormat = 'Unknown' | 'MessageRef' | 'Text' | 'XHTML' | 'Barcode';
export const OutputFormat = {
  Unknown: 'Unknown',
  MessageRef: 'MessageRef',
  Text: 'Text',
  XHTML: 'XHTML',
  Barcode: 'Barcode',
} as const satisfies Record<OutputFormat, OutputFormat>;
export const OutputFormatEnum: EnumDef<OutputFormat> = defineEnum('OutputFormat', [
  'Unknown',
  'MessageRef',
  'Text',
  'XHTML',
  'Barcode',
]);

// ---------- CustomerOrderReq / CurrencySymbol ----------

export type CustomerOrderReq = 'Unknown' | 'Open' | 'Closed' | 'Both';
export const CustomerOrderReqEnum: EnumDef<CustomerOrderReq> = defineEnum('CustomerOrderReq', [
  'Unknown',
  'Open',
  'Closed',
  'Both',
]);

export type CurrencySymbol = 'Unknown' | 'AUD';
export const CurrencySymbol = {
  Unknown: 'Unknown',
  AUD: 'AUD',
} as const satisfies Record<CurrencySymbol, CurrencySymbol>;
export const CurrencySymbolEnum: EnumDef<CurrencySymbol> = defineEnum('CurrencySymbol', [
  'Unknown',
  'AUD',
]);

// ---------- PaymentBrand (with many EnumMember overrides) ----------

export type PaymentBrand =
  | 'Unknown'
  | 'VISA'
  | 'MasterCard'
  | 'AmericanExpress'
  | 'DinersClub'
  | 'JCB'
  | 'UnionPay'
  | 'CUPDebit'
  | 'Discover'
  | 'AliPay'
  | 'WeChatPay'
  | 'Card'
  | 'CryptoDotCom'
  | 'Other'
  | 'Fastcard'
  | 'eTicket'
  | 'DigitalPass'
  | 'NSWTSS'
  | 'QLDTSS'
  | 'ACTTSS'
  | 'VICTSS'
  | 'TASTSS'
  | 'NTTSS'
  | 'BPGiftCard'
  | 'BPFuelCard'
  | 'FleetCard'
  | 'ShellCard'
  | 'Motorpass'
  | 'AmpolCard'
  | 'FreedomFuelCard'
  | 'TrinityFuelCard'
  | 'LibertyCard'
  | 'CaltexStarCard'
  | 'UnitedFuelCard'
  | 'Flybuys'
  | 'Blackhawk'
  | 'ePay'
  | 'Incomm'
  | 'Vii'
  | 'WEX';
export const PaymentBrandEnum: EnumDef<PaymentBrand> = defineEnum(
  'PaymentBrand',
  [
    'Unknown',
    'VISA',
    'MasterCard',
    'AmericanExpress',
    'DinersClub',
    'JCB',
    'UnionPay',
    'CUPDebit',
    'Discover',
    'AliPay',
    'WeChatPay',
    'Card',
    'CryptoDotCom',
    'Other',
    'Fastcard',
    'eTicket',
    'DigitalPass',
    'NSWTSS',
    'QLDTSS',
    'ACTTSS',
    'VICTSS',
    'TASTSS',
    'NTTSS',
    'BPGiftCard',
    'BPFuelCard',
    'FleetCard',
    'ShellCard',
    'Motorpass',
    'AmpolCard',
    'FreedomFuelCard',
    'TrinityFuelCard',
    'LibertyCard',
    'CaltexStarCard',
    'UnitedFuelCard',
    'Flybuys',
    'Blackhawk',
    'ePay',
    'Incomm',
    'Vii',
    'WEX',
  ],
  {
    overrides: {
      AmericanExpress: 'American Express',
      DinersClub: 'Diners Club',
      CUPDebit: 'CUP Debit',
      WeChatPay: 'WeChat Pay',
      DigitalPass: 'Digital Pass',
      NSWTSS: 'NSW TSS',
      QLDTSS: 'QLD TSS',
      ACTTSS: 'ACT TSS',
      VICTSS: 'VIC TSS',
      TASTSS: 'TAS TSS',
      NTTSS: 'NT TSS',
      BPFuelCard: 'BP Fuel Card',
      FleetCard: 'Fleet Card',
      ShellCard: 'Shell Card',
      FreedomFuelCard: 'Freedom Fuel Card',
      TrinityFuelCard: 'Trinity Fuel Card',
      LibertyCard: 'Liberty Card',
      CaltexStarCard: 'Caltex StarCard',
      UnitedFuelCard: 'United Fuel Card',
    },
  },
);

// ---------- EntryMode / ForceEntryMode (identical values, distinct enums) ----------

const ENTRY_MODE_VALUES = [
  'Unknown',
  'RFID',
  'Keyed',
  'Manual',
  'File',
  'Scanned',
  'MagStripe',
  'ICC',
  'SynchronousICC',
  'Tapped',
  'Contactless',
  'Mobile',
] as const;
export type EntryMode = (typeof ENTRY_MODE_VALUES)[number];
export const EntryMode = Object.fromEntries(
  ENTRY_MODE_VALUES.map((v) => [v, v]),
) as { [K in EntryMode]: K };
export const EntryModeEnum: EnumDef<EntryMode> = defineEnum('EntryMode', ENTRY_MODE_VALUES);

export type ForceEntryMode = (typeof ENTRY_MODE_VALUES)[number];
export const ForceEntryModeEnum: EnumDef<ForceEntryMode> = defineEnum(
  'ForceEntryMode',
  ENTRY_MODE_VALUES,
);

// ---------- AuthenticationMethod ----------

export type AuthenticationMethod =
  | 'Unknown'
  | 'Bypass'
  | 'ManualVerification'
  | 'MerchantAuthentication'
  | 'OfflinePIN'
  | 'OnLinePIN'
  | 'PaperSignature'
  | 'SecuredChannel'
  | 'SecureCertificate'
  | 'SecureNoCertificate'
  | 'SignatureCapture'
  | 'UnknownMethod';
export const AuthenticationMethodEnum: EnumDef<AuthenticationMethod> = defineEnum(
  'AuthenticationMethod',
  [
    'Unknown',
    'Bypass',
    'ManualVerification',
    'MerchantAuthentication',
    'OfflinePIN',
    'OnLinePIN',
    'PaperSignature',
    'SecuredChannel',
    'SecureCertificate',
    'SecureNoCertificate',
    'SignatureCapture',
    'UnknownMethod',
  ],
);

// ---------- UnifyURL / UnifyRootCA (C# uses int enum, not string converter) ----------

export type UnifyURL = 'Test' | 'Production' | 'Custom';
export const UnifyURL = {
  Test: 'Test',
  Production: 'Production',
  Custom: 'Custom',
} as const satisfies Record<UnifyURL, UnifyURL>;

export type UnifyRootCA = 'Test' | 'Production' | 'System' | 'Custom';
export const UnifyRootCA = {
  Test: 'Test',
  Production: 'Production',
  System: 'System',
  Custom: 'Custom',
} as const satisfies Record<UnifyRootCA, UnifyRootCA>;

// ---------- EventToNotify ----------

export type EventToNotify =
  | 'Unknown'
  | 'BeginMaintenance'
  | 'EndMaintenance'
  | 'Shutdown'
  | 'Initialised'
  | 'OutOfOrder'
  | 'Completed'
  | 'Abort'
  | 'SaleWakeUp'
  | 'SaleAdmin'
  | 'CustomerLanguage'
  | 'KeyPressed'
  | 'SecurityAlarm'
  | 'StopAssistance'
  | 'CardInserted'
  | 'CardRemoved'
  | 'Reject'
  | 'CompletedMessage';
export const EventToNotifyEnum: EnumDef<EventToNotify> = defineEnum('EventToNotify', [
  'Unknown',
  'BeginMaintenance',
  'EndMaintenance',
  'Shutdown',
  'Initialised',
  'OutOfOrder',
  'Completed',
  'Abort',
  'SaleWakeUp',
  'SaleAdmin',
  'CustomerLanguage',
  'KeyPressed',
  'SecurityAlarm',
  'StopAssistance',
  'CardInserted',
  'CardRemoved',
  'Reject',
  'CompletedMessage',
]);

// ---------- POICapability ----------

export type POICapability =
  | 'Unknown'
  | 'CashierDisplay'
  | 'CashierError'
  | 'CashierInput'
  | 'CustomerDisplay'
  | 'CustomerError'
  | 'CustomerInput'
  | 'PrinterReceipt'
  | 'PrinterDocument'
  | 'PrinterVoucher'
  | 'MagStripe'
  | 'ICC'
  | 'EMVContactless'
  | 'CashHandling';
export const POICapabilityEnum: EnumDef<POICapability> = defineEnum('POICapability', [
  'Unknown',
  'CashierDisplay',
  'CashierError',
  'CashierInput',
  'CustomerDisplay',
  'CustomerError',
  'CustomerInput',
  'PrinterReceipt',
  'PrinterDocument',
  'PrinterVoucher',
  'MagStripe',
  'ICC',
  'EMVContactless',
  'CashHandling',
]);

// ---------- ErrorCondition ----------

export type ErrorCondition =
  | 'Unknown'
  | 'Aborted'
  | 'Busy'
  | 'Cancel'
  | 'DeviceOut'
  | 'InsertedCard'
  | 'InProgress'
  | 'LoggedOut'
  | 'MessageFormat'
  | 'NotAllowed'
  | 'NotFound'
  | 'PaymentRestriction'
  | 'Refusal'
  | 'UnavailableDevice'
  | 'UnavailableService'
  | 'InvalidCard'
  | 'UnreachableHost'
  | 'WrongPIN';
export const ErrorCondition = {
  Unknown: 'Unknown',
  Aborted: 'Aborted',
  Busy: 'Busy',
  Cancel: 'Cancel',
  DeviceOut: 'DeviceOut',
  InsertedCard: 'InsertedCard',
  InProgress: 'InProgress',
  LoggedOut: 'LoggedOut',
  MessageFormat: 'MessageFormat',
  NotAllowed: 'NotAllowed',
  NotFound: 'NotFound',
  PaymentRestriction: 'PaymentRestriction',
  Refusal: 'Refusal',
  UnavailableDevice: 'UnavailableDevice',
  UnavailableService: 'UnavailableService',
  InvalidCard: 'InvalidCard',
  UnreachableHost: 'UnreachableHost',
  WrongPIN: 'WrongPIN',
} as const satisfies Record<ErrorCondition, ErrorCondition>;
export const ErrorConditionEnum: EnumDef<ErrorCondition> = defineEnum('ErrorCondition', [
  'Unknown',
  'Aborted',
  'Busy',
  'Cancel',
  'DeviceOut',
  'InsertedCard',
  'InProgress',
  'LoggedOut',
  'MessageFormat',
  'NotAllowed',
  'NotFound',
  'PaymentRestriction',
  'Refusal',
  'UnavailableDevice',
  'UnavailableService',
  'InvalidCard',
  'UnreachableHost',
  'WrongPIN',
]);

// ---------- InfoQualify / Device / DocumentQualifier ----------

export type InfoQualify =
  | 'Unknown'
  | 'Status'
  | 'Error'
  | 'Display'
  | 'Sound'
  | 'Input'
  | 'POIReplication'
  | 'CustomerAssistance'
  | 'Receipt'
  | 'Document'
  | 'Voucher';
export const InfoQualify = {
  Unknown: 'Unknown',
  Status: 'Status',
  Error: 'Error',
  Display: 'Display',
  Sound: 'Sound',
  Input: 'Input',
  POIReplication: 'POIReplication',
  CustomerAssistance: 'CustomerAssistance',
  Receipt: 'Receipt',
  Document: 'Document',
  Voucher: 'Voucher',
} as const satisfies Record<InfoQualify, InfoQualify>;
export const InfoQualifyEnum: EnumDef<InfoQualify> = defineEnum('InfoQualify', [
  'Unknown',
  'Status',
  'Error',
  'Display',
  'Sound',
  'Input',
  'POIReplication',
  'CustomerAssistance',
  'Receipt',
  'Document',
  'Voucher',
]);

export type Device =
  | 'Unknown'
  | 'CashierDisplay'
  | 'CustomerDisplay'
  | 'CashierInput'
  | 'CustomerInput';
export const Device = {
  Unknown: 'Unknown',
  CashierDisplay: 'CashierDisplay',
  CustomerDisplay: 'CustomerDisplay',
  CashierInput: 'CashierInput',
  CustomerInput: 'CustomerInput',
} as const satisfies Record<Device, Device>;
export const DeviceEnum: EnumDef<Device> = defineEnum('Device', [
  'Unknown',
  'CashierDisplay',
  'CustomerDisplay',
  'CashierInput',
  'CustomerInput',
]);

export type DocumentQualifier =
  | 'Unknown'
  | 'SaleReceipt'
  | 'CashierReceipt'
  | 'CustomerReceipt'
  | 'Document'
  | 'Voucher'
  | 'Journal'
  | 'CustomFooter';
export const DocumentQualifier = {
  Unknown: 'Unknown',
  SaleReceipt: 'SaleReceipt',
  CashierReceipt: 'CashierReceipt',
  CustomerReceipt: 'CustomerReceipt',
  Document: 'Document',
  Voucher: 'Voucher',
  Journal: 'Journal',
  CustomFooter: 'CustomFooter',
} as const satisfies Record<DocumentQualifier, DocumentQualifier>;
export const DocumentQualifierEnum: EnumDef<DocumentQualifier> = defineEnum('DocumentQualifier', [
  'Unknown',
  'SaleReceipt',
  'CashierReceipt',
  'CustomerReceipt',
  'Document',
  'Voucher',
  'Journal',
  'CustomFooter',
]);

// ---------- ReconciliationType ----------

export type ReconciliationType =
  | 'Unknown'
  | 'SaleReconciliation'
  | 'AcquirerReconciliation'
  | 'PreviousReconciliation'
  | 'InternalReconciliation';
export const ReconciliationType = {
  Unknown: 'Unknown',
  SaleReconciliation: 'SaleReconciliation',
  AcquirerReconciliation: 'AcquirerReconciliation',
  PreviousReconciliation: 'PreviousReconciliation',
  InternalReconciliation: 'InternalReconciliation',
} as const satisfies Record<ReconciliationType, ReconciliationType>;
export const ReconciliationTypeEnum: EnumDef<ReconciliationType> = defineEnum('ReconciliationType', [
  'Unknown',
  'SaleReconciliation',
  'AcquirerReconciliation',
  'PreviousReconciliation',
  'InternalReconciliation',
]);

// ---------- TransactionType ----------

export type TransactionType =
  | 'Unknown'
  | 'Debit'
  | 'Credit'
  | 'ReverseDebit'
  | 'ReverseCredit'
  | 'OneTimeReservation'
  | 'CompletedDeffered'
  | 'FirstReservation'
  | 'UpdateReservation'
  | 'CompletedReservation'
  | 'CashAdvance'
  | 'IssuerInstalment'
  | 'Declined'
  | 'Failed'
  | 'Award'
  | 'ReverseAward'
  | 'Redemption'
  | 'ReverseRedemption'
  | 'Rebate'
  | 'ReverseRebate';
export const TransactionTypeEnum: EnumDef<TransactionType> = defineEnum('TransactionType', [
  'Unknown',
  'Debit',
  'Credit',
  'ReverseDebit',
  'ReverseCredit',
  'OneTimeReservation',
  'CompletedDeffered',
  'FirstReservation',
  'UpdateReservation',
  'CompletedReservation',
  'CashAdvance',
  'IssuerInstalment',
  'Declined',
  'Failed',
  'Award',
  'ReverseAward',
  'Redemption',
  'ReverseRedemption',
  'Rebate',
  'ReverseRebate',
]);

// ---------- ComponentType / GlobalStatus / PrinterStatus ----------

export type ComponentType = 'Unknown' | 'SERV' | 'MDWR' | 'OPST' | 'APPL' | 'SECM';
export const ComponentTypeEnum: EnumDef<ComponentType> = defineEnum('ComponentType', [
  'Unknown',
  'SERV',
  'MDWR',
  'OPST',
  'APPL',
  'SECM',
]);

export type GlobalStatus = 'Unknown' | 'OK' | 'Busy' | 'Maintenance' | 'Unreachable';
export const GlobalStatusEnum: EnumDef<GlobalStatus> = defineEnum('GlobalStatus', [
  'Unknown',
  'OK',
  'Busy',
  'Maintenance',
  'Unreachable',
]);

export type PrinterStatus = 'Unknown' | 'OK' | 'PaperLow' | 'NoPaper' | 'PaperJam' | 'OutOfOrder';
export const PrinterStatusEnum: EnumDef<PrinterStatus> = defineEnum('PrinterStatus', [
  'Unknown',
  'OK',
  'PaperLow',
  'NoPaper',
  'PaperJam',
  'OutOfOrder',
]);

// ---------- IdentificationType / IdentificationSupport / TrackFormat ----------

export type IdentificationType =
  | 'Unknown'
  | 'PAN'
  | 'ISOTrack2'
  | 'BarCode'
  | 'AccountNumber'
  | 'PhoneNumber';
export const IdentificationTypeEnum: EnumDef<IdentificationType> = defineEnum(
  'IdentificationType',
  ['Unknown', 'PAN', 'ISOTrack2', 'BarCode', 'AccountNumber', 'PhoneNumber'],
);

export type IdentificationSupport =
  | 'Unknown'
  | 'NoCard'
  | 'LoyaltyCard'
  | 'HybridCard'
  | 'LinkedCard';
export const IdentificationSupportEnum: EnumDef<IdentificationSupport> = defineEnum(
  'IdentificationSupport',
  ['Unknown', 'NoCard', 'LoyaltyCard', 'HybridCard', 'LinkedCard'],
);

export type TrackFormat = 'Unknown' | 'ISO' | 'JISI' | 'JISII' | 'AAMVA' | 'CMC7' | 'E13B';
export const TrackFormatEnum: EnumDef<TrackFormat> = defineEnum('TrackFormat', [
  'Unknown',
  'ISO',
  'JISI',
  'JISII',
  'AAMVA',
  'CMC7',
  'E13B',
]);

// ---------- InstalmentType / PeriodUnit / SaleItemCustomFieldType ----------

export type InstalmentType =
  | 'Unknown'
  | 'DeferredInstalments'
  | 'EqualInstalments'
  | 'InequalInstalments';
export const InstalmentTypeEnum: EnumDef<InstalmentType> = defineEnum('InstalmentType', [
  'Unknown',
  'DeferredInstalments',
  'EqualInstalments',
  'InequalInstalments',
]);

export type PeriodUnit = 'Unknown' | 'Daily' | 'Weekly' | 'Monthly' | 'Annual';
export const PeriodUnitEnum: EnumDef<PeriodUnit> = defineEnum('PeriodUnit', [
  'Unknown',
  'Daily',
  'Weekly',
  'Monthly',
  'Annual',
]);

export type SaleItemCustomFieldType =
  | 'Unknown'
  | 'Integer'
  | 'Decimal'
  | 'String'
  | 'Array'
  | 'Object';
export const SaleItemCustomFieldTypeEnum: EnumDef<SaleItemCustomFieldType> = defineEnum(
  'SaleItemCustomFieldType',
  ['Unknown', 'Integer', 'Decimal', 'String', 'Array', 'Object'],
);

// ---------- LoyaltyUnit / LoyaltyBrand / Account / ReversalReason ----------

export type LoyaltyUnit = 'Unknown' | 'Point' | 'Monetary';
export const LoyaltyUnitEnum: EnumDef<LoyaltyUnit> = defineEnum('LoyaltyUnit', [
  'Unknown',
  'Point',
  'Monetary',
]);

export type LoyaltyBrand = 'Unknown' | 'Qantas' | 'DRC' | 'Flybuys' | 'Other';
export const LoyaltyBrandEnum: EnumDef<LoyaltyBrand> = defineEnum('LoyaltyBrand', [
  'Unknown',
  'Qantas',
  'DRC',
  'Flybuys',
  'Other',
]);

export type Account = 'Unknown' | 'Default' | 'Credit' | 'Cheque' | 'Savings';
export const Account = {
  Unknown: 'Unknown',
  Default: 'Default',
  Credit: 'Credit',
  Cheque: 'Cheque',
  Savings: 'Savings',
} as const satisfies Record<Account, Account>;
export const AccountEnum: EnumDef<Account> = defineEnum('Account', [
  'Unknown',
  'Default',
  'Credit',
  'Cheque',
  'Savings',
]);

export type ReversalReason =
  | 'Unknown'
  | 'CustCancel'
  | 'MerchantCancel'
  | 'Malfunction'
  | 'Unable2Compl'
  | 'SignatureDeclined';
export const ReversalReasonEnum: EnumDef<ReversalReason> = defineEnum('ReversalReason', [
  'Unknown',
  'CustCancel',
  'MerchantCancel',
  'Malfunction',
  'Unable2Compl',
  'SignatureDeclined',
]);

// ---------- TotalDetail / InputCommand / ResponseMode ----------

export type TotalDetail =
  | 'Unknown'
  | 'POIID'
  | 'SaleID'
  | 'OperatorID'
  | 'ShiftNumber'
  | 'TotalsGroupID'
  | 'EndOfShift';
export const TotalDetailEnum: EnumDef<TotalDetail> = defineEnum('TotalDetail', [
  'Unknown',
  'POIID',
  'SaleID',
  'OperatorID',
  'ShiftNumber',
  'TotalsGroupID',
  'EndOfShift',
]);

export type InputCommand =
  | 'Unknown'
  | 'GetAnyKey'
  | 'GetConfirmation'
  | 'SiteManager'
  | 'TextString'
  | 'DigitString'
  | 'DecimalString'
  | 'GetFunctionKey'
  | 'GetMenuEntry';
export const InputCommandEnum: EnumDef<InputCommand> = defineEnum('InputCommand', [
  'Unknown',
  'GetAnyKey',
  'GetConfirmation',
  'SiteManager',
  'TextString',
  'DigitString',
  'DecimalString',
  'GetFunctionKey',
  'GetMenuEntry',
]);

export type ResponseMode = 'Unknown' | 'NotRequired' | 'Immediate' | 'PrintEnd' | 'SoundEnd';
export const ResponseModeEnum: EnumDef<ResponseMode> = defineEnum('ResponseMode', [
  'Unknown',
  'NotRequired',
  'Immediate',
  'PrintEnd',
  'SoundEnd',
]);

// ---------- StoredValueTransactionType / StoredValueAccountType / AccountType ----------

export type StoredValueTransactionType =
  | 'Reserve'
  | 'Activate'
  | 'Load'
  | 'Unload'
  | 'Reverse'
  | 'Duplicate'
  | 'Verify';
export const StoredValueTransactionTypeEnum: EnumDef<StoredValueTransactionType> = defineEnum(
  'StoredValueTransactionType',
  ['Reserve', 'Activate', 'Load', 'Unload', 'Reverse', 'Duplicate', 'Verify'],
);

export type StoredValueAccountType = 'GiftCard' | 'PhoneCard' | 'Other';
export const StoredValueAccountTypeEnum: EnumDef<StoredValueAccountType> = defineEnum(
  'StoredValueAccountType',
  ['GiftCard', 'PhoneCard', 'Other'],
);

export type AccountType =
  | 'Default'
  | 'Savings'
  | 'Checking'
  | 'CreditCard'
  | 'Universal'
  | 'CardTotals'
  | 'EpurseCard';
export const AccountTypeEnum: EnumDef<AccountType> = defineEnum('AccountType', [
  'Default',
  'Savings',
  'Checking',
  'CreditCard',
  'Universal',
  'CardTotals',
  'EpurseCard',
]);

// ---------- BaudRate / DataBits / PairingMode / Parity / PortType / EncryptionType ----------
// These C# enums lack StringEnumConverter and serialize as integers.

export const BaudRate = {
  BaudRate9600: 9600,
  BaudRate19200: 19200,
  BaudRate38400: 38400,
  BaudRate115200: 115200,
} as const;
export type BaudRate = (typeof BaudRate)[keyof typeof BaudRate];

export const DataBits = {
  DataBits7: 7,
  DataBits8: 8,
} as const;
export type DataBits = (typeof DataBits)[keyof typeof DataBits];

export const PairingMode = {
  Cloud: 0,
  USB: 1,
  Bluetooth: 2,
} as const;
export type PairingMode = (typeof PairingMode)[keyof typeof PairingMode];

export const Parity = {
  None: 0,
  Odd: 1,
  Even: 2,
  Mark: 3,
  Space: 4,
} as const;
export type Parity = (typeof Parity)[keyof typeof Parity];

export const PortType = {
  SerialModeBaseConnectedUSB: 0,
  SerialModeTerminalConnectedUSB: 1,
} as const;
export type PortType = (typeof PortType)[keyof typeof PortType];

export const EncryptionType = {
  None: 0,
  AES128_CBC: 1,
} as const;
export type EncryptionType = (typeof EncryptionType)[keyof typeof EncryptionType];
