import {
	BarChart3,
	ShieldCheck,
	Users,
	Clipboard,
	Settings,
	ScanLine,
	ScanBarcode,
	Tag,
	Tags,
	List,
	LayoutPanelTop,
	BookOpenText,
	Mail,
	LucideIcon,
	Bookmark,
	Blocks,
} from 'lucide-react';
import { IconType } from 'react-icons';
import { PiBookOpenTextFill, PiWarehouse, PiWarehouseFill } from 'react-icons/pi';
import { RiSettingsFill, RiSettingsLine } from 'react-icons/ri';
import {
	aboutName,
	aboutRoute,
	addOnsName,
	addOnsRoute,
	categoriesName,
	categoriesRoute, contactName, contactRoute,
	customAttributesName,
	customAttributesRoute,
	customersName,
	customersRoute,
	dashboardName,
	dashboardRoute,
	emailRoute, emailSettingsName,
	generalSettingsName,
	generalSettingsRoute,
	inventoryName,
	itemsName,
	itemsRoute,
	itemTypesName,
	itemTypesRoute,
	pageLayoutName,
	pageLayoutRoute,
	pagesName, privacyPolicyName, privacyPolicyRoute,
	reportsName,
	reportsRoute, rolesName, rolesRoute,
	settingsName,
	subCategoriesName,
	subCategoriesRoute,
	tagsName,
	tagsRoute, taxesName,
	taxesRoute, tncName, tncRoute,
	usersName,
	usersRoute,
} from '@/utils';

export enum SideBarType {
	// eslint-disable-next-line no-unused-vars
	Simple = 'simple',
	// eslint-disable-next-line no-unused-vars
	Nested = 'nested',
}

export interface SubMenuType {
	ActiveIcon: IconType | LucideIcon,
	options: Array<SideBarProps<SideBarType>>,
}

export interface LinkType {
	link: string,
}

export interface SideBarProps<T extends SideBarType> {
	id: number,
	type: T,
	link?: string,
	title: string,
	Icon: IconType | LucideIcon,
	other: T extends SideBarType.Nested ? SubMenuType : LinkType,
}

export const SidebarItems: Array<SideBarProps<SideBarType>> = [
	{
		id: 1,
		title: dashboardName,
		Icon: BarChart3,
		type: SideBarType.Simple,
		other: { link: dashboardRoute },
	},
	{
		id: 2,
		title: inventoryName,
		Icon: PiWarehouse,
		type: SideBarType.Nested,
		other: {
			ActiveIcon: PiWarehouseFill,
			options: [
				{
					id: 1,
					title: itemsName,
					type: SideBarType.Simple,
					other: { link: itemsRoute },
					Icon: ScanLine,
				},
				{
					id: 2,
					title: itemTypesName,
					other: { link: itemTypesRoute },
					Icon: ScanBarcode,
					type: SideBarType.Simple,
				},
				{
					id: 3,
					title: categoriesName,
					other: { link: categoriesRoute },
					Icon: Tag,
					type: SideBarType.Simple,
				},
				{
					id: 4,
					title: subCategoriesName,
					other: { link: subCategoriesRoute },
					Icon: Tags,
					type: SideBarType.Simple,
				},
				{
					id: 5,
					title: customAttributesName,
					other: { link: customAttributesRoute },
					Icon: List,
					type: SideBarType.Simple,
				},
				{
					id: 6,
					title: tagsName,
					other: { link: tagsRoute },
					Icon: Bookmark,
					type: SideBarType.Simple,
				},
				{
					id: 7,
					title: addOnsName,
					other: { link: addOnsRoute },
					Icon: Blocks,
					type: SideBarType.Simple,
				},
			],
		},
	},
	{
		id: 3,
		title: customersName,
		other: { link: customersRoute },
		Icon: Users,
		type: SideBarType.Simple,
	},
	{
		id: 4,
		title: usersName,
		other: { link: usersRoute },
		Icon: ShieldCheck,
		type: SideBarType.Simple,
	},
	{
		id: 5,
		title: reportsName,
		other: { link: reportsRoute },
		Icon: Clipboard,
		type: SideBarType.Simple,
	},
	{
		id: 6,
		title: settingsName,
		Icon: RiSettingsLine,
		type: SideBarType.Nested,
		other: {
			ActiveIcon: RiSettingsFill,
			options: [
				{
					id: 1,
					title: generalSettingsName,
					type: SideBarType.Simple,
					other: { link: generalSettingsRoute },
					Icon: Settings,
				},
				{
					id: 2,
					title: rolesName,
					type: SideBarType.Simple,
					other: { link: rolesRoute },
					Icon: Settings,
				},
				{
					id: 2,
					title: pageLayoutName,
					other: { link: pageLayoutRoute },
					Icon: LayoutPanelTop,
					type: SideBarType.Simple,
				},
				{
					id: 3,
					title: pagesName,
					Icon: BookOpenText,
					type: SideBarType.Nested,
					other: {
						ActiveIcon: PiBookOpenTextFill,
						options: [
							{
								id: 1,
								title: aboutName,
								other: { link: aboutRoute },
								Icon: Mail,
								type: SideBarType.Simple,
							},
							{
								id: 2,
								title: contactName,
								other: { link: contactRoute },
								Icon: Mail,
								type: SideBarType.Simple,
							},
							{
								id: 3,
								title: privacyPolicyName,
								other: { link: privacyPolicyRoute },
								Icon: Mail,
								type: SideBarType.Simple,
							},
							{
								id: 4,
								title: tncName,
								other: { link: tncRoute },
								Icon: Mail,
								type: SideBarType.Simple,
							},
						],
					},
				},
				{
					id: 4,
					title: emailSettingsName,
					other: { link: emailRoute },
					Icon: Mail,
					type: SideBarType.Simple,
				},
				{
					id: 5,
					title: taxesName,
					other: { link: taxesRoute },
					Icon: Mail,
					type: SideBarType.Simple,
				},
			],
		},
	},
];
