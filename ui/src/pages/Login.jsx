import { useState, useEffect } from "react";
import img from "../assets/img-player.webp";
import Swal from 'sweetalert2'

const Login = () => {

  const [user, setUser] = useState({
    email: '',
    password: ''
  });


 const setParams = (e) => {
    if(e.target.name === 'email') {
        setUser({...user, email: e.target.value });
    }
    if(e.target.name === 'password') {
        setUser({...user, password: e.target.value });
    }
 }

  useEffect(()=> {
    console.log(user);
  },[user])

  const submitFormLogin = async (e) => {
    e.preventDefault()
    if (user.email == 'admin@gmail.com' && user.password == '1234567'){
      localStorage.setItem('is_login', true);
      Swal.fire({
        title: "Good job!",
        text: "Đăng nhập thành công!",
        icon: "success"
      });
      setTimeout(() => {
        window.location.replace("http://localhost:5173/")
    }, 1500)
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email hoặc mật khẩu không đúng!",
      });
    }
            
}

  return (
    <div className="bg-gradient-to-r from-cyan-300 to-sky-800 h-screen flex justify-center items-center">
      <div className="bg-gray-100 flex justify-center items-center w-3/4 rounded-lg">
        <div className="w-1/2 hidden lg:block">
          <img src={img} alt="Placeholder Image" className="rounded-l-lg"/>
        </div>
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <div className="flex flex-col">
          <h1 className="text-3xl font-semibold text-center">Quản lý người chơi</h1>
          <h1 className="text-2xl font-semibold mb-4">Login</h1>
          </div>
          <form onSubmit={submitFormLogin}>
            <div className="mb-4">
              <label  className="block text-gray-600">Email</label>
              <input type="text" id="email" name="email" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required onChange={setParams}/>
            </div>
            <div className="mb-4">
              <label  className="block text-gray-600">Password</label>
              <input type="password" id="password" name="password" className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" required onChange={setParams}/>
            </div>
            <div className="mb-4 flex items-center">
              <input type="checkbox" id="remember" name="remember" className="text-blue-500"/>
              <label for="remember" className="text-gray-600 ml-2">Remember Me</label>
            </div>
            <div className="mb-6 text-sky-800">
              <a href="#" className="hover:underline">Forgot Password?</a>
            </div>
          
            <button type="submit" className="bg-sky-800 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
          </form>
          <div className="mt-6 text-sky-800 text-center">
            <a href="#" className="hover:underline">Sign up Here</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login