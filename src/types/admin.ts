import z from "zod";
import { PositiveInt } from "./common";

export const ScouterInfo = z.object({
  studentNumber: PositiveInt,
  name: z.string()
})
