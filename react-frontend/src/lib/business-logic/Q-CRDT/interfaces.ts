import { Delta, ContentBase } from "../CRDT/iterfaces";
// import {quill} from 'Quill';
interface IOperationConverter {
  QtoCrdt(qDelta: QDelta): Delta[];
  CrdttoQ(deltas: Delta[]): QDelta;
}
interface IMidOpConvertor {
  toCrdt(mOp: midDelta): Delta[];
  toQ(cOp: Delta): QdeltaType[];
}

interface QDelta {
  ops: QdeltaType[];
}

interface midDelta {
  type?: string;
  start?: number;
  content?: string;
  dlength?: number;
  rlength?: number;
  attributes?: Record<string, any>;
}
interface midDeltaRecord {
  ops: midDelta[];
  currPos: number;
}
interface QdeltaType extends ContentBase {
  insert?: string;
  delete?: number;
  retain?: number;
}

interface IConvertorConfig {
  type: "insert" | "delete" | "retain";
  factory: () => IMidOpConvertor;
}

export type {
  QDelta,
  QdeltaType,
  IOperationConverter,
  IConvertorConfig,
  midDelta,
  midDeltaRecord,
  IMidOpConvertor,
};
