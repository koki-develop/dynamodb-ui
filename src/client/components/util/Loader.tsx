import { Box, Loader as MantineLoader } from "@mantine/core";

export default function Loader() {
  return (
    <Box className="py-md flex justify-center">
      <MantineLoader />
    </Box>
  );
}
