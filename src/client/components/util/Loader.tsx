import { Box, Loader as MantineLoader } from "@mantine/core";

export default function Loader() {
  return (
    <Box className="flex justify-center" py="md">
      <MantineLoader />
    </Box>
  );
}
