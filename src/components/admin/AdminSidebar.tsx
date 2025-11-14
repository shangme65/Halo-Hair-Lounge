"use client";

export default function AdminSidebar() {
  // Sidebar removed - navigation now handled by main Navbar in header
  return null;
}

  return (
    <>
      {/* Desktop Sidebar - Always visible on desktop, hidden on mobile */}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className="hidden lg:block fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-dark-900 border-r border-dark-800 z-40"
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/50"
                        : "text-dark-400 hover:text-white hover:bg-dark-800"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-dark-800">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
