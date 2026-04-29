"use client";

import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import {
	cookieOptions,
	crmJwtConstant,
	emailConstant,
	isAdminAtom,
	isAdminConstant,
	loginApi,
	nameConstant,
	permissionEntitiesAtom,
	permissionEntityConstant,
	roleIdConstant,
	userIdConstant,
	userNameConstant,
} from "@/utils";
import ShowNotification from "@/components/mantine/show_notification";

const LoginContainer = () => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const [password, setPassword] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [rememberMe, setRememberMe] = useState<boolean>(false);
	const setIsAdmin = useSetRecoilState(isAdminAtom);
	const setPermissionEntities = useSetRecoilState(permissionEntitiesAtom);

	const handleLogin = async (event: React.FormEvent | React.MouseEvent) => {
		event.preventDefault();
		setLoading(true);
		try {
			await loginApi(
				email,
				password,
				(result: any) => {
					ShowNotification(result.message, "success");
					setCookie(crmJwtConstant, result.data.authToken, cookieOptions);
					setCookie(userIdConstant, result.data.user.user_id, cookieOptions);
					setCookie(nameConstant, result.data.user.name, cookieOptions);
					setCookie(emailConstant, result.data.user.email, cookieOptions);
					setCookie(userNameConstant, result.data.user.username, cookieOptions);
					setCookie(roleIdConstant, result.data.user.role_id, cookieOptions);
					setCookie(isAdminConstant, result.data.user.role.isAdmin, cookieOptions);

					const permissionEntities = result.data.user.role.permission_entities;
					setCookie(
						permissionEntityConstant,
						JSON.stringify(permissionEntities),
						cookieOptions
					);
					setPermissionEntities(permissionEntities);
					setIsAdmin(result.data.user.role.isAdmin);

					router.replace("/");
					setTimeout(() => setLoading(false), 1500);
				},
				(err: any) => {
					setLoading(false);
					ShowNotification(err, "error");
					console.log(err.message);
				}
			);
		} catch (error) {
			setLoading(false);
			console.error("Login failed:", error);
		}
	};

	return (
		<div className="min-h-screen flex w-full">
			{/* ── Left Panel (form) ── */}
			<div className="flex flex-1 items-center justify-center bg-white px-6 py-12 lg:px-16">
				<div className="w-full lg:w-2/3">
					{/* Brand */}
					<h1 className="text-[44px] font-semibold text-gray-900 tracking-tight mb-6">
						RentBuddiez
					</h1>

					{/* Heading + sub-text */}
					<h2 className="text-3xl font-semibold text-gray-900 mb-2">Sign Up</h2>
					<p className="text-sm text-gray-500 mb-7 leading-relaxed">
						Lorem ipsum dolor sit amet consectetur. Leo eget quam dui in posuere nula.
					</p>

					{/* Google Sign In */}
					<button
						type="button"
						className="w-full flex items-center justify-center gap-3 border rounded-lg py-2.5 text-sm font-bold text-[#1A71F6] hover:bg-gray-50 transition-colors mb-5 border-[#1A71F6]"
					>
						{/* Google G SVG */}
						<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
							<path
								d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
								fill="#4285F4"
							/>
							<path
								d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
								fill="#34A853"
							/>
							<path
								d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
								fill="#FBBC05"
							/>
							<path
								d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
								fill="#EA4335"
							/>
						</svg>
						Sign In with Google
					</button>

					{/* Or divider */}
					<div className="flex items-center gap-3 mb-5">
						<div className="flex-1 h-px bg-gray-200" />
						<span className="text-sm text-gray-400">Or</span>
						<div className="flex-1 h-px bg-gray-200" />
					</div>

					<form onSubmit={handleLogin} noValidate>
						{/* Email */}
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Email
							</label>
							<div className="relative">
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="yogavwijaya@gmail.com"
									className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition pr-10"
								/>
								{email && (
									<span className="absolute right-3 top-1/2 -translate-y-1/2">
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
											<circle cx="10" cy="10" r="10" fill="#2563EB" />
											<path
												d="M6 10.5l3 3 5-5"
												stroke="#fff"
												strokeWidth="1.8"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</span>
								)}
							</div>
						</div>

						{/* Password */}
						<div className="mb-5">
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Password
							</label>
							<div className="relative">
								<input
									type={isPasswordVisible ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Input password"
									className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition pr-10"
								/>
								<button
									type="button"
									onClick={() => setIsPasswordVisible((v) => !v)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
								>
									{isPasswordVisible ? (
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
											<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
											<line x1="1" y1="1" x2="23" y2="23" />
										</svg>
									) : (
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
											<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
											<circle cx="12" cy="12" r="3" />
										</svg>
									)}
								</button>
							</div>
						</div>

						{/* Remember me + Forgot password */}
						<div className="flex items-center justify-between mb-6">
							<label className="flex items-center gap-2 cursor-pointer select-none">
								<input
									type="checkbox"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									className="w-4 h-4 rounded border-gray-300 accent-blue-600"
								/>
								<span className="text-sm text-gray-600">Remember me ?</span>
							</label>
							<button
								type="button"
								onClick={() => {}}
								className="text-sm text-blue-600 hover:underline font-medium"
							>
								Forget Password
							</button>
						</div>

						{/* Sign In button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{loading && (
								<svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
								</svg>
							)}
							Sign In
						</button>
					</form>

					{/* Sign Up link */}
					<p className="text-center text-sm text-gray-500 mt-6">
						Do not have account?{" "}
						<button
							type="button"
							onClick={() => router.push("/register")}
							className="text-blue-600 font-semibold hover:underline"
						>
							Sign Up
						</button>
					</p>
				</div>
			</div>

			{/* ── Right Panel (desktop only) ── */}
			<div
				className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden"
				style={{ background: "linear-gradient(140deg, #1d4ed8 0%, #2563eb 55%, #1e40af 100%)" }}
			>
				{/* Decorative hexagons – top-right */}
				<svg className="absolute top-3 right-10 opacity-30" width="80" height="92" viewBox="0 0 80 92">
					<polygon points="40,5 75,23 75,69 40,87 5,69 5,23" stroke="white" strokeWidth="2" fill="none" />
				</svg>
				<svg className="absolute top-16 right-0 opacity-20" width="52" height="60" viewBox="0 0 52 60">
					<polygon points="26,3 49,15 49,45 26,57 3,45 3,15" stroke="white" strokeWidth="2" fill="none" />
				</svg>

				{/* Decorative hexagons – bottom-left */}
				<svg className="absolute bottom-12 left-2 opacity-20" width="90" height="104" viewBox="0 0 90 104">
					<polygon points="45,5 85,27 85,77 45,99 5,77 5,27" stroke="white" strokeWidth="2" fill="none" />
				</svg>
				<svg className="absolute bottom-2 right-4 opacity-25" width="60" height="70" viewBox="0 0 60 70">
					<polygon points="30,4 56,18 56,52 30,66 4,52 4,18" stroke="white" strokeWidth="2" fill="none" />
				</svg>

				{/* Main content */}
				<div className="relative z-10 flex flex-col items-center px-10 text-center w-[80%]">
					{/* Dashboard frame image */}
					<div className="w-full rounded-2xl overflow-hidden shadow-2xl mb-8 border border-white/10">
						<img
							src="/images/login/dashboard.png"
							alt="Dashboard preview"
							className="w-full h-auto object-cover"
						/>
					</div>

					{/* Tagline */}
					<h2 className="text-white text-4xl font-semibold leading-snug mb-3">
						Easy-to-Use Dashboard for<br />Managing Your Business.
					</h2>
					<p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-sm">
						{/* eslint-disable-next-line max-len */}
						Streamline Your Business Management with Our User-Friendly Dashboard. Simplify
						complex tasks, track key metrics, and make informed decisions effortlessly
					</p>

					{/* Dot indicators */}
					<div className="flex items-center gap-2">
						<span className="w-6 h-2 rounded-full bg-white" />
						<span className="w-2 h-2 rounded-full bg-white/40" />
						<span className="w-2 h-2 rounded-full bg-white/40" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginContainer;
