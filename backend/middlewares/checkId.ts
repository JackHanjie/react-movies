import { isValidObjectId } from "mongoose";

function checkId(req: any, res: any, next: any) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid Object of: ${req.params.id}`);
  }
  next();
}

export default checkId;