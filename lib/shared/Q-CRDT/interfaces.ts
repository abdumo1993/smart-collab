import { Delta, ContentBase } from "../CRDT/refined/iterfaces";
// import {quill} from 'Quill';
interface IOperationConverter {
  QtoCrdt(ops: QDelta): Delta[];
  CrdttoQ(ops: Delta[]): QDelta;
}

interface QDelta {
  ops: any[];
}

interface QInsert extends ContentBase {
  insert: string;
}

interface QDelete extends ContentBase {
  delete: number;
}

interface QRetain extends ContentBase {
  retain: number;
}
interface IConvertorConfig {
  type: "insert" | "delete" | "retain";
  factory: () => IOperationConverter;
}

export {
  QDelete,
  QInsert,
  QRetain,
  QDelta,
  IOperationConverter,
  IConvertorConfig,
};
