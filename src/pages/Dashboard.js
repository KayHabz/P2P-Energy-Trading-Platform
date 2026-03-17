import React, { useState, useEffect } from 'react';
import { useAccount } from "../context/AccountContext";
import { ethers } from "ethers";
import config from "../config.json";
import EnergyToken from "../abis/EnergyToken.json";

const Dashboard = () => {
  const account = useAccount();
  const [metrics, setMetrics] = useState({
    activeListings: '--',
    totalEarnings: '--',
    recentTransactions: '--'
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        const energyToken = new ethers.Contract(
          config[network.chainId].EnergyToken.address,
          EnergyToken,
          provider
        );

        // 1. Fetch active listings count
        const activeListings = await energyToken.totalSellRequests();

        // 2. Calculate earnings by scanning sellRequests
        const totalSellRequests = await energyToken.totalSellRequests();
        let earnings = ethers.BigNumber.from(0);
        let userTransactions = [];

        for (let i = 1; i <= totalSellRequests; i++) {
          const request = await energyToken.getSellRequest(i);
          if (request.creator.toLowerCase() === account.address.toLowerCase() && request.status === 0) {
            earnings = earnings.add(request.price);
            userTransactions.push({
              type: 'sale',
              amount: request.amount,
              price: request.price,
              timestamp: (await provider.getBlock('latest')).timestamp,
              counterparty: 'Buyer'
            });
          }
        }

        // 3. Fetch user's bids as transactions
        const totalBids = await energyToken.totalBids();
        for (let i = 1; i <= totalBids; i++) {
          const bid = await energyToken.getBid(i);
          if (bid.creator.toLowerCase() === account.address.toLowerCase()) {
            userTransactions.push({
              type: bid.status === 0 ? 'completed_bid' : 'active_bid',
              amount: bid.amount,
              price: bid.price,
              timestamp: (await provider.getBlock('latest')).timestamp,
              counterparty: bid.seller
            });
          }
        }

        setMetrics({
          activeListings: activeListings.toString(),
          totalEarnings: ethers.utils.formatEther(earnings),
          recentTransactions: userTransactions.length.toString()
        });

        setTransactions(userTransactions.slice(0, 5)); // Show last 5 transactions
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (account.address) {
      fetchDashboardData();
    }
  }, [account.address]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Energy Dashboard</h2>
      
      {loading ? (
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading your energy data...</p>
        </div>
      ) : (
        <>
          <div className="metrics-grid">
            <MetricCard 
              title="Active Listings" 
              value={metrics.activeListings} 
              unit=""
              icon="📊"
              theme="primary"
            />
            
            <MetricCard 
              title="Total Earnings" 
              value={metrics.totalEarnings} 
              unit="ETH"
              icon="💰"
              theme="accent"
            />
            
            <MetricCard 
              title="Your Transactions" 
              value={metrics.recentTransactions} 
              unit=""
              icon="🔄"
              theme="secondary"
            />
          </div>

          <div className="transactions-card">
            <h3>Recent Activity</h3>
            {transactions.length > 0 ? (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Counterparty</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index}>
                      <td className={`type-${tx.type}`}>
                        {tx.type === 'sale' ? 'Sale' : 
                         tx.type === 'completed_bid' ? 'Completed Bid' : 'Active Bid'}
                      </td>
                      <td>{ethers.utils.formatUnits(tx.amount, 0)} kWh</td>
                      <td>{ethers.utils.formatEther(tx.price)} ETH</td>
                      <td className="address">
                        {tx.counterparty === 'Buyer' ? 'Buyer' : 
                         `${tx.counterparty.slice(0,6)}...${tx.counterparty.slice(-4)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-transactions">No recent activity found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// MetricCard component remains the same
const MetricCard = ({ title, value, unit, icon, theme }) => (
  <div className={`metric-card theme-${theme}`}>
    <div className="metric-icon">{icon}</div>
    <div className="metric-value">{value}</div>
    <div className="metric-unit">{unit}</div>
    <div className="metric-title">{title}</div>
  </div>
);

export default Dashboard;