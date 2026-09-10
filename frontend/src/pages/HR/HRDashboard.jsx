
import { useEffect, useState } from "react";
import api from "../../services/api";
import NotificationBell from "../../components/notifications/NotificationBell";

export default function HRDashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/hr/dashboard");

      setStats({
        employees: response.data.employees ?? 0,
        pending: response.data.pending_requests ?? 0,
        approved: response.data.approved_requests ?? 0,
        rejected: response.data.rejected_requests ?? 0,
      });
    } catch (error) {
      console.error("Erreur dashboard RH :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchDashboard);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chargement du dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4"><h1 className="text-3xl font-bold text-gray-800">Dashboard RH</h1><NotificationBell /></div>

        <p className="mt-1 text-gray-500">
          Vue globale de la gestion des congés
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {/* Employees */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">
            Employés
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-800">
            {stats.employees}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Total des employés
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">
            En attente
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            {stats.pending}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Demandes à traiter
          </p>
        </div>

        {/* Approved */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">
            Validées
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {stats.approved}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Demandes approuvées
          </p>
        </div>

        {/* Rejected */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">
            Refusées
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {stats.rejected}
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Demandes refusées
          </p>
        </div>

      </div>

      {/* Quick actions */}
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">

        <h2 className="text-xl font-semibold text-gray-800">
          Gestion RH
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-5">

          <a
            href="/hr/employees"
            className="rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50"
          >
            <h3 className="font-semibold text-gray-800">
              👥 Employés
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Consulter les employés
            </p>
          </a>

          <a
            href="/hr/leave-requests"
            className="rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50"
          >
            <h3 className="font-semibold text-gray-800">
              📋 Demandes
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Gérer les demandes de congés
            </p>
          </a>

          <a
            href="/hr/leave-balances"
            className="rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50"
          >
            <h3 className="font-semibold text-gray-800">
              📊 Soldes
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Consulter les soldes de congés
            </p>
          </a>

          <a href="/hr/calendar" className="rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50"><h3 className="font-semibold text-gray-800">Planning</h3><p className="mt-1 text-sm text-gray-500">Absences approuvées</p></a>
          <a href="/hr/reports" className="rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50"><h3 className="font-semibold text-gray-800">Rapports</h3><p className="mt-1 text-sm text-gray-500">Export paie CSV</p></a>

        </div>
      </div>

    </div>
  );
}

