import ErrorAlert from "@/client/components/util/ErrorText";
import { Anchor, Box, Breadcrumbs, Container, Stack } from "@mantine/core";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

export type PageProps = {
  children: ReactNode;
  error?: Error | null;
  breadcrumbs: { title: string; to: string }[];
};

export default function Page({ children, error, breadcrumbs }: PageProps) {
  return (
    <Container py="md" size="xl">
      <Stack>
        <Breadcrumbs>
          {breadcrumbs.map((breadcrumb) => (
            <Anchor key={breadcrumb.to} component={Link} to={breadcrumb.to}>
              {breadcrumb.title}
            </Anchor>
          ))}
        </Breadcrumbs>
        {error && <ErrorAlert error={error} />}
        <Box>{children}</Box>
      </Stack>
    </Container>
  );
}
