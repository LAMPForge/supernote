import {Box, Container, TextInput, Title, PasswordInput, Button, Anchor,} from "@mantine/core";
import classes from "./auth.module.scss";
import {Link} from "react-router-dom";
import APP_ROUTE from "../../../libs/app-route";
import { z } from 'zod';
import useAuth from '../hooks/use-auth.ts';
import { useForm, zodResolver } from '@mantine/form';
import { ILogin } from '../types/auth.types.ts';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export function LoginForm() {
  const { login, isLoading } = useAuth();

  const form = useForm<ILogin>({
    validate: zodResolver(formSchema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: ILogin) {
    await login(data);
  }

  return (
    <Container size={420} my={40} className={classes.container}>
      <Box p="xl" mt={200}>
        <Title order={2} ta="center" fw={500} mb="md">
          LOGIN
        </Title>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput
            id="email"
            type="email"
            label="Email"
            placeholder="email@example.com"
            variant="filled"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            variant="filled"
            mt="md"
            {...form.getInputProps("password")}
          />

          <Button type="submit" fullWidth mt="xl" loading={isLoading}>
            Sign In
          </Button>
        </form>
        <Anchor
          component={Link}
          underline={"never"}
          size={"sm"}
          to={APP_ROUTE.AUTH.FORGOT_PASSWORD}
        >
          Forgot your password?
        </Anchor>
      </Box>
    </Container>
  )
}