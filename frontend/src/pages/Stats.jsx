import React, { useState, useEffect } from 'react';
import { apiClient, getUserId } from '../api/axiosClient';
import toast from 'react-hot-toast';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = getUserId();

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const fetchStats = async () => {
      try {
        const res = await apiClient.get(`/stats?userId=${userId}`);
        setStats(res.data.data);
      } catch (error) {
        console.error('Gagal memuat statistik:', error);
        toast.error('Gagal memuat statistik. Pastikan backend aktif.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userId]);

  const maxHours = stats?.weeklyData ? Math.max(...stats.weeklyData.map(d => d.hours), 1) : 1;

  return (
    <>
      <header className="h-16 fixed top-0 right-0 w-[calc(100%-260px)] z-10 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-margin-page">
        <h2 className="font-headline-md text-headline-md text-on-surface">Statistik</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setLoading(true); window.location.reload(); }}
            className="hover:bg-surface-container-low rounded-full p-2 text-on-surface-variant transition-colors"
            title="Refresh data"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </header>

      <div className="pt-24 px-margin-page pb-stack-lg">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <span className="material-symbols-outlined text-primary text-5xl animate-spin">refresh</span>
            <p className="ml-3 text-on-surface-variant">Memuat statistik...</p>
          </div>
        ) : !userId ? (
          <div className="text-center py-16">
            <p className="text-on-surface-variant">Kamu belum login. <a href="/login" className="text-primary underline">Login sekarang</a></p>
          </div>
        ) : (
          <>
            {/* Key Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-on-surface-variant font-label-sm">Total Tugas</p>
                  <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">task</span>
                </div>
                <p className="font-headline-lg text-headline-lg text-on-surface">
                  {stats?.totalTasks ?? 0}
                  <span className="text-body-md font-normal text-on-surface-variant ml-2">tugas</span>
                </p>
                <p className="text-body-sm text-on-surface-variant mt-2">
                  {stats?.completedTasks ?? 0} selesai, {stats?.pendingTasks ?? 0} pending
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-on-surface-variant font-label-sm">Tugas Selesai</p>
                  <span className="material-symbols-outlined text-tertiary bg-tertiary-fixed p-2 rounded-lg">check_circle</span>
                </div>
                <p className="font-headline-lg text-headline-lg text-on-surface">
                  {stats?.completedThisWeek ?? 0}
                  <span className="text-body-md font-normal text-on-surface-variant ml-2">minggu ini</span>
                </p>
                <p className="text-body-sm text-secondary mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check</span>
                  {stats?.completedTasks ?? 0} total selesai
                </p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-on-surface-variant font-label-sm">Produktivitas</p>
                  <span className="material-symbols-outlined text-secondary bg-secondary-fixed p-2 rounded-lg">bolt</span>
                </div>
                <p className="font-headline-lg text-headline-lg text-on-surface">{stats?.productivityScore ?? 0}%</p>
                <div className="w-full bg-surface-container-high h-2 rounded-full mt-4">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-700"
                    style={{ width: `${stats?.productivityScore ?? 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-on-surface-variant font-label-sm">Deadline Dekat</p>
                  <span className="material-symbols-outlined text-error bg-error-container p-2 rounded-lg">alarm</span>
                </div>
                <p className="font-headline-lg text-headline-lg text-on-surface">
                  {stats?.upcomingDeadlines ?? 0}
                  <span className="text-body-md font-normal text-on-surface-variant ml-2">tugas</span>
                </p>
                <p className="text-body-sm text-on-surface-variant mt-2">Dalam 7 hari ke depan</p>
              </div>
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-12 gap-6">
              {/* Bar Chart: Weekly Study Hours */}
              <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Aktivitas Belajar Mingguan</h3>
                    <p className="text-body-sm text-on-surface-variant">Jam belajar berdasarkan jadwal 7 hari terakhir</p>
                  </div>
                </div>

                {stats?.weeklyData && stats.weeklyData.some(d => d.hours > 0) ? (
                  <div className="h-56 w-full flex items-end justify-between gap-2 px-2 relative">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-t border-dashed border-outline-variant/30 w-full" />
                      ))}
                    </div>
                    {stats.weeklyData.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 flex-1 z-10">
                        <span className="text-xs text-on-surface-variant font-mono">{day.hours > 0 ? `${day.hours}j` : ''}</span>
                        <div className="w-full flex items-end justify-center" style={{ height: '180px' }}>
                          <div
                            className="w-4/5 max-w-[40px] bg-primary rounded-t-lg transition-all duration-700 hover:bg-primary/80 cursor-default"
                            style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: day.hours > 0 ? '4px' : '0' }}
                          />
                        </div>
                        <span className="text-xs text-on-surface-variant">{day.day}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-56 flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-outline">calendar_month</span>
                      <p className="text-on-surface-variant mt-3">Belum ada data jadwal. Buat jadwal pertamamu!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Donut Chart: Task Priority */}
              <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-gutter rounded-2xl border border-outline-variant shadow-sm flex flex-col">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Distribusi Tugas</h3>
                <p className="text-body-sm text-on-surface-variant mb-6">Berdasarkan tingkat prioritas</p>

                {stats?.totalTasks > 0 ? (
                  <>
                    <div className="flex-grow flex items-center justify-center relative mb-8">
                      <div className="relative w-44 h-44">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" fill="none" r="40" stroke="#f1f5f9" strokeWidth="12" />
                          {(() => {
                            const total = stats.totalTasks || 1;
                            const high = ((stats.highPriorityTasks || 0) / total) * 251.2;
                            const medium = ((stats.mediumPriorityTasks || 0) / total) * 251.2;
                            const low = ((stats.lowPriorityTasks || 0) / total) * 251.2;
                            return (
                              <>
                                <circle cx="50" cy="50" fill="none" r="40" stroke="#4648d4" strokeWidth="12" strokeDasharray={`${high} ${251.2 - high}`} strokeLinecap="round" />
                                <circle cx="50" cy="50" fill="none" r="40" stroke="#8792fe" strokeWidth="12" strokeDasharray={`${medium} ${251.2 - medium}`} strokeDashoffset={-high} strokeLinecap="round" />
                                <circle cx="50" cy="50" fill="none" r="40" stroke="#ffdcc5" strokeWidth="12" strokeDasharray={`${low} ${251.2 - low}`} strokeDashoffset={-(high + medium)} strokeLinecap="round" />
                              </>
                            );
                          })()}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold text-on-surface">{stats?.totalTasks ?? 0}</p>
                          <p className="text-label-sm text-on-surface-variant">Total</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <span className="text-body-sm text-on-surface">Penting (HIGH)</span>
                        </div>
                        <span className="text-label-md font-semibold">{stats?.highPriorityTasks ?? 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                          <span className="text-body-sm text-on-surface">Sedang (MEDIUM)</span>
                        </div>
                        <span className="text-label-md font-semibold">{stats?.mediumPriorityTasks ?? 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-tertiary-fixed"></div>
                          <span className="text-body-sm text-on-surface">Rendah (LOW)</span>
                        </div>
                        <span className="text-label-md font-semibold">{stats?.lowPriorityTasks ?? 0}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-outline">pie_chart</span>
                      <p className="text-on-surface-variant mt-3 text-sm">Belum ada tugas</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Insight Cards */}
              <div className="col-span-12 md:col-span-6 bg-primary-container text-on-primary-container p-6 rounded-2xl flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-xl">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div>
                  <h4 className="font-label-md text-lg mb-1">Ringkasan Mingguan</h4>
                  <p className="text-body-sm opacity-90">
                    Kamu menyelesaikan <b>{stats?.completedThisWeek ?? 0}</b> tugas minggu ini.
                    Total <b>{stats?.totalStudyHours ?? 0} jam</b> sesi belajar terjadwal.
                  </p>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 bg-surface-container-high p-6 rounded-2xl border border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-xl">
                    {stats?.totalTasks ?? 0}
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface">Total Tugas</p>
                    <p className="text-body-sm text-on-surface-variant">
                      {stats?.inProgressTasks ?? 0} sedang dikerjakan
                    </p>
                  </div>
                </div>
                <a href="/tasks" className="bg-white text-primary px-4 py-2 rounded-lg font-label-sm border border-outline-variant hover:bg-primary hover:text-white transition-all">
                  Kelola
                </a>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
