import {
  type DefaultMantineColor,
  type MantineColorsTuple,
  createTheme,
} from "@mantine/core";

type ExtendedCustomColors = "primary" | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}

const primary: MantineColorsTuple = [
  "#EBF0FF",
  "#D7DCFC",
  "#ACB5F0",
  "#7F8CE5",
  "#596ADB",
  "#4154D6",
  "#3449D5",
  "#253BBD",
  "#1E33AA",
  "#122C97",
];

export const theme = createTheme({
  primaryColor: "primary",
  primaryShade: 5,
  colors: {
    primary,
  },
});
