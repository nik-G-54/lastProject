const Loader = ({ label = 'Loading…' }) => (
  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
    <span className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-sky-100 border-t-sky-500" />
    <p className="mt-4 text-center text-sm text-slate-600">{label}</p>
  </div>
)

export default Loader



