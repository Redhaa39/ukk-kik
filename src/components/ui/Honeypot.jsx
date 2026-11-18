// Anti-spam field: invisible to people, tempting to bots. api.js drops any
// submission where `website` is filled in. It sits off-screen (not display:none,
// which many bots detect) and is skipped by keyboard and screen readers.
function Honeypot({ value, onChange }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
    >
      <label htmlFor="hp-website">Leave this field empty</label>
      <input
        id="hp-website"
        type="text"
        name="website"
        value={value}
        onChange={onChange}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
}

export default Honeypot
