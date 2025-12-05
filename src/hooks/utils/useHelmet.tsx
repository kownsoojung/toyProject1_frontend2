import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

function useHelmetTitle(title: string) {
    return useMemo(
    () => (
      <Helmet>
        <title>{title}</title>
      </Helmet>
    ),
    [title]
  );
}

export default useHelmetTitle;

