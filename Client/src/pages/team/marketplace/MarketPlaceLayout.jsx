import { NavLink, Outlet } from "react-router-dom";
import "./MarketplaceLayout.css";

function MarketplaceLayout() {
  return (
    <div className="marketplace-layout">

      <div className="marketplace-topbar">

        <div className="marketplace-tabs">

          <NavLink
            to="events"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Events
          </NavLink>

          <NavLink
            to=""
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Marketplace
          </NavLink>

          <NavLink
            to="messages"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Messages
          </NavLink>

        </div>

        <div className="marketplace-search">
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

      </div>

      <Outlet />

    </div>
  );
}

export default MarketplaceLayout;
