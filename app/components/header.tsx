import { Trans } from "@lingui/macro";
import { Box, Typography } from "@mui/material";
import NextLink from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

import Flex from "@/components/flex";
import { LanguageMenu } from "@/components/language-menu";

const DEFAULT_HEADER_PROGRESS = 100;

export const useHeaderProgressContext = () => {
  const [value, setValue] = useState(DEFAULT_HEADER_PROGRESS);
  return useMemo(() => ({ value, setValue }), [value, setValue]);
};

export const useHeaderProgress = () => useContext(HeaderProgressContext);

const HeaderProgressContext = React.createContext({
  value: DEFAULT_HEADER_PROGRESS,
  setValue: (() => undefined) as Dispatch<SetStateAction<number>>,
});

export const HeaderProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const headerProgress = useHeaderProgressContext();
  return (
    <HeaderProgressContext.Provider value={headerProgress}>
      {children}
    </HeaderProgressContext.Provider>
  );
};

export const HeaderBorder = () => {
  const { value: progress } = useHeaderProgress();
  return (
    <Box
      sx={{
        transform: `scaleX(${progress / 100})`,
        transformOrigin: "0 0",
        transition:
          progress === 0 ? "opacity 0.1s ease" : "transform 0.3s ease",
        width: `100%`,
        opacity: progress === 0 ? 0 : 1,
        borderBottomWidth: "4px",
        borderBottomStyle: "solid",
        borderBottomColor: "brand.main",
      }}
    />
  );
};

export const Header = ({
  pageType = "app",
  contentId,
}: {
  pageType?: "content" | "app";
  contentId?: string;
}) => {
  return (
    <Box
      sx={
        pageType == "content"
          ? undefined
          : {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              overflowY: "hidden",
              zIndex: 13,
            }
      }
    >
      <Flex
        component="header"
        sx={{
          px: [0, 4, 4],
          pt: [0, 3, 3],
          minHeight: 92,

          backgroundColor: "grey.100",
          color: "grey.700",
          flexDirection: ["column", "row"],
        }}
      >
        <LanguageMenu contentId={contentId} />
        <Logo />
      </Flex>
      <HeaderBorder />
    </Box>
  );
};

export const Logo = () => {
  return (
    <NextLink href="/" passHref>
      <Flex
        component="a"
        sx={{
          order: [2, 1],
          alignItems: ["center", "flex-start"],
          cursor: "pointer",
          textDecoration: "none",
          color: "grey.900",
        }}
      >
        <Box
          role="figure"
          aria-labelledby="logo"
          sx={{ display: ["block", "none"], mx: 4, my: 4, width: 24 }}
        >
          <LogoMobile />
        </Box>
        <Box
          role="figure"
          aria-labelledby="logo"
          sx={{
            display: ["none", "block"],
            pr: 6,
            borderRightWidth: "1px",
            borderRightStyle: "solid",
            borderRightColor: "grey.300",
            color: "grey.900",
          }}
        >
          <LogoDesktop />
        </Box>
        <Typography
          component="h1"
          variant="h4"
          sx={{ pl: [0, 6], color: "grey.800" }}
        >
          Cube Visualize
        </Typography>
      </Flex>
    </NextLink>
  );
};

const LogoMobile = () => (
  <svg width={30} height={34}>
    <title id="logo">
      <Trans id="logo.swiss.confederation">
        Logo
      </Trans>
    </title>
  </svg>
);
const LogoDesktop = () => (
  <svg width={224} height={56}>
    <title id="logo">
      <Trans id="logo">
        Logo
      </Trans>
    </title>   
  </svg>
);
