import type { RootState } from "../../app/store";

export const selectVariantBuilderStage = (state: RootState) => state.variantBuilder.current_stage;
export const selectVariantIdAtBuilder = (state: RootState) => state.variantBuilder.variant_in_server.variant_id;
export const selectVariantRequestAtBuilder = (state: RootState) => state.variantBuilder.variant_req;
export const selectVariantAtBuilder = (state: RootState) => state.variantBuilder.variant_in_server;