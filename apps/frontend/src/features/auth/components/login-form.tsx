import {Box, Container, TextInput, Title, PasswordInput, Button, Anchor,} from "@mantine/core";
import classes from "./auth.module.scss";
import {Link} from "react-router-dom";
import APP_ROUTE from "../../../libs/app-route";

export function LoginForm() {
  return (
    <Container size={420} my={40} className={classes.container}>
      <Box p="xl" mt={200}>
        <Title order={2} ta="center" fw={500} mb="md">
          LOGIN
        </Title>
        <form>
          <TextInput
            id={"email"}
            type={"email"}
            label={"Email"}
            placeholder={"email@example.com"}
            variant={"filled"}
          />
          <PasswordInput
            id={"password"}
            label={"Password"}
            placeholder={"Your password"}
            variant={"filled"}
            mt={"md"}
          />
          <Button type="submit" fullWidth mt="xl">
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