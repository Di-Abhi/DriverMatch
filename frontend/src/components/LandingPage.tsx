import Header from "./Header";
import Hero from "./Hero";
import Footer from "./Footer";

const LandingPage=()=> {

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)] text-white antialiased">
      
      <Header/>
      <Hero/>

      <section className="py-12">...</section>

      <section className="py-12 bg-[linear-gradient(180deg,#07102a_0%,#07102a_100%)]">...</section>

      <Footer/>
    </div>
  );
}

export default LandingPage