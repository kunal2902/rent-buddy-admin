"use client";

import {
	Menu,
	PanelLeftClose,
	PanelLeftOpen,
	Search,
	ShoppingBag, Users,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
	AvatarPopupComponent,
	useMainNavbar,
} from "@/components";
import {
	dashboardRoute, getName,
	useThemeProvider,
} from "@/utils";

function NotifButton({ icon: Icon, label, darkMode }: {
	icon: React.ElementType;
	label: string;
	darkMode: boolean;
}) {
	return (
		<button
			type="button"
			aria-label={label}
			className={twMerge(
				"relative p-2 rounded-xl transition-colors",
				darkMode
					? "text-gray-400 hover:bg-white/10 hover:text-gray-200"
					: "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
			)}
		>
			<Icon size={19} />
			<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white dark:ring-gray-900" />
		</button>
	);
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export const MainNavbar = () => {
	const { toggleSidebar, isSidebarOpen } = useMainNavbar();
	const { darkMode } = useThemeProvider();

	const [name, setName] = useState<string>("");
	const [role, setRole] = useState<string>("Admin");
	const [showMobileSearch, setShowMobileSearch] = useState(false);

	useEffect(() => {
		// Reuse your existing getName() — swap getRole() for however you fetch the role
		const timeout = setTimeout(() => {
			setName(getName());
			// If you have a getRole() helper, call it here; otherwise leave as "Admin"
			// setRole(getRole());
		}, 800);
		return () => clearTimeout(timeout);
	}, []);

	const initials = name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<header
			className={twMerge(
				"w-full h-[60px] fixed top-0 left-0 z-30",
				"flex items-center justify-between px-4 gap-3",
				"border-b shadow-sm",
				darkMode
					? "bg-gray-900 border-gray-800"
					: "bg-white border-gray-100"
			)}
		>

			{/* Desktop left */}
			<div className="hidden md:flex items-center gap-3 flex-1 min-w-0">
				{/* Logo */}
				<Link
					href={dashboardRoute}
					className={twMerge(
						"text-[20px] font-black tracking-tight flex-shrink-0",
						darkMode ? "text-white" : "text-gray-900"
					)}
				>
					LOGO
				</Link>

				{/* Sidebar collapse toggle */}
				<button
					type="button"
					onClick={toggleSidebar}
					aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
					className={twMerge(
						"p-1.5 rounded-lg flex-shrink-0 transition-colors",
						darkMode
							? "text-gray-400 hover:bg-white/10 hover:text-gray-200"
							: "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
					)}
				>
					{isSidebarOpen ? (
						<PanelLeftClose size={17} />
					) : (
						<PanelLeftOpen size={17} />
					)}
				</button>

				{/* Search bar */}
				<div
					className={twMerge(
						"flex items-center gap-2 rounded-xl px-3 py-2 w-[260px] border transition-colors",
						darkMode
							? "bg-gray-800 border-gray-700 focus-within:border-gray-500"
							: "bg-gray-50 border-gray-200 focus-within:border-gray-300"
					)}
				>
					<Search
						size={14}
						className={darkMode ? "text-gray-500" : "text-gray-400"}
					/>
					<input
						type="text"
						placeholder="Search product"
						className={twMerge(
							"flex-1 text-[13px] bg-transparent outline-none",
							darkMode
								? "text-gray-200 placeholder-gray-500"
								: "text-gray-700 placeholder-gray-400"
						)}
					/>
				</div>
			</div>

			{/* Mobile left — Avatar + user info */}
			<div className="flex md:hidden items-center gap-2.5 flex-1 min-w-0">
				{/* Avatar — reuses the same gradient as the sidebar */}
				<div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden">
					<div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[12px] font-bold">
						{initials || "?"}
					</div>
				</div>
				<div className="min-w-0">
					<p
						className={twMerge(
							"text-[14px] font-bold truncate leading-tight",
							darkMode ? "text-white" : "text-gray-900"
						)}
					>
						{name || "Loading…"}
					</p>
					<p className="text-[12px] text-gray-400 leading-tight capitalize">
						{role}
					</p>
				</div>
			</div>

			{/* Desktop right */}
			<div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
				<NotifButton
					icon={ShoppingBag}
					label="Order notifications"
					darkMode={darkMode}
				/>
				<NotifButton
					icon={Users}
					label="Customer notifications"
					darkMode={darkMode}
				/>

				{/* Divider */}
				<div
					className={twMerge(
						"w-px h-6 mx-1",
						darkMode ? "bg-gray-700" : "bg-gray-200"
					)}
				/>

				{/* Avatar popup — now shows name inline as the trigger */}
				<AvatarPopupComponent
					customTrigger={
						<div
							className={twMerge(
								"flex items-center gap-2.5 cursor-pointer rounded-xl px-2 py-1.5 transition-colors",
								darkMode
									? "hover:bg-white/10"
									: "hover:bg-gray-50"
							)}
						>
							<div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
								<div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold">
									{initials || "?"}
								</div>
							</div>
							<div className="text-left">
								<p
									className={twMerge(
										"text-[13px] font-semibold leading-tight",
										darkMode ? "text-white" : "text-gray-800"
									)}
								>
									{name || "Loading…"}
								</p>
								<p className="text-[11px] text-gray-400 leading-tight capitalize">
									{role}
								</p>
							</div>
						</div>
					}
				/>
			</div>

			{/* Mobile right — search icon + hamburger */}
			<div className="flex md:hidden items-center gap-1 flex-shrink-0">
				<button
					type="button"
					aria-label="Search"
					onClick={() => setShowMobileSearch((v) => !v)}
					className={twMerge(
						"p-2 rounded-lg transition-colors",
						darkMode
							? "text-gray-400 hover:bg-white/10 hover:text-gray-200"
							: "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
					)}
				>
					<Search size={18} />
				</button>

				<button
					type="button"
					aria-label="Toggle sidebar"
					onClick={toggleSidebar}
					className={twMerge(
						"p-2 rounded-lg transition-colors",
						darkMode
							? "text-gray-400 hover:bg-white/10 hover:text-gray-200"
							: "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
					)}
				>
					<Menu size={18} />
				</button>
			</div>

			{/* ── Mobile search expansion (slides down) ─────────────────────── */}
			{showMobileSearch && (
				<div
					className={twMerge(
						"absolute top-full left-0 right-0 px-4 py-2.5 border-b shadow-sm md:hidden",
						darkMode
							? "bg-gray-900 border-gray-800"
							: "bg-white border-gray-100"
					)}
				>
					<div
						className={twMerge(
							"flex items-center gap-2 rounded-xl px-3 py-2 border",
							darkMode
								? "bg-gray-800 border-gray-700"
								: "bg-gray-50 border-gray-200"
						)}
					>
						<Search
							size={14}
							className={darkMode ? "text-gray-500" : "text-gray-400"}
						/>
						<input
							autoFocus
							type="text"
							placeholder="Search product"
							className={twMerge(
								"flex-1 text-[13px] bg-transparent outline-none",
								darkMode
									? "text-gray-200 placeholder-gray-500"
									: "text-gray-700 placeholder-gray-400"
							)}
						/>
					</div>
				</div>
			)}
		</header>
	);
};
