import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  Coffee,
  ChefHat,
  UserPlus,
  Award,
  Heart,
  Sparkles,
  ArrowRight
} from "lucide-react";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleBookTable = () => {
    navigate("/booking");
  };

  const handleViewMenu = () => {
    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-latte-50 to-cream-50">
      {/* Hero Section with enhanced elegance */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
            alt="Restaurant atmosphere"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-coffee-900/80 via-coffee-800/70 to-coffee-700/60"></div>
        </div>

        {/* Floating coffee beans decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-coffee-400 rounded-full opacity-20 animate-float-1"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-coffee-300 rounded-full opacity-30 animate-float-2"></div>
          <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-coffee-500 rounded-full opacity-15 animate-float-3"></div>
          <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-coffee-200 rounded-full opacity-25 animate-float-4"></div>
        </div>

        {/* Hero content with refined typography */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Coffee icon with elegant animation */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 animate-bounce-gentle">
              <Coffee className="w-10 h-10 text-cream animate-pulse-gentle" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-serif tracking-tight">
            DINING
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-latte-200 to-coffee-200 animate-shimmer-text">
              EXPERIENCE FOR
            </span>
            <br />
            <span className="text-cream">EVERY OCCASION</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-cream/90 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Premium restaurant booking platform and group dining coordination with seamless ordering
          </p>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleBookTable}
              className="group relative px-10 py-4 bg-white text-coffee-900 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-warm-xl flex items-center space-x-3 overflow-hidden"
            >
              <span className="relative z-10">Book Your Table</span>
              <Calendar className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-cream to-latte-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button
              onClick={handleViewMenu}
              className="group relative px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-coffee-900 hover:scale-105 flex items-center space-x-3"
            >
              <span>View Menu</span>
              <ChefHat className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Services Section with refined cards */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-coffee-900 mb-6 font-serif">Our Premium Services</h2>
            <p className="text-xl text-coffee-600 max-w-3xl mx-auto leading-relaxed">
              Experience excellence in every detail with our curated dining services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ChefHat,
                title: "Premium Dining",
                description: "Curated culinary experiences with world-class chefs and premium ingredients",
                color: "from-coffee-600 to-coffee-800"
              },
              {
                icon: Users,
                title: "Group Booking",
                description: "Seamless coordination for group dining with smart ordering and split billing",
                color: "from-latte-600 to-coffee-700"
              },
              {
                icon: Calendar,
                title: "Table Reservations",
                description: "Instant table booking with real-time availability and personalized preferences",
                color: "from-cream-600 to-latte-700"
              },
              {
                icon: Star,
                title: "Curated Menu",
                description: "Handpicked dishes featuring seasonal ingredients and signature preparations",
                color: "from-coffee-700 to-coffee-900"
              }
            ].map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-warm hover:shadow-warm-xl transition-all duration-500 hover:-translate-y-2 border border-coffee-100/50 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-warm`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-coffee-900 mb-4 font-serif group-hover:text-coffee-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-coffee-600 leading-relaxed group-hover:text-coffee-800 transition-colors">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with elegant styling */}
      <section className="py-24 bg-gradient-to-br from-coffee-50 to-latte-100 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-coffee-pattern opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold text-coffee-900 mb-8 font-serif leading-tight">
                Revolutionizing Group Dining Experience
              </h2>
              <p className="text-xl text-coffee-700 mb-8 leading-relaxed">
                Our platform brings together the joy of shared dining with the convenience of modern technology, 
                creating unforgettable culinary experiences for every occasion.
              </p>
              
              <div className="space-y-6">
                {[
                  "Smart group coordination and ordering",
                  "Real-time menu synchronization",
                  "Seamless payment splitting",
                  "Premium table reservations"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-coffee-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-coffee-800 font-medium text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg"
                  alt="Group dining experience"
                  className="rounded-3xl shadow-warm-xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/20 to-transparent rounded-3xl"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full shadow-warm-lg flex items-center justify-center animate-bounce-gentle">
                <Coffee className="w-10 h-10 text-coffee-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with sophisticated design */}
      <section className="py-24 bg-coffee-900 relative overflow-hidden">
        {/* Elegant background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-coffee-800 via-coffee-900 to-coffee-950"></div>
          <div className="absolute inset-0 bg-coffee-pattern opacity-10"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">Get in Touch</h2>
            <p className="text-xl text-cream/80 max-w-2xl mx-auto">
              Ready to elevate your dining experience? Contact us today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: "Call Us",
                content: "+1 (555) 123-4567",
                subtitle: "Available 24/7"
              },
              {
                icon: Mail,
                title: "Email Us",
                content: "hello@browntable.com",
                subtitle: "Quick response guaranteed"
              },
              {
                icon: MapPin,
                title: "Visit Us",
                content: "123 Culinary Street",
                subtitle: "Downtown District"
              }
            ].map((contact, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cream to-latte-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <contact.icon className="w-8 h-8 text-coffee-900" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-serif">{contact.title}</h3>
                <p className="text-cream text-lg font-medium mb-1">{contact.content}</p>
                <p className="text-cream/60 text-sm">{contact.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
