import { Home, Tag, Settings } from "lucide-react"

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

const items = [
	{
		title: "Memo",
		url: "#",
		icon: Home,
	},
	{
		title: "Tags",
		url: "#",
		icon: Tag,
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings,
	},
]

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Items</SidebarGroupLabel>

					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{ item.title }</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem >
							)) }
						</SidebarMenu>
					</SidebarGroupContent>

				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}