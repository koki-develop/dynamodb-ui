import { Alert, Text } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { useEffect } from "react";

export type ErrorTextProps = {
  error?: Error | null;
};

export default function ErrorAlert({ error }: ErrorTextProps) {
  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  if (!error) return null;

  return (
    <Alert icon={<IconExclamationCircle />} color="red" title="Error">
      <Text classNames={{ root: "break-all" }} c="red" size="sm">
        {error.toString()}
      </Text>
    </Alert>
  );
}
