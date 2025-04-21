import { z } from "zod";

export const FiscalSchema = z.object({
  id: z.number(),
  FSCL_YY: z.number(),
  OFFC_NM: z.string(),
  NORMALIZED_DEPT_NO: z.number(),
  FSCL_NM: z.string(),
  ACCT_NM: z.string().nullable().optional(),
  FLD_NM: z.string(),
  SECT_NM: z.string(),
  PGM_NM: z.string(),
  ACTV_NM: z.string(),
  SACTV_NM: z.string(),
  BZ_CLS_NM: z.string(),
  FIN_DE_EP_NM: z.string(),
  Y_YY_MEDI_KCUR_AMT: z.number().nullable().optional(),
  Y_YY_DFN_MEDI_KCUR_AMT: z.number().nullable().optional(),
});

export const FiscalByYearSchema = z.object({
  id: z.number(),
  FSCL_YY: z.number(),
  Y_YY_MEDI_KCUR_AMT: z.number().nullable().optional(),
  Y_YY_DFN_MEDI_KCUR_AMT: z.number().nullable().optional(),
  Y_YY_MEDI_KCUR_AMT_PCT: z.number().nullable().optional(),
  Y_YY_DFN_MEDI_KCUR_AMT_PCT: z.number().nullable().optional(),
});

export const FiscalByYearOffcSchema = z.object({
  id: z.number(),
  FSCL_YY: z.number(),
  OFFC_NM: z.string(),
  NORMALIZED_DEPT_NO: z.number(),
  Y_YY_MEDI_KCUR_AMT: z.number().nullable().optional(),
  Y_YY_DFN_MEDI_KCUR_AMT: z.number().nullable().optional(),
  Y_YY_MEDI_KCUR_AMT_PCT: z.number().nullable().optional(),
  Y_YY_DFN_MEDI_KCUR_AMT_PCT: z.number().nullable().optional(),
  COUNT: z.number(),
});

export const FiscalResponseSchema = z.array(FiscalSchema);
export const FiscalByYearResponseSchema = z.array(FiscalByYearSchema);
export const FiscalByYearOffcResponseSchema = z.array(FiscalByYearOffcSchema);

export type Fiscal = z.infer<typeof FiscalSchema>;
export type FiscalResponse = z.infer<typeof FiscalResponseSchema>;
export type FiscalByYear = z.infer<typeof FiscalByYearSchema>;
export type FiscalByYearResponse = z.infer<typeof FiscalByYearResponseSchema>;
export type FiscalByYearOffc = z.infer<typeof FiscalByYearOffcSchema>;
export type FiscalByYearOffcResponse = z.infer<typeof FiscalByYearOffcResponseSchema>;
