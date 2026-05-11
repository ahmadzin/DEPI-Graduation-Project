import { useState } from "react";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  ShoppingBag,
  CreditCard,
  MapPin,
  Clock,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Truck,
  Store,
  User,
  Shield,
  Star,
  AlertCircle,
  Search
} from "lucide-react";

export default function HelpCenter() {
  const [openQuestions, setOpenQuestions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const allQuestions = [
    
    {
      id: "getting-started",
      category: "Getting Started",
      icon: User,
      questions: [
        {
          id: "create-account",
          question: "How do I create an account?",
          answer: "Click on the 'Sign up' button in the top right corner. Fill in your name, email address, and create a password. You'll receive a confirmation email to verify your account."
        },
        {
          id: "login-issues",
          question: "I can't log in to my account",
          answer: "Make sure you're using the correct email and password. If you forgot your password, click 'Forgot Password' on the login page. You'll receive an email with instructions to reset your password."
        }
      ]
    },
    
    {
      id: "ordering",
      category: "Placing Orders",
      icon: ShoppingBag,
      questions: [
        {
          id: "how-to-order",
          question: "How do I place an order?",
          answer: "Browse restaurants from the homepage or 'Restaurants' page. Select a restaurant, choose your dishes, add them to cart, then proceed to checkout. Review your order, choose delivery method, and confirm payment."
        },
        {
          id: "modify-order",
          question: "Can I modify my order after placing it?",
          answer: "You can modify your order only before the restaurant accepts it. Go to 'My Orders' and click 'Modify Order'. If the restaurant has already started preparing, please contact the restaurant directly."
        },
        {
          id: "cancel-order",
          question: "How do I cancel an order?",
          answer: "Orders can be cancelled within 2 minutes of placing them. Go to 'My Orders', find your order, and click 'Cancel Order'. If the restaurant has already accepted your order, cancellation may not be possible."
        }
      ]
    },
    
    {
      id: "payment",
      category: "Payment & Billing",
      icon: CreditCard,
      questions: [
        {
          id: "payment-methods",
          question: "What payment methods are accepted?",
          answer: "We accept multiple payment methods: Credit/Debit Cards (Visa, Mastercard), Cash on Delivery, and Digital Wallets (PayPal, Apple Pay, Google Pay)."
        },
        {
          id: "payment-failed",
          question: "My payment failed, what should I do?",
          answer: "Check your card details and ensure you have sufficient funds. Try using a different payment method. If the problem persists, contact your bank or our support team."
        }
      ]
    },
    
    {
      id: "delivery",
      category: "Delivery Information",
      icon: Truck,
      questions: [
        {
          id: "delivery-time",
          question: "How long does delivery take?",
          answer: "Delivery time varies by restaurant and your location. Typically, orders arrive within 25-45 minutes. You can track your order in real-time from the 'My Orders' page."
        },
        {
          id: "delivery-fee",
          question: "How is delivery fee calculated?",
          answer: "Delivery fees depend on the restaurant's location, your delivery address, and order value. Minimum order amounts may apply. Free delivery is available for orders above a certain value (varies by restaurant)."
        },
        {
          id: "track-order",
          question: "How do I track my order?",
          answer: "After placing an order, go to 'My Orders' and click on your active order. You'll see real-time updates: Order Confirmed → Restaurant Preparing → Ready for Pickup → Out for Delivery → Delivered."
        }
      ]
    },
   
    {
      id: "restaurants",
      category: "Restaurants",
      icon: Store,
      questions: [
        {
          id: "restaurant-open",
          question: "What do restaurant statuses mean?",
          answer: "🟢 Open: Accepting orders normally, 🟡 Busy: May take longer than usual, 🔴 Closed: Not accepting orders right now. Check operating hours on the restaurant's page."
        },
        {
          id: "report-issues",
          question: "How to report an issue with an order?",
          answer: "Contact our support team within 24 hours of delivery. Provide your order number and details about the issue. We'll investigate and resolve the problem as quickly as possible."
        }
      ]
    },
   
    {
      id: "account",
      category: "Account Settings",
      icon: User,
      questions: [
        {
          id: "update-info",
          question: "How do I update my profile information?",
          answer: "Go to 'Account Settings' from the user menu. You can update your name, email, phone number, and delivery addresses. Don't forget to save your changes."
        },
        {
          id: "change-password",
          question: "How to change my password?",
          answer: "Go to 'Account Settings' → 'Security' → 'Change Password'. Enter your current password and your new password. Make sure your new password is strong and unique."
        },
        {
          id: "delete-account",
          question: "How to delete my account?",
          answer: "Contact our support team to request account deletion. Please note that this action is permanent and you'll lose all your order history and saved addresses."
        }
      ]
    },
   
    {
      id: "safety",
      category: "Safety & Security",
      icon: Shield,
      questions: [
        {
          id: "secure-payment",
          question: "Is my payment information secure?",
          answer: "Yes! We use industry-standard encryption (SSL) to protect your payment information. We never store your full card details on our servers. All transactions are processed through secure payment gateways."
        },
        {
          id: "report-problem",
          question: "How to report a problem with delivery?",
          answer: "Contact our support team immediately through the app or website. Provide your order number and describe the issue. We'll work with the restaurant and delivery partner to resolve it."
        }
      ]
    }
  ];

 
  const categories = [...new Map(allQuestions.map(q => [q.category, q])).values()];

 
  const filteredCategories = categories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl mb-5 shadow-sm">
          <HelpCircle className="w-10 h-10 text-orange-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Find answers to common questions about ordering, delivery, payments, and more
        </p>
      </div>

      
      <div className="mb-10">
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm transition-all shadow-sm"
          />
        </div>
      </div>

      
      <div className="space-y-6">
        {filteredCategories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <div key={category.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
              
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <CategoryIcon className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{category.category}</h2>
                    <p className="text-xs text-gray-400">{category.questions.length} articles</p>
                  </div>
                </div>
              </div>
              
              
              <div className="divide-y divide-gray-100">
                {category.questions.map((q, idx) => (
                  <div key={q.id} className="group">
                    <button
                      onClick={() => toggleQuestion(`${category.id}-${q.id}`)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-orange-100 transition-colors">
                          <span className="text-xs text-gray-500 group-hover:text-orange-500 font-medium">{idx + 1}</span>
                        </div>
                        <span className="font-medium text-gray-800 group-hover:text-orange-500 transition-colors">
                          {q.question}
                        </span>
                      </div>
                      {openQuestions[`${category.id}-${q.id}`] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                      )}
                    </button>
                    
                    {openQuestions[`${category.id}-${q.id}`] && (
                      <div className="px-6 pb-5 pt-0 animate-fadeIn">
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-l-4 border-orange-400">
                          <div className="flex items-start gap-3">
                            <MessageCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                            <p className="text-gray-600 leading-relaxed">{q.answer}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Truck className="w-5 h-5 text-emerald-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-gray-700">Track Order</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <CreditCard className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-gray-700">Payment Methods</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <FileText className="w-5 h-5 text-purple-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-gray-700">Terms & Conditions</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Shield className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-gray-700">Privacy Policy</p>
        </div>
      </div>

      <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-3">
          <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
          <h3 className="text-xl font-semibold">Still need help?</h3>
        </div>
        <p className="text-orange-100 mb-6 max-w-md mx-auto">
          Can't find what you're looking for? Our support team is here to help
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur hover:bg-white/30 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200">
            <Mail className="w-4 h-4" strokeWidth={1.5} />
            Email Support
          </a>
          <a href="#" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur hover:bg-white/30 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200">
            <Phone className="w-4 h-4" strokeWidth={1.5} />
            Call Us 24/7
          </a>
        </div>
      </div>

      
      <div className="mt-8 text-center">

      </div>
    </div>
  );
}