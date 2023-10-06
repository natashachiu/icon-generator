export function Button(props: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button {...props} className="bg-purple-500 hover:bg-purple-500 px-4 py-2 rounded">
      {props.children}
    </button>
  );
}