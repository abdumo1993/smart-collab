import { Delta } from "../CRDT/refined/iterfaces";
import {
  IOperationConverter,
  QDelete,
  QInsert,
  QRetain,
  QDelta,
  IConvertorConfig,
} from "./interfaces";

class QuillOperationHandler implements IOperationConverter {
  private operationConvertors: Map<string, IOperationConverter> = new Map();
  constructor(convertors: IConvertorConfig[]) {
    this.registerConvertors(convertors);
  }

  private registerConvertors(convertors: IConvertorConfig[]) {
    convertors.forEach((convertor) => {
      this.operationConvertors.set(convertor.type, convertor.factory());
    });
  }
  QtoCrdt(ops: QDelta): Delta[] {
    throw new Error("Method not implemented.");
  }
  CrdttoQ(ops: Delta[]): QDelta {
    throw new Error("Method not implemented.");
  }
}
