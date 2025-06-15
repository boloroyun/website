"use client"; // This indicates that this component will run on the client side.

import { useState } from "react"; // useState hook to manage local state within the component.
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // UI components for the tabs navigation.
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // UI components for displaying content in cards.
import { Button } from "@/components/ui/button"; // Button component.
import { Input } from "@/components/ui/input"; // Input field component.
import { Label } from "@/components/ui/label"; // Label component for form fields.
import { ScrollArea } from "@/components/ui/scroll-area"; // Component to make a content scrollable.
import { Package, Key, UserCircle, RotateCcw, Heart } from "lucide-react"; // Icon imports for tab icons.

export default function MyAccount() {
  // State to track which tab is currently active.
  const [activeTab, setActiveTab] = useState("orders");

  // Content for each tab
  const tabContent = {
    // Content for the "Orders" tab.
    Orders: (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and manage your order history</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {/* Placeholder order list, this should eventually fetch real order data */}
            {[1, 2, 3, 4, 5].map((order) => (
              <div key={order} className="mb-4 p-4 border rounded">
                <h3 className="font-semibold">Order #{order}</h3>
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>Status: Shipped</p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Details
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    ),
    // Content for the "Change Password" tab.
    "Change Password": (
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Password change form */}
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Input for current password */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              {/* Input for new password */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              {/* Input to confirm new password */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button>Update Password</Button> {/* Button to submit the form */}
        </CardFooter>
      </Card>
    ),
    // Content for the "Change Details" tab.
    "Change Details": (
      <Card>
        <CardHeader>
          <CardTitle>Change Details</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form to change account details */}
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Input for full name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              {/* Input for email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              {/* Input for phone number */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button> {/* Button to submit changes */}
        </CardFooter>
      </Card>
    ),
    // Content for the "Refunded Orders" tab.
    "Refunded Orders": (
      <Card>
        <CardHeader>
          <CardTitle>Refunded Orders</CardTitle>
          <CardDescription>View your refunded orders</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {/* Placeholder for refunded order list */}
            {[1, 2].map((order) => (
              <div key={order} className="mb-4 p-4 border rounded">
                <h3 className="font-semibold">Refund #{order}</h3>
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>Status: Processed</p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Details
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    ),
    // Content for the "Wishlist" tab.
    Wishlist: (
      <Card>
        <CardHeader>
          <CardTitle>Your Wishlist</CardTitle>
          <CardDescription>Manage your saved items</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {/* Placeholder for wishlist items */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="mb-4 p-4 border rounded flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">Product {item}</h3>
                  <p>$99.99</p>
                </div>
                <Button variant="outline" size="sm">
                  Add to Cart
                </Button>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    ),
  };

  // Icons for each tab
  const tabIcons = {
    Orders: <Package className="h-4 w-4" />, // Icon for Orders tab
    "Change Password": <Key className="h-4 w-4" />, // Icon for Change Password tab
    "Change Details": <UserCircle className="h-4 w-4" />, // Icon for Change Details tab
    "Refunded Orders": <RotateCcw className="h-4 w-4" />, // Icon for Refunded Orders tab
    Wishlist: <Heart className="h-4 w-4" />, // Icon for Wishlist tab
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="heading text-center mb-[20px]">My Account</h1>{" "}
      {/* Page title */}
      <Tabs
        defaultValue="Orders" // Default tab to be selected initially
        className="w-full"
        onValueChange={setActiveTab} // Update active tab on change
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with tab options */}
          <TabsList className="h-full md:flex-col justify-start md:w-48 bg-muted/50 p-1 md:p-2 rounded-lg">
            {Object.entries(tabContent).map(([key, _]) => (
              <TabsTrigger
                key={key}
                value={key} // Set tab value
                className="w-full justify-start gap-2 md:mb-2"
              >
                {tabIcons[key]} {/* Display tab icon */}
                <span className="hidden md:inline">
                  {key.charAt(0).toUpperCase() + key.slice(1)} {/* Tab label */}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Content for the active tab */}
          <div className="flex-1">
            {Object.entries(tabContent).map(([key, content]) => (
              <TabsContent key={key} value={key} className="mt-0 md:mt-0">
                {content} {/* Render content for the selected tab */}
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
