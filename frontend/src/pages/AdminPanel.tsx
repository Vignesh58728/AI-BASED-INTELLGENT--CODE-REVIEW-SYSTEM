export function AdminPanel() {
   return (
      <div className="p-8">
         <h1 className="text-3xl font-bold mb-4">Admin Control</h1>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg border border-border">Total Users: 1,240</div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">Active Reviews: 45</div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border">System Status: Optimal</div>
         </div>
      </div>
   );
}
