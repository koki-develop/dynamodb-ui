import { Container } from "@mantine/core";
import { ReactNode } from "react";

export type PageProps = {
  children: ReactNode;
};

export default function Page({ children }: PageProps) {
  return <Container py="md">{children}</Container>;
}
