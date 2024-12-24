
// import { render, screen, logRoles } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import Sandbox from "./Sandbox";
import userEvent from "@testing-library/user-event";

// Helper function to get form elements
const getFormElements = () => {
  const elements = {
    emailInputElement: screen.getByRole("textbox", { name: /email/i }),
    passwordInputElement: screen.getByLabelText("Password"),
    confirmPasswordInputElement: screen.getByLabelText(/confirm password/i),
    submitButton: screen.getByRole("button", { name: /submit/i }),
  };
  return elements;
};

describe("05-form-testing", () => {
  // Declare user variable at describe block level so it's accessible in all tests
  let user;

  // beforeEach runs before each test case
  // Used to set up the testing environment in a consistent state
  // This ensures each test starts with fresh DOM and user event instance
  beforeEach(() => {
    // console.log("hello world");
    user = userEvent.setup();
    render(<Sandbox />);
  });
  // test 1
  test("inputs should be initially empty", () => {
    // const { container } = render(<Sandbox />);
    // screen.debug();
    // logRoles(container);

    const { emailInputElement, passwordInputElement, confirmPasswordInputElement } =
      getFormElements();
    expect(emailInputElement).toHaveValue("");
    expect(passwordInputElement).toHaveValue("");
    expect(confirmPasswordInputElement).toHaveValue("");
  });
  // test 2
  test("should be able to type in the input", async () => {
    // const user = userEvent.setup();
    // render(<Sandbox />);

    const { emailInputElement, passwordInputElement, confirmPasswordInputElement } =
      getFormElements();

    await user.type(emailInputElement, "test@test.com");
    expect(emailInputElement).toHaveValue("test@test.com");

    await user.type(passwordInputElement, "secret");
    expect(passwordInputElement).toHaveValue("secret");

    await user.type(confirmPasswordInputElement, "secret");
    expect(confirmPasswordInputElement).toHaveValue("secret");
  });
  // test 3
  test("should show email error if email is invalid", async () => {
    const { emailInputElement, submitButton } = getFormElements();
    // no error message initially
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    // type invalid email
    await user.type(emailInputElement, "invalid");
    await user.click(submitButton);
    // check for error message
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
  // test 4
  test("should show password error if password is less than 5 characters", async () => {
    const { emailInputElement, passwordInputElement, submitButton } = getFormElements();
    // no error message initially
    expect(screen.queryByText(/password must be at least 5 characters/i)).not.toBeInTheDocument();
    // type valid email
    await user.type(emailInputElement, "test@test.com");
    // type password less than 5 characters
    await user.type(passwordInputElement, "abcd");
    await user.click(submitButton);
    // check for error message
    expect(screen.getByText(/password must be at least 5 characters/i)).toBeInTheDocument();
  });
  // test 5
  test("should show error if passwords do not match", async () => {
    const { emailInputElement, passwordInputElement, confirmPasswordInputElement, submitButton } =
      getFormElements();
    // no error message initially
    expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    // type valid email
    await user.type(emailInputElement, "test@test.com");
    // type valid password
    await user.type(passwordInputElement, "secret");
    // type different password in confirm password field
    await user.type(confirmPasswordInputElement, "notsecret");
    await user.click(submitButton);
    // check for error message
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });
  // test 6
  test("valid inputs show no errors and clear fields", async () => {
    const { emailInputElement, passwordInputElement, confirmPasswordInputElement, submitButton } =
      getFormElements();
    // type valid email, password, and confirm password
    await user.type(emailInputElement, "test@test.com");
    await user.type(passwordInputElement, "secret");
    await user.type(confirmPasswordInputElement, "secret");
    await user.click(submitButton);
    // no error message if inputs are valid
    expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/password must be at least 5 characters/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    // fields should be cleared after submission
    expect(emailInputElement).toHaveValue("");
    expect(passwordInputElement).toHaveValue("");
    expect(confirmPasswordInputElement).toHaveValue("");
  });
});
