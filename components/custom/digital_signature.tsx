import React, { useRef, useState, useEffect } from "react";
import { appAccentColor, appColor } from "@/utils";

// eslint-disable-next-line max-len
export const DigitalSignatureModal = ({ isOpen, onClose, onConfirm, onSkip, customerName }:{ isOpen:boolean, onClose:any, onConfirm:any, onSkip:any, customerName:string }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [hasSignature, setHasSignature] = useState(false);

	useEffect(() => {
		if (isOpen && canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");

			// Set canvas size
			canvas.width = 500;
			canvas.height = 200;

			// Set drawing properties
			ctx!.strokeStyle = "#000000";
			ctx!.lineWidth = 2;
			ctx!.lineCap = "round";
			ctx!.lineJoin = "round";

			// Clear canvas with white background
			ctx!.fillStyle = "#ffffff";
			ctx?.fillRect(0, 0, canvas.width, canvas.height);
		}
	}, [isOpen]);

	const startDrawing = (e:any) => {
		setIsDrawing(true);
		setHasSignature(true);
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		const rect = canvas?.getBoundingClientRect();

		ctx?.beginPath();
		ctx?.moveTo(
			e.clientX - rect!.left,
			e.clientY - rect!.top
		);
	};

	const draw = (e:any) => {
		if (!isDrawing) return;

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		const rect = canvas?.getBoundingClientRect();

		ctx?.lineTo(
			e.clientX - rect!.left,
			e.clientY - rect!.top
		);
		ctx?.stroke();
	};

	const stopDrawing = () => {
		setIsDrawing(false);
	};

	// Touch events for mobile
	const handleTouchStart = (e:any) => {
		e.preventDefault();
		const touch = e.touches[0];
		const mouseEvent = new MouseEvent("mousedown", {
			clientX: touch.clientX,
			clientY: touch.clientY,
		});
		canvasRef?.current?.dispatchEvent(mouseEvent);
	};

	const handleTouchMove = (e:any) => {
		e.preventDefault();
		const touch = e.touches[0];
		const mouseEvent = new MouseEvent("mousemove", {
			clientX: touch.clientX,
			clientY: touch.clientY,
		});
		canvasRef?.current?.dispatchEvent(mouseEvent);
	};

	const handleTouchEnd = (e:any) => {
		e.preventDefault();
		const mouseEvent = new MouseEvent("mouseup", {});
		canvasRef.current?.dispatchEvent(mouseEvent);
	};

	const clearSignature = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		ctx!.fillStyle = "#ffffff";
		ctx?.fillRect(0, 0, canvas!.width, canvas!.height);
		setHasSignature(false);
	};

	const handleConfirm = () => {
		if (!hasSignature) {
			alert("Please provide your signature before confirming.");
			return;
		}

		const canvas = canvasRef.current;
		const signatureDataURL = canvas?.toDataURL("image/png");
		onConfirm(signatureDataURL);
	};

	const handleSkip = () => {
		onSkip();
	};

	const handleClose = () => {
		clearSignature();
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div style={{
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: 1000,
		}}>
			<div style={{
				backgroundColor: "white",
				borderRadius: "8px",
				padding: "24px",
				maxWidth: "600px",
				width: "90%",
				maxHeight: "90vh",
				overflow: "auto",
			}}>
				<div style={{ marginBottom: "20px" }}>
					<div className="flex justify-between items-center">
						<h2 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "bold" }}>
							Customer Digital Signature
						</h2>
						{/* eslint-disable-next-line react/button-has-type */}
						<button
							onClick={handleClose}
							style={{
								padding: "8px 15px",
								backgroundColor: "#6c757d",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
								fontSize: "14px",
							}}
						>
							X
						</button>
					</div>

					<p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
						{customerName ? `Please provide your signature, ${customerName}` : "Please provide your signature"}
					</p>
				</div>

				<div style={{
					border: "2px solid #ddd",
					borderRadius: "4px",
					marginBottom: "20px",
					backgroundColor: "#fafafa",
				}}>
					<canvas
						ref={canvasRef}
						onMouseDown={startDrawing}
						onMouseMove={draw}
						onMouseUp={stopDrawing}
						onMouseLeave={stopDrawing}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
						style={{
							display: "block",
							cursor: "crosshair",
							width: "100%",
							height: "200px",
							backgroundColor: "white",
						}}
					/>
					<div style={{
						padding: "8px 12px",
						fontSize: "12px",
						color: "#666",
						borderTop: "1px solid #ddd",
						backgroundColor: "#f9f9f9",
					}}>
						Please sign above using your mouse or finger on touch devices
					</div>
				</div>

				<div style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "20px",
				}}>
					{/* eslint-disable-next-line react/button-has-type */}
					<button
						onClick={clearSignature}
						style={{
							padding: "8px 16px",
							backgroundColor: "#f0f0f0",
							border: "1px solid #ddd",
							borderRadius: "4px",
							cursor: "pointer",
							fontSize: "14px",
						}}
					>
						Clear Signature
					</button>

					{hasSignature && (
						<span style={{ fontSize: "12px", color: "#28a745" }}>
							✓ Signature captured
						</span>
					)}
				</div>

				<div style={{
					display: "flex",
					gap: "12px",
					justifyContent: "flex-end",
				}}>

					{/* eslint-disable-next-line react/button-has-type */}
					<button
						onClick={handleSkip}
						style={{
							padding: "10px 20px",
							backgroundColor: appAccentColor,
							color: "#000",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							fontSize: "14px",
						}}
					>
						Skip
					</button>

					{/* eslint-disable-next-line react/button-has-type */}
					<button
						onClick={handleConfirm}
						style={{
							padding: "10px 20px",
							backgroundColor: appColor,
							color: "white",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
							fontSize: "14px",
							opacity: hasSignature ? 1 : 0.6,
						}}
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};
