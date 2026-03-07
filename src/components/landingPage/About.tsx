
import { Leaf, BarChart3, Users } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="w-full bg-green-50 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
            
            {/* Heading */}
            <h2 className="text-4xl font-bold text-green-700 mb-6">
                About Sustainable Living Tracker
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto mb-12">
                Sustainable Living Tracker empowers individuals to monitor daily habits,
                understand their environmental impact, and adopt eco-friendly practices.
                By combining structured habit tracking, smart insights, and community
                sharing, the platform makes sustainable living measurable, motivating,
                and achievable.
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
            
                {/* Habit Tracking */}
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                    <Leaf className="mx-auto text-green-600 mb-4" size={40} />
                    
                    <h3 className="text-xl font-semibold mb-2">Habit Tracking</h3>
                    
                    <p className="text-gray-600">
                        Log and track eco-friendly habits daily to build consistency
                        and long-term sustainable routines.
                    </p>
                </div>

                {/* Smart Insights */}
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                    <BarChart3 className="mx-auto text-green-600 mb-4" size={40} />
                    
                    <h3 className="text-xl font-semibold mb-2">Smart Insights</h3>
                    
                    <p className="text-gray-600">
                        Visualize progress and understand your environmental impact
                        through data-driven dashboards.
                    </p>
                </div>

                {/* Community Sharing */}
                <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
                    <Users className="mx-auto text-green-600 mb-4" size={40} />
                    
                    <h3 className="text-xl font-semibold mb-2">Community Sharing</h3>
                    
                    <p className="text-gray-600">
                        Connect with others, share sustainable ideas, and stay motivated
                        through collective impact.
                    </p>
                </div>

            </div>
        </div>
    </section>
  )
}

export default About