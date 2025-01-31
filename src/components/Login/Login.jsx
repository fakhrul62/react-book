import { useContext } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";

const Login = () => {
  const {signInUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = (e) =>{
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);
    //sign in
    signInUser(email, password)
    .then(()=>{
      e.target.reset();
      navigate("/");
    })
    .catch((error)=>{
      console.log(error.message);
    })
  }
  return (
    <div className="mb-10">
      <h1 className="text-center my-10 text-3xl font-bold">
        Login to your Account
      </h1>
      <form
        className="flex max-w-md mx-auto flex-col gap-4"
        onSubmit={handleLogin}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            name="email"
            placeholder="Your email"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput id="password1" name="password" type="password" required />
        </div>
        <div className="flex items-center gap-2">
          <a href="">Forgot Your Password?</a>
        </div>
        <Button type="submit">Login</Button>
        <p>
          New to this Site?{" "}
          <Link className="text-cyan-800 font-semibold" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
