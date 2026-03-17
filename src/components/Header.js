import { useAccount } from "../context/AccountContext";

const Navigation = () => {
  const account = useAccount();
  
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          EnerTrade
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/buy">
                Buy Energy
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/sell">
                Sell Energy
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Dashboard">
                Dashboard
              </a>
            </li>
          </ul>

          {account.address ? (
            <button className="btn btn-outline-success" type="button">
              <span className="d-none d-sm-inline">Connected: </span>
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </button>
          ) : (
            <button
              className="btn btn-primary"
              type="button"
              onClick={account.loadConnectedAccount}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;