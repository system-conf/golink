export function Logo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "text-3xl" : "text-base";
  return (
    <div className={`inline-flex items-baseline ${cls} font-bold tracking-tight leading-none select-none`}>
      <span className="text-gray-500">go</span>
      <span className="text-gray-300">link</span>
    </div>
  );
}
