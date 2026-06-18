import CTABanner from "../components/ctabanner";
import Features from "../components/features";
import Hero from "../components/hero";
import Pricing from "../components/pricing";


const Home = () => {
  return (
    <div className="bg-page">
      <Hero/>
      <Features/>
      <Pricing/>
      <CTABanner/>
    </div>
  )
}

export default Home