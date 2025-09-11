import { Bell, Home, Users, GitCompare, Plus } from "lucide-react";
import {Link, useLocation} from "react-router-dom";
import { Button } from "@/components/ui/Button";

const Navigation = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/roommates', icon: Users, label: 'Roommates' },
        { path: '/compare', icon: GitCompare, label: 'Compare' },
        { path: '/post', icon: Plus, label: 'Post' }
    ];

    return (
        <>
        <header className="bg-card border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                        <Home className="w-8 h-8 text-primary-foreground"/>
                    </div>
                    <span className="text-xl font-bold text-foreground">PackHusky</span>
                </Link>

                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-0 bg-primary rounded-full w-3 h-3 flex items-center justify-center">
                            <span className="text-xs font-medium text-primary-foreground">2</span>
                        </span>
                    </Button>                
                </div> 
            </div>
        </header>

        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
            <div className="grid grid-cols-4 h-16">
                {
                    navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center space-y-1 transition-colors 
                                    ${isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'}`}
                            >

                                <Icon className="w-5 h-5" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        )
                    })
                }
            </div>
        </nav>
        </>
    )
}

export default Navigation;