import { Anchor, Box, Container, Paper, Title } from "@mantine/core";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Box>
      <Paper component="header" withBorder radius={0}>
        <Container classNames={{ root: "flex" }} size="xl" py="xs">
          <Anchor component={Link} to="/">
            <Title order={1} size="h4">
              DynamoDB UI
            </Title>
          </Anchor>
        </Container>
      </Paper>

      <main>
        <Outlet />
      </main>
    </Box>
  );
}
