import React,{ useState } from "react";
import Navbar from "../../components/Navbar"; 
import { Link } from "react-router-dom";
 
const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
       setIsMenuOpen(!isMenuOpen);
    };
   
   
    return(
        <> 
            <div className=" p-6">
                   <Navbar />        
                    <div className="space-grotesk-font text-white  text-center mx-auto mt-10 text-[3rem] w-[30%]">
                        Hiring And <span className="text-primary-dark">Outsourcing</span> like never before
                    </div>
                    <div className="text-white text-center mx-auto text-sm w-[30%]">
                         Redefining Talent Acquisition: Innovations Shaping the Future.
                    </div>

                    <div className="font-bold text-white text-center mt-10 mb-[8.5rem]">
                        <Link to={'/signup'}><button className="font-bold bg-primary-dark p-4 px-12 rounded-full">Create Account</button></Link>
                    </div>
                     

        </div>           
        </>
    )
};

export default Home;

 