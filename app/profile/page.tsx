'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  UserCircle,
  Package,
  MapPin,
  LogOut,
  Loader2,
  Save,
  Edit,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logoutAndRedirect } from '@/actions/logout.actions';
import {
  US_STATES,
  COUNTRIES,
  formatPhoneNumber,
  validateZipCode,
} from '@/lib/address-data';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import CityAutocomplete from '@/components/CityAutocomplete';
import ZipCodeInput from '@/components/ZipCodeInput';

export default function MyAccount() {
  const router = useRouter();
  const { isAuthenticated, user, logout, isLoading, refreshAuth } = useAuth();

  // State management
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [username, setUsername] = useState('');
  const [orders, setOrders] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US', // Use country code instead of full name
  });
  const [hasExistingAddress, setHasExistingAddress] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
    }
  }, [user]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load user orders
  const loadOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch('/api/profile/orders');
      const result = await response.json();

      if (result.success) {
        setOrders(result.orders || []);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to load orders',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load orders' });
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // Load shipping address
  const loadShippingAddress = useCallback(async () => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch('/api/profile/shipping-address');
      const result = await response.json();

      if (result.success && result.address) {
        setShippingAddress(result.address);
        setHasExistingAddress(true);
      } else {
        setHasExistingAddress(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load shipping address' });
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  // Load orders when orders tab is active
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
      loadOrders();
    }
  }, [activeTab, isAuthenticated, loadOrders]);

  // Load shipping address when address tab is active
  useEffect(() => {
    if (activeTab === 'address' && isAuthenticated) {
      loadShippingAddress();
    }
  }, [activeTab, isAuthenticated, loadShippingAddress]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle username update
  const handleUpdateUsername = async () => {
    const trimmedUsername = username.trim();

    // Client-side validation
    if (!trimmedUsername) {
      setMessage({ type: 'error', text: 'Username is required' });
      return;
    }

    if (trimmedUsername.length < 2) {
      setMessage({
        type: 'error',
        text: 'Username must be at least 2 characters long',
      });
      return;
    }

    if (trimmedUsername === user?.username) {
      setMessage({ type: 'error', text: 'Please enter a different username' });
      return;
    }

    setIsUpdating(true);
    setMessage({ type: '', text: '' }); // Clear previous messages

    try {
      console.log(
        '🔄 Updating username from',
        user?.username,
        'to',
        trimmedUsername
      );

      const response = await fetch('/api/profile/update-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: trimmedUsername }),
      });

      const result = await response.json();
      console.log('📝 Update response:', result);

      if (result.success) {
        setMessage({ type: 'success', text: 'Username updated successfully!' });

        // Refresh auth state to get updated user data from cookies
        setTimeout(() => {
          refreshAuth();
        }, 100); // Small delay to ensure cookies are set

        // Log the update
        if (result.user) {
          console.log('✅ User info updated successfully:', result.user);
        }
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to update username',
        });
      }
    } catch (error) {
      console.error('❌ Update username error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle phone number formatting
  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhoneNumber(value);
    setShippingAddress((prev) => ({
      ...prev,
      phoneNumber: formatted,
    }));
  }, []);

  // Handle address autocomplete selection
  const handleAddressSelect = useCallback((suggestion: any) => {
    setShippingAddress((prev) => ({
      ...prev,
      address1: suggestion.address,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode,
    }));
  }, []);

  // Handle ZIP code location found
  const handleZipCodeLocationFound = useCallback(
    (location: { city: string; state: string; stateCode: string }) => {
      setShippingAddress((prev) => ({
        ...prev,
        city: location.city,
        state: location.stateCode,
      }));
    },
    []
  );

  // Handle city selection
  const handleCitySelect = useCallback((cityData: any) => {
    setShippingAddress((prev) => ({
      ...prev,
      city: cityData.city,
      state: cityData.stateCode,
      // Optionally set the first ZIP code if user hasn't entered one
      zipCode: prev.zipCode || cityData.zipCodes[0] || '',
    }));
  }, []);

  // Handle shipping address update
  const handleUpdateAddress = async () => {
    // Validate required fields
    if (!shippingAddress.firstName.trim()) {
      setMessage({ type: 'error', text: 'First name is required' });
      return;
    }
    if (!shippingAddress.lastName.trim()) {
      setMessage({ type: 'error', text: 'Last name is required' });
      return;
    }
    if (!shippingAddress.address1.trim()) {
      setMessage({ type: 'error', text: 'Address line 1 is required' });
      return;
    }
    if (!shippingAddress.city.trim()) {
      setMessage({ type: 'error', text: 'City is required' });
      return;
    }
    if (!shippingAddress.state.trim()) {
      setMessage({ type: 'error', text: 'State/Province is required' });
      return;
    }
    if (!shippingAddress.zipCode.trim()) {
      setMessage({ type: 'error', text: 'ZIP/Postal code is required' });
      return;
    }
    if (!shippingAddress.country.trim()) {
      setMessage({ type: 'error', text: 'Country is required' });
      return;
    }

    // Validate US ZIP code format
    if (
      shippingAddress.country === 'US' &&
      !validateZipCode(shippingAddress.zipCode)
    ) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid US ZIP code (12345 or 12345-6789)',
      });
      return;
    }

    setIsUpdating(true);
    setMessage({ type: '', text: '' }); // Clear previous messages
    try {
      const response = await fetch('/api/profile/shipping-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingAddress),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Shipping address saved successfully',
        });
        setHasExistingAddress(true);
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to save shipping address',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save shipping address' });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    setShowLogoutDialog(false);

    try {
      // Clear client-side state first
      await logout();

      // Use server action to clear all server-side cookies and redirect
      await logoutAndRedirect();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: just redirect to home if server action fails
      router.push('/');
    }
  };

  // Handle order click
  const handleOrderClick = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account and view your orders
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <UserCircle className="h-5 w-5" />
              <span>Customer Account</span>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger
              value="profile"
              className="flex items-center space-x-2"
            >
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Address</span>
            </TabsTrigger>
            <TabsTrigger value="logout" className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>Update Information</span>
                </CardTitle>
                <CardDescription>
                  Update your account information. Email cannot be changed for
                  security reasons.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">
                      Email cannot be changed for security reasons
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleUpdateUsername}
                  disabled={isUpdating || username === user?.username}
                  className="w-full sm:w-auto"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Information
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Your Orders</span>
                </CardTitle>
                <CardDescription>
                  View and track your order history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading orders...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      When you place your first order, it will appear here.
                    </p>
                    <Button onClick={() => router.push('/products')}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div
                          key={order.id}
                          onClick={() => handleOrderClick(order.id)}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Package className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  Order #{order.id.slice(-8)}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(order.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold flex items-center">
                                <DollarSign className="h-4 w-4" />
                                {formatCurrency(order.total)}
                              </p>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                              >
                                <Truck className="h-3 w-3 mr-1" />
                                {order.status || 'Processing'}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.products?.length || 0} item(s)
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {hasExistingAddress
                      ? 'Edit Shipping Address'
                      : 'Add Shipping Address'}
                  </span>
                </CardTitle>
                <CardDescription>
                  {hasExistingAddress
                    ? 'Update your shipping address information'
                    : 'Add your shipping address for faster checkout'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAddress ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading address...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={shippingAddress.firstName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shippingAddress.lastName}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            lastName: e.target.value,
                          })
                        }
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={shippingAddress.phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="(555) 123-4567"
                        maxLength={17} // Max length for formatted US phone number
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={shippingAddress.country}
                        onValueChange={(value) =>
                          setShippingAddress({
                            ...shippingAddress,
                            country: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem
                              key={country.value}
                              value={country.value}
                            >
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <AddressAutocomplete
                        label="Address Line 1"
                        value={shippingAddress.address1}
                        onChange={(value) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address1: value,
                          })
                        }
                        onAddressSelect={handleAddressSelect}
                        placeholder="Start typing your street address..."
                        id="address1"
                        country={shippingAddress.country}
                        currentCity={shippingAddress.city}
                        currentState={shippingAddress.state}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address2">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="address2"
                        value={shippingAddress.address2}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            address2: e.target.value,
                          })
                        }
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                    <div>
                      <CityAutocomplete
                        label="City"
                        value={shippingAddress.city}
                        onChange={(value) =>
                          setShippingAddress({
                            ...shippingAddress,
                            city: value,
                          })
                        }
                        onCitySelect={handleCitySelect}
                        placeholder="Enter city name..."
                        id="city"
                        country={shippingAddress.country}
                        stateCode={shippingAddress.state}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      {shippingAddress.country === 'US' ? (
                        <Select
                          value={shippingAddress.state}
                          onValueChange={(value) =>
                            setShippingAddress({
                              ...shippingAddress,
                              state: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              state: e.target.value,
                            })
                          }
                          placeholder="Enter state/province"
                        />
                      )}
                    </div>
                    <div>
                      <ZipCodeInput
                        label={
                          shippingAddress.country === 'US'
                            ? 'ZIP Code'
                            : 'Postal Code'
                        }
                        value={shippingAddress.zipCode}
                        onChange={(value) =>
                          setShippingAddress({
                            ...shippingAddress,
                            zipCode: value,
                          })
                        }
                        onLocationFound={handleZipCodeLocationFound}
                        placeholder={
                          shippingAddress.country === 'US'
                            ? 'Enter ZIP code (auto-fills city/state)'
                            : 'Enter postal code'
                        }
                        id="zipCode"
                        country={shippingAddress.country}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleUpdateAddress}
                  disabled={isUpdating || isLoadingAddress}
                  className="w-full sm:w-auto"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {hasExistingAddress ? 'Update Address' : 'Save Address'}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Logout Tab */}
          <TabsContent value="logout">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </CardTitle>
                <CardDescription>
                  Sign out of your account securely
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <LogOut className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to sign out?
                  </h3>
                  <p className="text-gray-500 mb-6">
                    You'll need to sign in again to access your account.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowLogoutDialog(true)}
                    className="w-full sm:w-auto"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Confirmation Dialog */}
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to sign out? You'll need to sign in again
                to access your account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogoutConfirm}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
