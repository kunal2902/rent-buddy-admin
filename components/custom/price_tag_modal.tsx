import React, { useRef } from "react";
import { Modal, Button, Group, Box, Text, Stack, Paper } from "@mantine/core";
import Logo from "@/public/images/logo.png";
import { appLogoHeight, appLogoWidth } from "@/utils";
import { ImageComponent } from "@/components";

interface PriceTagModalProps {
	isOpen: boolean;
	item: any;
	onClose: () => void;
}

const PriceTag = React.forwardRef<HTMLDivElement, { item: any }>(({ item }, ref) => (
	<div ref={ref} style={{ padding: "20px" }}>
		<Paper
			className="price-tag"
			shadow="sm"
			p="lg"
			style={{
				height: "80vh",
				margin: "0 auto",
				backgroundColor: "#f8f9fa",
				border: "30px solid #ffd700",
				borderRadius: "12px",
				position: "relative",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				textAlign: "center",
			}}
		>
			<Stack
				gap="md"
				style={{ width: "100%", maxWidth: "90%", gap: "3rem",
			}}>
				<Box>
					<Text fw={700} style={{ fontSize: "32px" }}>
						{item.name || ""}
					</Text>
				</Box>

				<Box>
					<Text size="sm" style={{ marginTop: "4px" }}>
						{item.short_description || item.description || ""}
					</Text>
				</Box>

				<Box style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
					<Text
						style={{ color: "#868e96", fontSize: "18px" }}

					>
						Compare at
					</Text>
					<Text
						fw={600}
						style={{ textDecoration: "line-through", color: "#868e96", fontSize: "18px" }}
					>
						${item.msrp || ""}
					</Text>
				</Box>

				<Box
					style={{
						backgroundColor: "#fff3cd",
						padding: "12px",
						borderRadius: "6px",
						border: "2px solid #ffc107",
						marginTop: "10px",
					}}
				>
					<Text
						fw={700}
						color="dark"
						style={{ fontSize: "36px" }} // big bold price
					>
						${item.price || ""}
					</Text>
				</Box>

				<Box>
					<Text size="sm" fw={500}>
						1 YEAR WARRANTY INCLUDED
					</Text>
					<Text size="sm" color="dimmed" mt={12}>
						EXTENDED WARRANTY : $109/1y , $169/2y , $219/3y
					</Text>
				</Box>

				<Box>
					<Text size="sm" fw={500}>
						FINANCING AVAILABLE
					</Text>
				</Box>
			</Stack>

			<Box
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingTop: "10px",
					backgroundColor: "#ffd700",
				}}
			>
				<ImageComponent src={Logo.src} h="3rem" w="3rem" />
			</Box>
		</Paper>
	</div>
));

PriceTag.displayName = "PriceTag";

const PriceTagModal: React.FC<PriceTagModalProps> = ({
	isOpen,
	item,
	onClose,
}) => {
	const componentRef = useRef<HTMLDivElement>(null);

	const handlePrint = () => {
		const printWindow = window.open("", "_blank", "width=850,height=1100");
		if (!printWindow) return;
		const logoUrl = `${window.location.origin}${Logo.src}`;
		console.log("logo ka URL", logoUrl);

		const html = `

  <html>
    <head>
      <title>Print Price Tag</title>
      <style>
        @page {
          size: 8.5in 11in;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
        }
        .price-tag {
          width: 8.5in;
          height: 11in;
          box-sizing: border-box;
          border: 30px solid #ffd700;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          text-align: center;
          font-family: Arial, sans-serif;
        }
        .content {
  flex: 1; 
  display: flex;
  justify-content: center;
  align-items: center;     
}
        .stack {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4.5rem;
}
        .compare {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }
        .compare .strike {
          text-decoration: line-through;
          color: #868e96;
        }
        .price-box {
          background-color: #fff3cd;
          padding: 12px;
          border-radius: 6px;
          border: 2px solid #ffc107;
          margin-top: 10px;
        }
        .footer {
        height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffd700;
}

      </style>
    </head>
    <body>
      <div class="price-tag">
      <div class="content">
        <div class="stack">
          <div>
            <div style="font-size: 64px; font-weight: 700;">
              ${item.name || ""}
            </div>
          </div>
          <div>
            <div style="font-size: 24px;">
              ${item.short_description || item.description || ""}
            </div>
          </div>
          <div class="compare">
            <div style="font-size: 30px; color: #868e96;">Compare at</div>
            <div class="strike" style="font-size: 30px; font-weight: 600;">
              $${item.msrp || ""}
            </div>
          </div>
          <div class="price-box">
            <div style="font-size: 72px; font-weight: 700; color: #000;">
              $${item.price || ""}
            </div>
          </div>
          <div style="gap: 2rem">
            <div style="font-size: 30px; font-weight: 500;">1 YEAR WARRANTY INCLUDED</div>
            <div style="font-size: 24px; color: #868e96;margin-top: 24px">
              EXTENDED WARRANTY : $109/1y , $169/2y , $219/3y
            </div>
          </div>
          <div>
            <div style="font-size: 30px; font-weight: 500;">FINANCING AVAILABLE</div>
          </div>
          
        </div>
        </div>
        <div class="footer">
          <img src="https://nca-web.unlockvelocity.in/_next/static/media/logo.3b6d0308.png" width="100px" height="100px"  alt="nca"/>
        </div>
      </div>
    </body>
  </html>
  `;

		printWindow.document.open();
		printWindow.document.write(html);
		printWindow.document.close();
		printWindow.focus();
		setTimeout(() => {
			printWindow.print();
			printWindow.close();
		}, 250);
		// printWindow.print();
		// printWindow.close();
	};

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title="Price Tag Preview"
			size="lg"
			centered
		>
			<Stack>
				<PriceTag ref={componentRef} item={item} />

				<Group justify="right" mt="md">
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
					<Button onClick={handlePrint} color="blue">
						Print Price Tag
					</Button>
				</Group>
			</Stack>
		</Modal>
	);
};

export default PriceTagModal;
