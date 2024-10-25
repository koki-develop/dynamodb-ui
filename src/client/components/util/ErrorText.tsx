import { Alert, Text } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

export type ErrorTextProps = {
  error?: Error | null;
};

export default function ErrorAlert({ error }: ErrorTextProps) {
  if (!error) return null;

  return (
    <Alert icon={<IconExclamationCircle />} color="red" title="Error">
      <Text classNames={{ root: "break-all" }} c="red" size="sm">
        {error.toString()}
      </Text>
    </Alert>
  );
}
