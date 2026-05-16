'use client';

export default function DeleteButton({ 
  action, 
  confirmMessage = 'Are you sure you want to delete this record?', 
  label = 'Delete',
  style = {}
}: { 
  action: () => Promise<void>, 
  confirmMessage?: string,
  label?: string,
  style?: React.CSSProperties
}) {
  const handleDelete = async () => {
    if (confirm(confirmMessage)) {
      await action();
    }
  };

  return (
    <button 
      onClick={handleDelete}
      style={{ 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        fontSize: '0.9rem', 
        fontWeight: '600',
        color: 'red',
        ...style 
      }}
    >
      {label}
    </button>
  );
}
