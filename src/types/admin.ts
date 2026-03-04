import z from "zod";
import { PositiveInt } from "./api";

export const ScouterInfo = z.object({
  studentNumber: PositiveInt,
  name: z.string()
})
