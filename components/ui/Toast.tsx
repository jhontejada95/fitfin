interface ToastProps {
  message: string;
}

export const Toast = ({ message }: ToastProps) => {
  return (
    <div className="bg-slate-800 border border-slate-700 text-sm px-4 py-2 rounded-lg shadow">
      {message}
    </div>
  );
};
