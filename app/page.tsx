import DashboardContainer from '@/containers/1_dashboard/dashboard_container';
import { MainNavbar, MainSidebar } from '@/components';
import './globals.css';

export default function Dashboard() {
	return (
		<>
			<MainNavbar />
			<MainSidebar />
			<DashboardContainer />
		</>
	);
}
