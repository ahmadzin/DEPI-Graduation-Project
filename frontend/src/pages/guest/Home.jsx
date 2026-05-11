import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Clock, Shield, Star, ChevronRight, Truck, CreditCard, Headphones } from "lucide-react";

export default function Home() {
  return (
    <div>

      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Premium Food Delivery</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Great food delivered
              <span className="text-orange-500"> to your door</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Order from the best restaurants in your area. Fast delivery, great prices, and quality ingredients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/restaurants"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Order now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/restaurants"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-orange-300 bg-white text-gray-700 px-8 py-3.5 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              >
                Browse restaurants
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why choose DigiDish</h2>
            <p className="text-gray-500 max-w-md mx-auto">Experience the best food delivery service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Fast delivery",
                description: "Get your food delivered in 30 minutes or less",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Star,
                title: "Top restaurants",
                description: "Hand-picked restaurants with the best ratings",
                color: "from-orange-500 to-orange-600"
              },
              {
                icon: CreditCard,
                title: "Secure payment",
                description: "Multiple secure payment options available",
                color: "from-emerald-500 to-emerald-600"
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to start your order?</h2>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Join thousands of happy customers ordering their favorite meals
              </p>
              <Link
                to="/restaurants"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
