'use client';

import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { ButtonComponent } from '@/components';
import { AddUserModal } from '@/containers/10_users/add_user_modal';

export const PosCartSection = () => {
	const [isUserModalOpen, setUserModalOpen] = useState(false);

	return (
		<>
			<AddUserModal
				isOpen={isUserModalOpen}
				onClose={() => {
					setUserModalOpen(false);
				}}
			/>
			<div className="w-[30%] p-2">
				<div className="flex py-2">
					<select
						id="countries"
						className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					>
						<option selected>Choose a User</option>
						<option value="US">User 1</option>
						<option value="CA">User 2</option>
						<option value="FR">User 3</option>
						<option value="DE">User 4</option>
					</select>
					<ButtonComponent
						className={twMerge(
							'bg-grey-900 ml-2 w-16 text-grey-100'
						)}
						title="+"
						onClick={() => {
							setUserModalOpen(true);
						}}
					/>
				</div>
				<h1 className="text-2xl font-bold text-left w-full">
					Order Details
				</h1>
				<div className="divide-y divide-dashed">
					<div className="py-3">
						<div className="flex p-4 rounded-[10px] border border-gray-300 justify-between my-1">
							<div className="flex flex-col gap-2">
								<h3 className="text-[16px]">Reciepent Name</h3>
							</div>
							<div className="rounded-full">
								<h3 className="text-[16px] font-bold">
									Ayush Sharma
								</h3>
							</div>
						</div>
						<div className="flex p-4 rounded-[10px] border border-gray-300 justify-between my-2">
							<div className="flex flex-col gap-2">
								<h3 className="text-[16px]">Order Date</h3>
							</div>
							<div className="rounded-full">
								<h3 className="text-[16px] font-bold">
									October&apos;22
								</h3>
							</div>
						</div>
					</div>
					<div className="py-4 h-[50%]">
						<div className="flex px-2 rounded-[10px] my-2">
							{/* <div className="w-[10%]"> */}
							{/* <img
										src="https://media.istockphoto.com/id/176816406/photo/tile-flooring-samples-on-display.jpg?s=612x612&w=0&k=20&c=j3Q38Hj8eirmMn9cbncwDLGYd9e3BRQxEqTIOOE92vg="
										alt="Sunset in the mountains"
									/> */}
							{/* </div> */}
							<div className="flex flex-col gap-2 w-[80%] mx-2">
								<h3 className="text-xl font-bold">
									Vinyl Tile
								</h3>
								<div className="text-xl text-green-500 font-bold ">
									$100
								</div>
							</div>
							<div className="w-[10%] rounded-full">
								<div className="p-1 text-[13px] text-center text-white font-bold bg-slate-950">
									2x
								</div>
							</div>
						</div>
						<div className="flex px-2 rounded-[10px] my-2">
							{/* <div className="w-[10%]"> */}
							{/* <img
										src="https://media.istockphoto.com/id/176816406/photo/tile-flooring-samples-on-display.jpg?s=612x612&w=0&k=20&c=j3Q38Hj8eirmMn9cbncwDLGYd9e3BRQxEqTIOOE92vg="
										alt="Sunset in the mountains"
									/> */}
							{/* </div> */}
							<div className="flex flex-col gap-2 w-[80%] mx-2">
								<h3 className="text-xl font-bold">
									Vinyl Tile
								</h3>
								<div className="text-xl text-green-500 font-bold ">
									$100
								</div>
							</div>
							<div className="w-[10%] rounded-full">
								<div className="p-1 text-[13px] text-center text-white font-bold bg-slate-950">
									2x
								</div>
							</div>
						</div>
						<div className="flex px-2 rounded-[10px] my-2">
							{/* <div className="w-[10%]"> */}
							{/* <img
										className="object-co h-15"
										src="https://media.istockphoto.com/id/176816406/photo/tile-flooring-samples-on-display.jpg?s=612x612&w=0&k=20&c=j3Q38Hj8eirmMn9cbncwDLGYd9e3BRQxEqTIOOE92vg="
										alt="Sunset in the mountains"
									/> */}
							{/* </div> */}
							<div className="flex flex-col gap-2 w-[80%] mx-2">
								<h3 className="text-xl font-bold">
									Vinyl Tile
								</h3>
								<div className="text-xl text-green-500 font-bold ">
									$100
								</div>
							</div>
							<div className="w-[10%] rounded-full">
								<div className="p-1 text-[13px] text-center text-white font-bold bg-slate-950">
									2x
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="divide-y divide-dashed">
					<div>
						<div className="flex px-4 py-1 justify-between mt-5">
							<div className="flex flex-col gap-2">
								<h3 className="text-[16px]">Sub Total</h3>
							</div>
							<div className="rounded-full">
								<h3 className="text-[16px] font-bold">$300</h3>
							</div>
						</div>
						<div className="flex px-4 py-1 justify-between">
							<div className="flex flex-col gap-2">
								<h3 className="text-[16px]">Tax 10%</h3>
							</div>
							<div className="rounded-full">
								<h3 className="text-[16px] font-bold">$30</h3>
							</div>
						</div>
					</div>
					<div>
						<div className="flex px-4 py-1 justify-between">
							<div className="flex flex-col gap-2">
								<h3 className="text-[16px]">Total</h3>
							</div>
							<div className="rounded-full">
								<h3 className="text-[16px] font-bold">$330</h3>
							</div>
						</div>
					</div>
				</div>
				<div className="flex">
					<ButtonComponent title="Clear" mt={3} mb={2} />
					<ButtonComponent title="Keep" mt={3} mb={2} />
				</div>
				<ButtonComponent title="Checkout" mt={3} />
			</div>
		</>
	);
};
