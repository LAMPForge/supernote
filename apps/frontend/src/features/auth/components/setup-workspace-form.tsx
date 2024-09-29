import useAuth from '../hooks/use-auth';
import * as z from "zod";
import { Box, Button, Container, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { ISetupWorkspace } from '../types/auth.types.ts';
import classes from "./auth.module.scss";

const formSchema = z.object({
  workspaceName: z.string().min(2).max(60),
  name: z.string().min(2).max(60),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(8),
});

export default function SetupWorkspaceForm() {
  const { setupWorkspace, isLoading } = useAuth();

  const form = useForm<ISetupWorkspace>({
    validate: zodResolver(formSchema),
    initialValues: {
      workspaceName: "",
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: ISetupWorkspace) {
    await setupWorkspace(data);
  }

  return (
    <Container  size={420} my={40} className={classes.container}>
      <Box p={'xl'} mt={200}>
        <Title order={2} ta="center" fw={500} mb="md">
          CREATE WORKSPACE
        </Title>

        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            id="workspaceName"
            type="text"
            label="Workspace Name"
            placeholder="e.g LAMPForge"
            variant="filled"
            mt="md"
            {...form.getInputProps("workspaceName")}
          />

          <TextInput
            id="name"
            type="text"
            label="Your Name"
            placeholder="Enter your full name"
            variant="filled"
            mt="md"
            {...form.getInputProps("name")}
          />

          <TextInput
            id="email"
            type="email"
            label="Your Email"
            placeholder="email@example.com"
            variant="filled"
            mt="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter a strong password"
            variant="filled"
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button type="submit" fullWidth mt="xl" loading={isLoading}>
            Setup workspace
          </Button>
        </form>
      </Box>
    </Container>
  );
}