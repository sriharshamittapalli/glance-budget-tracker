
import { 
  BarChart3, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Home,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
};

const navItems: NavItem[] = [
  { name: "Dashboard", icon: Home, href: "/" },
  { name: "Expenses", icon: CreditCard, href: "/expenses" },
  { name: "Budgets", icon: DollarSign, href: "/budgets" },
  { name: "Reports", icon: BarChart3, href: "/reports" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-budget-purple-500">Glance</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    window.location.pathname === item.href
                      ? "text-budget-purple-500 bg-budget-purple-100"
                      : "text-gray-600 hover:text-budget-purple-500 hover:bg-budget-purple-100"
                  }`}
                >
                  <item.icon className="mr-1.5 h-4 w-4" />
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-budget-purple-500 hover:bg-budget-purple-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  window.location.pathname === item.href
                    ? "text-budget-purple-500 bg-budget-purple-100"
                    : "text-gray-600 hover:text-budget-purple-500 hover:bg-budget-purple-100"
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
