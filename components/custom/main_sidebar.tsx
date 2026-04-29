/* eslint-disable max-len */

"use client";

import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	ChevronDown,
	ChevronUp,
	HelpCircle,
	Moon,
	PanelLeftClose, PanelLeftOpen,
	Sun,
} from "lucide-react";
import { useRecoilState } from "recoil";
import { NavLinkComponent, ScrollAreaComponent, TooltipComponent, useSidebarItems } from "@/components";
import { LinkType, SideBarProps, SideBarType, SubMenuType } from "@/constants";
import {
	activityLogsName,
	appColorRGBA, customersName, dashboardName,
	getSurfaceColor, inventoryName,
	mantineNavLinkChildOffset, reportsName, settingsName,
	sidebarStateAtom, usersName,
	useSidebarState,
	useThemeProvider,
} from "@/utils";
import { ProductsNavSection } from "@/components/custom/products_section";

const GENERAL_SECTION = [
	dashboardName,
	inventoryName,
	customersName,
	reportsName,
	activityLogsName,
];
const TOOLS_SECTION = [usersName, settingsName];

// ─── Props ────────────────────────────────────────────────────────────────────
interface MainSidebarProps {
	companyName?: string;
	user?: {
		name: string;
		role: string;
		avatarUrl?: string;
	};
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
function ToggleSwitch({ enabled, onToggle }: {
	enabled: boolean;
	onToggle: () => void;
}) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={enabled}
			onClick={onToggle}
			className={twMerge(
				"relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
				enabled ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-600"
			)}
		>
			<span
				className={twMerge(
					"absolute top-[3px] left-[3px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-transform duration-200",
					enabled ? "translate-x-4" : "translate-x-0"
				)}
			/>
		</button>
	);
}

