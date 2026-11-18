import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { Inventory } from "./pages/Inventory";
import { Overview } from "./pages/Overview";
import { DesignSystem } from "./pages/DesignSystem";
import DeveloperHome from "./pages/DeveloperHome";
import ClientOwnerHome from "./pages/ClientOwnerHome";
import type { UserRole } from "./components/RoleSwitcher";

export default function App() {
  const [version, setVersion] = useState<1 | 2 | 3>(3);
  const [role, setRole] = useState<UserRole>(() =>
    window.location.hash === "#retirement-approvals" ? "Client owner" : "Lead",
  );
  const [clientPreview, setClientPreview] = useState(false);
  const [page, setPage] = useState<"Overview" | "Inventory" | "Design system">("Overview");
  const [inventoryPreset, setInventoryPreset] = useState<{
    stage?: string;
    decision?: string;
    validation?: string;
  } | null>(null);
  const navigate = (nextPage: "Overview" | "Inventory" | "Design system") => {
    if (nextPage === "Inventory") setInventoryPreset(null);
    setPage(nextPage);
  };
  const openFilteredInventory = (preset: {
    stage?: string;
    decision?: string;
    validation?: string;
  }) => {
    setInventoryPreset(preset);
    setPage("Inventory");
  };
  const changeRole = (nextRole: UserRole) => {
    setClientPreview(nextRole === "Client owner" && role === "Lead");
    setRole(nextRole);
    setInventoryPreset(null);
    setPage("Overview");
  };
  return (
    <AppShell
      page={page}
      onNavigate={navigate}
      version={version}
      onVersionChange={setVersion}
      role={role}
      onRoleChange={changeRole}
      clientPreview={clientPreview}
    >
      {page === "Overview" ? (
        role === "Developer" ? (
          <DeveloperHome key={`${version}-${role}`} />
        ) : role === "Client owner" ? (
          <ClientOwnerHome
            key={`${version}-${role}`}
            isPreview={clientPreview}
            onExitPreview={() => {
              setClientPreview(false);
              setRole("Lead");
              setPage("Overview");
            }}
          />
        ) : (
          <Overview
            key={version}
            onInventory={() => {
              setInventoryPreset(null);
              setPage("Inventory");
            }}
            onInventoryFilter={openFilteredInventory}
            version={version}
          />
        )
      ) : page === "Inventory" ? (
        <Inventory
          key={version}
          onOverview={() => setPage("Overview")}
          version={version}
          preset={version === 3 ? inventoryPreset : null}
        />
      ) : (
        <DesignSystem key={version} version={version} />
      )}
    </AppShell>
  );
}
