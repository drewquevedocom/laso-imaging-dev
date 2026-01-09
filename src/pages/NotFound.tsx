import { Link } from "react-router-dom";
import { Home, Package, Wrench, Phone, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useChatStore } from "@/stores/chatStore";

const NotFound = () => {
  const { openChat } = useChatStore();

  const quickLinks = [
    { icon: Home, label: "Home", href: "/", description: "Return to homepage" },
    { icon: Package, label: "Equipment", href: "/equipment/mri", description: "Browse MRI, CT & X-Ray" },
    { icon: Wrench, label: "Parts", href: "/parts", description: "Find replacement parts" },
    { icon: Phone, label: "Contact", href: "/contact", description: "Get in touch with us" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Display */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
            </p>
          </div>

          {/* AI Search Prompt */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-card">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Need Help Finding Something?</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Ask LASO AI to help you find equipment, parts, or answers to your questions.
            </p>
            <Button 
              onClick={() => openChat()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Search className="h-4 w-4 mr-2" />
              Ask LASO AI
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-card-hover transition-all duration-200"
              >
                <link.icon className="h-6 w-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-medium text-foreground text-sm">{link.label}</div>
                <div className="text-xs text-muted-foreground">{link.description}</div>
              </Link>
            ))}
          </div>

          {/* Support Contact */}
          <p className="text-muted-foreground text-sm">
            Need immediate assistance? Call us at{" "}
            <a href="tel:1-800-674-5276" className="text-primary hover:underline font-medium">
              1-800-MRI-LASO
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
