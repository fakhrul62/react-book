import  { useContext } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";
import { updateProfile } from "firebase/auth";

const Register = () => {
    const {createUser} = useContext(AuthContext);
    const handleRegister = (e) =>{
      e.preventDefault();
      const name = e.target.name.value;
      const email = e.target.email.value;
      const photo = e.target.photo.value;
      const password = e.target.password.value;
      //create user in firebase
      createUser(email, password)
      .then(result =>{
        const user = result.user;
        console.log(user);
        updateProfile(user, {
          displayName: name,
          photoURL: photo,
        })
      })
      .catch(error=>{
        console.log(error.message);
      })
      e.target.reset();
    }
  return (
    <div className="mb-10">
      <h1 className="text-center my-10 text-3xl font-bold">Register Now</h1>
      <form
        className="flex max-w-md mx-auto flex-col gap-4"
        onSubmit={handleRegister}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Your name" />
          </div>
          <TextInput id="name" type="text" name="name" placeholder="John Doe" />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            name="email"
            placeholder="john@doe.com"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="photo" value="Your photo URL" />
          </div>
          <TextInput
            id="photo"
            type="text"
            name="photo"
            placeholder="Image URL"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput
            id="password1"
            name="password"
            type="password"
            placeholder="••••••••"
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="agree" />
          <Label htmlFor="agree" className="flex">
            I agree with the&nbsp;
            <Link
              href="#"
              className="text-cyan-600 hover:underline dark:text-cyan-500"
            >
              terms and conditions
            </Link>
          </Label>
        </div>
        <Button type="submit">Login</Button>
        <p>
          Already have an Account?{" "}
          <Link className="text-cyan-800 font-semibold" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
