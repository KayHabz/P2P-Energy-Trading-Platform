import React, { useState, useEffect } from "react";
import { useAccount } from "../context/AccountContext";
import { ethers } from "ethers";
import config from "../config.json";
import EnergyToken from "../abis/EnergyToken.json";

const AdminDashboard = () => {
  const account = useAccount();
  const [metrics, setMetrics] = useState({
    totalUsers: "--",
    totalEnergyListed: "--",
    totalRevenue: "--",
    activeListings: "--",
  });
  const [loading, setLoading] = useState(true);

  // Check if current user is admin based on deployer address in config
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        const contractAddress = config[network.chainId]?.EnergyToken?.address;
        const adminAddress = config[network.chainId]?.EnergyToken?.admin;

        if (!contractAddress || !adminAddress) {
          throw new Error("Contract or admin address not found in config");
        }

        setIsAdmin(account.address?.toLowerCase() === adminAddress.toLowerCase());
        if (account.address?.toLowerCase() !== adminAddress.toLowerCase()) {
          setLoading(false);
          return; // Not admin, no data fetch
        }

        const energyToken = new ethers.Contract(contractAddress, EnergyToken, provider);

        // Example: You might need to add functions in your contract to get total users and revenue

        // 1. Active Listings count
        const activeListingsCount = await energyToken.totalSellRequests();

        // 2. Total Energy Listed (sum of amounts from active sell requests)
        let totalEnergy = ethers.BigNumber.from(0);
        let totalRevenue = ethers.BigNumber.from(0);
        const totalSellRequests = activeListingsCount;

        for (let i = 1; i <= totalSellRequests; i++) {
          const request = await energyToken.getSellRequest(i);
          if (request.status === 0) { // active listing
            totalEnergy = totalEnergy.add(request.amount);
          }
          if (request.status === 1) { // sold/completed
            totalRevenue = totalRevenue.add(request.price);
          }
        }

        // 3. Total users - assuming your contract tracks this or you track off-chain.
        // Placeholder as '--' since not easily accessible without contract support
        // You may want to add a contract function like totalUsers()
        const totalUsers = "--";

        setMetrics({
          totalUsers,
          totalEnergyListed: ethers.utils.formatUnits(totalEnergy, 0), // kWh
          totalRevenue: ethers.utils.formatEther(totalRevenue),
          activeListings: activeListingsCount.toString(),
        });
      } catch (error) {
        console.error("Admin Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (account.address) {
      fetchAdminData();
    }
  }, [account.address]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>
        <p>Loading admin data...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="dashboard-container">
        <h2>Admin Dashboard</h2>
        <p>Access denied. You are not an admin.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="metrics-grid">
        <MetricCard title="Total Users" value={metrics.totalUsers} unit="" icon="👥" theme="primary" />
        <MetricCard title="Total Energy Listed" value={metrics.totalEnergyListed} unit="kWh" icon="⚡" theme="accent" />
        <MetricCard title="Total Revenue" value={metrics.totalRevenue} unit="ETH" icon="💰" theme="secondary" />
        <MetricCard title="Active Listings" value={metrics.activeListings} unit="" icon="📊" theme="primary" />
      </div>

      {/* Add more detailed recent activity or logs here if needed */}
    </div>
  );
};

const MetricCard = ({ title, value, unit, icon, theme }) => (
  <div className={`metric-card theme-${theme}`}>
    <div className="metric-icon">{icon}</div>
    <div className="metric-value">{value}</div>
    <div className="metric-unit">{unit}</div>
    <div className="metric-title">{title}</div>
  </div>
);

export default AdminDashboard;
