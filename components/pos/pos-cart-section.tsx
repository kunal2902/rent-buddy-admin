import { SolidBtn } from "../elements";

const PosCartSection = () => {
	return (
		<div className="w-[30%] p-2">
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
								October'22
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
							<h3 className="text-xl font-bold">Vinyl Tile</h3>
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
							<h3 className="text-xl font-bold">Vinyl Tile</h3>
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
							<h3 className="text-xl font-bold">Vinyl Tile</h3>
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
			<SolidBtn className="mt-3" title="Checkout" />
		</div>
	);
};

export default PosCartSection
