import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/context/SnackbarContext";
import { useLoading } from "@/app/context/loaderContext";

export const useCommonUtils = () => {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();
  const { setLoading } = useLoading();

  return {
    queryClient,
    openSnackbar,
    setLoading,
  };
};
