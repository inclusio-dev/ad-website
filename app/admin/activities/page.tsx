import dynamic from 'next/dynamic';

const ActivityManager = dynamic(() => import('@/components/ActivityManager'), {
  ssr: false,
});

export default function ActivitiesAdminPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black py-10 px-4">
      <ActivityManager />
    </main>
  );
}
