function LoadingGrid({ count = 3, columns = 'md:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <>
      <p role="status" className="sr-only">Loading content...</p>
      <div aria-hidden="true" className={`grid gap-6 ${columns}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-[#27272A] bg-[#18181F] p-6"
          >
            <div className="shimmer h-40 rounded-lg bg-[#111116]" />
            <div className="shimmer mt-5 h-3 w-2/3 rounded-full bg-[#27272A]" />
            <div className="shimmer mt-3 h-3 w-full rounded-full bg-[#27272A]/70" />
            <div className="shimmer mt-3 h-3 w-4/5 rounded-full bg-[#27272A]/70" />
            <div className="mt-6 flex gap-2">
              <div className="shimmer h-6 w-16 rounded-full bg-[#27272A]/60" />
              <div className="shimmer h-6 w-20 rounded-full bg-[#27272A]/60" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default LoadingGrid
