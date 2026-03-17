import React from "react";

const Home = () => {
  // Sample data - replace with your actual data
  const stats = [
    { value: "12,450", label: "kWh Traded" },
    { value: "K0.54", label: "Avg Price/kWh" },
    { value: "8.2T", label: "CO₂ Saved" }
  ];

  const recentTrades = [
    { id: 1, seller: "SolarFarm1", amount: "5.2 kWh", price: "$0.12", rating: 4.8 },
    { id: 2, seller: "WindEnergyCo", amount: "3.1 kWh", price: "$0.15", rating: 4.9 }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Peer-to-Peer Energy Trading</h1>
        <p className="lead">Buy and sell renewable energy directly with your community</p>
        <div className="mt-4">
          <a href="/buy" className="btn btn-primary me-2">Buy Energy</a>
          <a href="/sell" className="btn btn-secondary">Sell Energy</a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="card stat-card">
              <div className="stat-value">{stat.value}</div>
              <div>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container my-5">
        <h2 className="text-center mb-4">How It Works</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3>1. Connect</h3>
                <p>Link your smart meter or renewable energy source</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3>2. Trade</h3>
                <p>Set your prices or buy from local producers</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3>3. Earn/Save</h3>
                <p>Get paid automatically or enjoy lower energy costs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Trades */}
      <section className="container my-5">
        <h2 className="text-center mb-4">Recent Market Activity</h2>
        <div className="card">
          <div className="card-body">
            {recentTrades.map(trade => (
              <div key={trade.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <strong>{trade.seller}</strong> sold {trade.amount}
                </div>
                <div>
                  <span className="text-success me-2">{trade.price}/kWh</span>
                  <span>★ {trade.rating}</span>
                </div>
              </div>
            ))}
            <a href="/buy" className="btn btn-link d-block text-center mt-3">View All Offers</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;