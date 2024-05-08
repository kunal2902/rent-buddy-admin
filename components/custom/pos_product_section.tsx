'use client';

import { Pizza, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { ButtonComponent } from '@/components';

export interface Categories {
	categoryName: string;
}

export const PosProductSection = () => (
	<div className="w-full max-h-screen overflow-y-scroll flex flex-col ">
		<div className="flex flex-col justify-between my-4">
			<div className="flex flex-col items-center mx-4">
				<div className="flex p-2 bg-zinc-200 rounded-[30px] gap-3 items-center w-[60%]">
					<SearchIcon size={16} />
					<input
						type="text"
						placeholder="Search ..."
						className="bg-transparent text-sm w-[100%] focus-visible:outline-none hover:border-none"
					/>
				</div>
				<div className="flex flex-col gap-4 w-full">
					<h1 className="text-2xl font-bold text-left w-full">
						Categories
					</h1>
					<div className="flex gap-4 justify-between">
						<CategoriesCard categoryName="All items" />
						<CategoriesCard categoryName="Pizza" />
						<CategoriesCard categoryName="Burger" />
						<CategoriesCard categoryName="Fries" />
						<CategoriesCard categoryName="Meals" />
						<CategoriesCard categoryName="Meals" />
						<CategoriesCard categoryName="Meals" />
					</div>
				</div>
			</div>
		</div>
		<div className="flex flex-wrap justify-between">
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
			<Card />
		</div>
	</div>
);

const Card = () => {
	const [count, setCount] = useState(0);
	const [price, setPrice] = useState(100);

	return (
		<div className="max-w-[15rem] rounded overflow-hidden shadow-lg min-h-[10rem] auto m-5">
			<Image
				// width="100%"
				width={100}
				height={100}
				src="https://media.istockphoto.com/id/176816406/photo/tile-flooring-samples-on-display.jpg?s=612x612&w=0&k=20&c=j3Q38Hj8eirmMn9cbncwDLGYd9e3BRQxEqTIOOE92vg="
				alt="Sunset in the mountains"
			/>
			<div className="px-6 py-4 text-center">
				<div className="font-bold text-xl mb-2">The Coldest Sunset</div>
			</div>
			<div className="px-6 pb-2">
				<div className="flex justify-between items-center">
					<div className="text-3xl text-green-500 font-bold ">
						$ {price}
					</div>
					<div className="w-[40%] rounded-[20px] flex p-2 bg-gray-400 justify-between items-center mb-2">
						<ButtonComponent
							w="25%"
							h="100%"
							title="-"
							titleClassName="font-bold"
							onClick={() => {
								if (price >= 200 && count >= 1) {
									setCount(count - 1);
									setPrice(price - 10);
								}
							}}
						/>
						<div className="text-xl font-bold ">{count}</div>
						<ButtonComponent
							title="+"
							w="25%"
							h="100%"
							titleClassName="font-bold"
							onClick={() => {
								setCount(count + 1);
								setPrice(price + 10);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const CategoriesCard: React.FC<Categories> = ({ categoryName }) => (
	<div className="flex p-4 rounded-[10px] bg-slate-200 border border-gray-100 justify-between">
		<div className="flex flex-col gap-2">
			<h3 className="text-[16px] font-bold">{categoryName}</h3>
		</div>
		<div className="bg-slate-200 rounded-full">
			<Pizza />
		</div>
	</div>
);