// ─── Sub-item list with tree connector lines ──────────────────────────────────
function SubItemList({ options, currentPathname }: {
	options: Array<SideBarProps<SideBarType>>;
	currentPathname: string;
}) {
	const isActive = (link: string) =>
		currentPathname === link || currentPathname.startsWith(`${link}/`);

	return (
		<div className="relative mt-0.5 pb-1">
			{/* Vertical connector line */}
			<span
				aria-hidden
				className="absolute left-[11px] top-0 bottom-2 w-px bg-gray-200 dark:bg-gray-700"
			/>
			<ul className="pl-7 space-y-0.5">
				{options.map((sub) => {
					if (sub.type !== SideBarType.Simple || !("link" in sub.other)) { return null; }
					const active = isActive((sub.other as LinkType).link);
					return (
						<li key={sub.id} className="relative">
							{/* Horizontal connector tick */}
							<span
								aria-hidden
								className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-px bg-gray-200 dark:bg-gray-700"
							/>
							<Link
								href={(sub.other as LinkType).link}
								className={twMerge(
									"block text-[13px] py-[6px] px-2 rounded-md transition-colors duration-150",
									active
										? "text-blue-600 font-semibold"
										: "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5"
								)}
							>
								{sub.title}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

// ─── Single nav item (handles simple + nested) ────────────────────────────────
function NavItem({ item, isOpen, openedIds, onToggle, currentPathname }: {
	item: SideBarProps<SideBarType>;
	isOpen: boolean;
	openedIds: Set<number>;
	onToggle: (id: number) => void;
	currentPathname: string;
}) {
	const { Icon } = item;

	const isLinkActive = (link: string) =>
		currentPathname === link || currentPathname.startsWith(`${link}/`);

	// ── Simple link ──────────────────────────────────────────────────────────
	if (item.type === SideBarType.Simple && "link" in item.other) {
		const active = isLinkActive((item.other as LinkType).link);
		return (
			<Link
				href={(item.other as LinkType).link}
				title={!isOpen ? item.title : undefined}
				className={twMerge(
					"flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 group",
					active
						? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
						: "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100",
					!isOpen && "justify-center px-0"
				)}
			>
				<Icon
					size={17}
					className={twMerge(
						"flex-shrink-0 transition-colors",
						active
							? "text-blue-500"
							: "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
					)}
				/>
				{isOpen && <span className="truncate">{item.title}</span>}
			</Link>
		);
	}

	// ── Nested / expandable ───────────────────────────────────────────────────
	if (item.type === SideBarType.Nested && "options" in item.other) {
		const { options, ActiveIcon } = item.other as SubMenuType;
		const isExpanded = openedIds.has(item.id);
		const hasActiveChild = options.some(
			(sub) =>
				sub.type === SideBarType.Simple &&
				"link" in sub.other &&
				isLinkActive((sub.other as LinkType).link)
		);
		const DisplayIcon = hasActiveChild || isExpanded ? ActiveIcon ?? Icon : Icon;

		return (
			<div>
				<button
					type="button"
					onClick={() => onToggle(item.id)}
					title={!isOpen ? item.title : undefined}
					className={twMerge(
						"w-full flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 group",
						hasActiveChild || isExpanded
							? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
							: "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100",
						!isOpen && "justify-center px-0"
					)}
				>
					<DisplayIcon
						size={17}
						className={twMerge(
							"flex-shrink-0 transition-colors",
							hasActiveChild || isExpanded
								? "text-blue-500"
								: "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
						)}
					/>
					{isOpen && (
						<>
							<span className="flex-1 text-left truncate">{item.title}</span>
							{isExpanded ? (
								<ChevronUp size={13} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
							) : (
								<ChevronDown size={13} className="flex-shrink-0 text-gray-400 dark:text-gray-500" />
							)}
						</>
					)}
				</button>

				{isExpanded && isOpen && (
					<SubItemList options={options} currentPathname={currentPathname} />
				)}
			</div>
		);
	}

	return null;
}

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ label, isOpen }: { label: string; isOpen: boolean }) {
	if (!isOpen) {
		return (
			<div className="flex justify-center py-2">
				<span className="block w-4 h-px bg-gray-200 dark:bg-gray-700" />
			</div>
		);
	}
	return (
		<p className="px-3 mb-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400 dark:text-gray-500 select-none">
			{label}
		</p>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────
export const MainSidebar = ({
								companyName = "Company",
								user = { name: "Admin User", role: "Admin" },
							}: MainSidebarProps = {}) => {
	const currentPathname = usePathname();
	const { darkMode, toggleDarkMode } = useThemeProvider();
	const [isSidebarOpen, setSidebarOpen] = useRecoilState<boolean>(sidebarStateAtom);
	const sidebarItems = useSidebarItems();
	const [openedIds, setOpenedIds] = useState<Set<number>>(new Set());

	const generalItems = sidebarItems.filter((i) =>
		GENERAL_SECTION.includes(i.title)
	);
	const toolsItems = sidebarItems.filter((i) =>
		TOOLS_SECTION.includes(i.title)
	);

	const isLinkActive = (link: string) =>
		currentPathname === link || currentPathname.startsWith(`${link}/`);

	// Auto-expand parent whose child matches current path on navigation
	useEffect(() => {
		const toOpen = new Set<number>();
		sidebarItems.forEach((item) => {
			if (item.type === SideBarType.Nested && "options" in item.other) {
				const { options } = item.other as SubMenuType;
				const hasActive = options.some(
					(sub) =>
						sub.type === SideBarType.Simple &&
						"link" in sub.other &&
						isLinkActive((sub.other as LinkType).link)
				);
				if (hasActive) toOpen.add(item.id);
			}
		});
		setOpenedIds((prev) => new Set([...prev, ...toOpen]));
	}, [currentPathname]);

	const toggleItem = (id: number) => {
		setOpenedIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const initials = user.name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<aside
			className={twMerge(
				"fixed z-20 top-0 left-0 h-screen flex flex-col",
				"bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800",
				"transition-[width] duration-300 ease-in-out overflow-hidden shadow-sm",
				isSidebarOpen ? "w-64" : "w-[56px]"
			)}
		>
			{/* ── Header ──────────────────────────────────────────────────────── */}
			<div
				className={twMerge(
					"flex items-center h-[60px] px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0",
					isSidebarOpen ? "justify-between" : "justify-center"
				)}
			>
				{isSidebarOpen && (
					<span className="text-[20px] font-black tracking-tight text-gray-900 dark:text-white">
						LOGO
					</span>
				)}
				<button
					type="button"
					onClick={() => setSidebarOpen((v) => !v)}
					className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
					aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
				>
					{isSidebarOpen ? (
						<PanelLeftClose size={17} />
					) : (
						<PanelLeftOpen size={17} />
					)}
				</button>
			</div>

			{/* ── Company selector ─────────────────────────────────────────────── */}
			{isSidebarOpen && (
				<div className="px-4 pt-4 pb-2 flex-shrink-0">
					<button
						type="button"
						className={twMerge(
							"w-full flex items-center justify-between",
							"border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5",
							"hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/60",
							"transition-all duration-150 text-left group"
						)}
					>
						<div>
							<p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 leading-none mb-1">
								Company
							</p>
							<p className="text-[13px] font-bold text-gray-800 dark:text-gray-100 leading-none">
								{companyName}
							</p>
						</div>
						<ChevronDown
							size={13}
							className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
						/>
					</button>
				</div>
			)}

			{/* ── Scrollable nav ───────────────────────────────────────────────── */}
			<ScrollAreaComponent
				scrollbars="y"
				className={twMerge(
					"flex-1",
					isSidebarOpen ? "w-64" : "w-[56px]"
				)}
			>
				<nav className="px-3 py-4 flex flex-col gap-5">
					{/* GENERAL section */}
					{generalItems.length > 0 && (
						<div className="space-y-0.5">
							<SectionLabel label="General" isOpen={isSidebarOpen} />
							{generalItems.map((item) =>
     item.title === inventoryName ? (
	<ProductsNavSection key={item.id} isOpen={isSidebarOpen} />
     ) : (
	<NavItem
		key={item.id}
		item={item}
		isOpen={isSidebarOpen}
		openedIds={openedIds}
		onToggle={toggleItem}
		currentPathname={currentPathname}
       />
     )
   )}
						</div>
					)}

					{/* TOOLS section */}
					{(toolsItems.length > 0 || true) && (
						<div className="space-y-0.5">
							<SectionLabel label="Tools" isOpen={isSidebarOpen} />

							{toolsItems.map((item) => (
								<NavItem
									key={item.id}
									item={item}
									isOpen={isSidebarOpen}
									openedIds={openedIds}
									onToggle={toggleItem}
									currentPathname={currentPathname}
								/>
							))}

							{/* Help */}
							<button
								type="button"
								title={!isSidebarOpen ? "Help" : undefined}
								className={twMerge(
									"w-full flex items-center gap-3 px-3 py-[7px] rounded-lg",
									"text-[13px] font-medium text-gray-600 dark:text-gray-400",
									"hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100",
									"transition-all duration-150 group",
									!isSidebarOpen && "justify-center px-0"
								)}
							>
								<HelpCircle
									size={17}
									className="flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
								/>
								{isSidebarOpen && <span>Help</span>}
							</button>

							{/* Dark mode toggle */}
							{isSidebarOpen ? (
								<div className="flex items-center justify-between px-3 py-[7px] rounded-lg text-[13px] font-medium text-gray-600 dark:text-gray-400">
									<div className="flex items-center gap-3">
										<Moon
											size={17}
											className="flex-shrink-0 text-gray-400 dark:text-gray-500"
										/>
										<span>Dark Mode</span>
									</div>
									<ToggleSwitch
										enabled={darkMode}
										onToggle={toggleDarkMode}
									/>
								</div>
							) : (
								<button
									type="button"
									title="Dark Mode"
									onClick={toggleDarkMode}
									className="w-full flex justify-center px-0 py-[7px] rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-600 transition-colors"
								>
									{darkMode ? (
										<Sun size={17} className="text-amber-400" />
									) : (
										<Moon size={17} />
									)}
								</button>
							)}
						</div>
					)}
				</nav>
			</ScrollAreaComponent>

			{/* ── User profile ─────────────────────────────────────────────────── */}
			<div className="border-t border-gray-100 dark:border-gray-800 px-3 py-3 flex-shrink-0">
				<button
					type="button"
					className={twMerge(
						"w-full flex items-center gap-3 px-2 py-2 rounded-xl",
						"hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group",
						!isSidebarOpen && "justify-center px-0"
					)}
				>
					{/* Avatar */}
					<div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
						{user.avatarUrl ? (
							<img
								src={user.avatarUrl}
								alt={user.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold">
								{initials}
							</div>
						)}
					</div>

					{isSidebarOpen && (
						<>
							<div className="flex-1 min-w-0 text-left">
								<p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 truncate leading-tight">
									{user.name}
								</p>
								<p className="text-[11px] text-gray-400 dark:text-gray-500 truncate leading-tight capitalize">
									{user.role}
								</p>
							</div>
							<ChevronDown
								size={13}
								className="flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
							/>
						</>
					)}
				</button>
			</div>
		</aside>
	);
};
