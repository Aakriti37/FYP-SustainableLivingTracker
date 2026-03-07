import HabitTracking from "../../assets/Image1.jpg";
import CarbonCalculator from "../../assets/Carbon Footprint Calculator.jpg";
import AIFeature from "../../assets/AI for suggestion.jpg";
import Community from "../../assets/Community Feed.jpg";

// Updated feature data using imported images
const features = [
  {
    name: "Track Daily Habits",
    description: "Log your sustainable actions daily and monitor your progress over time.",
    image: HabitTracking,
  },
  {
    name: "Carbon Footprint Analysis",
    description: "Get insights on your environmental impact based on your activities.",
    image: CarbonCalculator,
  },
  {
    name: "AI Suggestions",
    description: "Receive AI-based tips to improve your sustainable lifestyle.",
    image: AIFeature,
  },
  {
    name: "Community Feed",
    description: "Engage with a community of eco-conscious users and share ideas.",
    image: Community,
  },
];


const Features = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Features of Sustainable Living Tracker</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
                {features.map((feature, index) => (
                    <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 max-w-sm mx-auto"
                    >
                        {/* Top part - image */}
                        <img
                            src={feature.image}
                            alt={feature.name}
                            className="w-full h-64 object-cover"
                        />
                        
                        {/* Bottom part - name & description */}
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
                            
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default Features