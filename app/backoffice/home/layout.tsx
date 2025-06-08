import "../../globals.css";
import Sidebar from "./components/SideBar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex gap-2">
            <div>
                <Sidebar />
            </div>
            <div className="w-full mr-12">
                {children}
            </div>
        </div>
    );
}
